const express = require('express');
const axios = require('axios');
const responseTime = require('response-time');
const redis = require('redis');
const { promisify } = require('util');
const { json } = require('express');

const app = express();

// Connect to redis server on 127.0.0.1:6379
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
});

// Promisify Get and Set methods
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

// Midleware
app.use(responseTime());

// Get all characters from rick and morty api
app.get('/character', async (req, res) => {
    try {
        // Search for data on redis
        const reply = await GET_ASYNC('character');

        // If exists, return from redis and finish with response
        if (reply) return res.send(JSON.parse(reply));

        // Fetching data from Rick and Morty API
        const response = await axios.get('https://rickandmortyapi.com/api/character/');

        // Saving the response in Redis. The "EX" and 10, sets an expiration of 10 Seconds
        const saveResult = await SET_ASYNC('character', JSON.stringify(response.data), 'EX', 10);

        // return the response with the data to the client
        res.send(response.data);
    } catch (error) {
        console.log(error);
    }
});

// Get a Single Character from Rick and Morty API passing the id
app.get('/character/:id', async (req, res) => {
    try {
        // Search for data on redis
        const reply = await GET_ASYNC(`character:${req.params.id}`);

        // If exists, return from redis and finish with response
        if (reply) {
            console.log('Returning from cached data');
            return res.send(JSON.parse(reply));
        }

        // Fetching data from Rick and Morty API
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${req.params.id}`);

        // Saving the response in Redis. The "EX" and 15, sets an expiration of 15 Seconds
        const saveResult = await SET_ASYNC(`character:${req.params.id}`, JSON.stringify(response.data), 'EX', 15);

        // return the response with the data to the client
        res.send(response.data);
    } catch (error) {
        return res.status(error.response.status).send(json({message: error.message}));
    }
});

// Run server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
