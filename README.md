# Redis Cached Data
Ejemplo del uso de Redis con Node.js como sistema para guardar datos de forma temporal y mejorar la velocidad al enviar datos al usuario.

## Redis
Se necesita tener instalado Redis en el SO, o bien se puede usar Docker:

**Run redis on docker:**
```shell
docker run -p 6379:3379 --name some-redis -d redis
```


Usar `redis-commander` para ver la base de datos de Redis.

**Run redis-commander:**
```shell
npx redis-commander
```

## Run Project
- `npm install` o `npm ci` para instalar las dependecias.
- Ejecutar la app con `npm run dev`.