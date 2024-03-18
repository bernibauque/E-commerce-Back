# Proyecto de Backend para Ecommerce

Este proyecto, denominado "ecomerce-back" en su versión 1.0.0, consiste en un backend desarrollado en Node.js para una aplicación de Ecommerce. Utiliza diversas bibliotecas y middlewares para proporcionar funcionalidades clave.

Para iniciar el servidor en modo de desarrollo, utiliza el comando `npm run server`.

## Bibliotecas Utilizadas

1. **bcrypt** (^5.1.1): Biblioteca para el hash de contraseñas.
2. **body-parser** (^1.20.2): Middleware para analizar cuerpos de solicitudes HTTP.
3. **cloudinary** (^2.0.3): API para almacenamiento y manipulación de imágenes en la nube.
4. **cookie-parser** (^1.4.6): Middleware para analizar cookies en solicitudes HTTP.
5. **dotenv** (^16.4.5): Carga de variables de entorno desde un archivo `.env`.
6. **express** (^4.18.3): Framework web de Node.js.
7. **express-async-handler** (^1.2.0): Manejador de errores asíncronos para Express.
8. **googleapis** (^133.0.0): API para acceder a servicios de Google.
9. **jsonwebtoken** (^9.0.2): Implementación de tokens JWT para autenticación.
10. **mongoose** (^8.2.1): Biblioteca para modelado de datos de MongoDB.
11. **morgan** (^1.10.0): Middleware para registro de solicitudes HTTP.
12. **multer** (^1.4.5-lts.1): Middleware para manejo de formularios multipartes.
13. **nodemailer** (^6.9.11): Librería para envío de correos electrónicos.
14. **path** (^0.12.7): Utilidades para manejo de rutas de archivos.
15. **sharp** (^0.33.2): Biblioteca para procesamiento de imágenes.
16. **slugify** (^1.6.6): Utilidad para generar slugs a partir de texto.

## Middlewares Utilizados

1. **BODY-PARSER**: Analiza cuerpos de solicitudes en formato JSON y urlencoded.
2. **COOKIE-PARSER**: Facilita el manejo de cookies en aplicaciones web.
3. **MORGAN**: Registra solicitudes HTTP entrantes en el servidor.