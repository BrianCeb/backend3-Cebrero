# Backend3-Cebrero (Entrega Final)

## Descripción
Proyecto backend desarrollado con **Node.js, Express y MongoDB**.  
Incluye autenticación básica con JWT, manejo de usuarios, mascotas y adopciones.  

Se documenta con **Swagger**, tiene **tests funcionales** implementados con Mocha, Chai y Supertest, y el proyecto está **dockerizado** para su despliegue en cualquier entorno.

---

## Swagger
La documentación de la API se encuentra en:  
[http://localhost:8080/apidocs](http://localhost:8080/apidocs)

Módulos documentados:  Users,Pets, Adoptions y Sessions.

---

##  Tests
Supertest adoption.router.js

```bash
npm install
npm test
```

Los test comprueban :
- Crear, obtener y listar adopciones.
- Casos de error: usuario inexistente, mascota inexistente, mascota ya adoptada, id inválido

## Docker

Imagen disponible en Docker Hub: https://hub.docker.com/r/brale23/backend3-cebrero (tags `latest` y `1.0.0`).

Para construir la imagen localmente:

```bash
docker build -t brale23/backend3-cebrero:1.0.0 .
```

Para ejecutar la imagen:

```bash
docker run -p 8080:8080 --env-file .env brale23/backend3-cebrero:1.0.0
```
##  Variables de entorno 

Ejemplo de configuración:
```env
PORT=8080
MONGO_URL=mongodb://host.docker.internal:27017/backend3
JWT_SECRET=supersecret
NODE_ENV=production

```

© 2025 Brian Cebrero