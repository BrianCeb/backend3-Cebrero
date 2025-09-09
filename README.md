# Backend3-Cebrero (Entrega Final)

## Descripción
Proyecto backend desarrollado con **Node.js, Express y MongoDB**.  
Incluye autenticación básica con JWT, manejo de usuarios, mascotas y adopciones.  

Se documenta con **Swagger**, tiene **tests funcionales** implementados con Mocha, Chai y Supertest, y el proyecto está **dockerizado** para su despliegue en cualquier entorno.

---

## Swagger
La documentación de la API se encuentra en:  
[http://localhost:8080/apidocs](http://localhost:8080/apidocs)

Módulo documentado: **Users**

---

##  Tests
Para ejecutar los tests (incluye `adoption.router.js`):

```bash
npm test


Los tests verifican:
- Crear, obtener y listar adopciones.
- Casos de error: usuario inexistente, mascota inexistente, mascota ya adoptada, id inválido

## Docker

https://hub.docker.com/r/brale23/backend3-cebrero  
Tags: `latest` · `1.0.0`
docker run -p 8080:8080 --env-file .env brale23/backend3-cebrero:1.0.0
---

##  Variables de entorno 

Ejemplo de configuración:
```env
PORT=8080
MONGO_URL=mongodb://host.docker.internal:27017/backend3
JWT_SECRET=supersecret
NODE_ENV=production
