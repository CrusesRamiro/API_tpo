# Documentacion JWT

## Objetivo

Se implemento autenticacion basada en JWT para que el backend pueda:

- autenticar usuarios con `username` y `password`
- emitir un token al hacer login
- proteger endpoints usando `Authorization: Bearer <token>`
- trabajar de forma stateless, sin sesion de servidor

## Archivos agregados

Se agrego un nuevo paquete `auth` con estos archivos:

- `src/main/java/com/uade/tpo/demo/auth/AuthController.java`
- `src/main/java/com/uade/tpo/demo/auth/AuthService.java`
- `src/main/java/com/uade/tpo/demo/auth/AuthRequest.java`
- `src/main/java/com/uade/tpo/demo/auth/AuthResponse.java`
- `src/main/java/com/uade/tpo/demo/auth/JwtService.java`
- `src/main/java/com/uade/tpo/demo/auth/JwtAuthenticationFilter.java`
- `src/main/java/com/uade/tpo/demo/auth/CustomUserDetailsService.java`

## Archivos modificados

Tambien se ajustaron estos archivos existentes:

- `src/main/java/com/uade/tpo/demo/controllers/config/SecurityConfig.java`
- `src/main/java/com/uade/tpo/demo/service/UsuarioServiceImpl.java`
- `src/main/java/com/uade/tpo/demo/entity/Usuario.java`
- `src/main/resources/application.properties`

## Que hace cada parte

### 1. AuthController

Expone el endpoint de login:

- `POST /auth/login`

Recibe usuario y contrasena, delega la validacion a `AuthService` y devuelve el token JWT.

### 2. AuthService

Se encarga de:

- buscar el usuario por `username`
- validar la contrasena
- generar la respuesta de autenticacion

Compatibilidad actual:

- si la contrasena almacenada ya esta en BCrypt, usa `PasswordEncoder.matches(...)`
- si la contrasena almacenada es legacy en texto plano, compara directo

Esto se dejo asi para no romper usuarios ya existentes en la base.

### 3. JwtService

Se encarga de:

- generar el token JWT
- extraer el `username` del token
- validar expiracion y firma

Claims incluidos en el token:

- `sub`: username
- `userId`: id del usuario
- `rol`: rol del usuario
- `iat`: fecha de emision
- `exp`: fecha de expiracion

### 4. JwtAuthenticationFilter

Es un filtro que corre en cada request.

Su trabajo es:

- leer el header `Authorization`
- verificar que empiece con `Bearer `
- extraer y validar el token
- cargar el usuario autenticado en el `SecurityContext`

Si el token es invalido, se limpia el contexto y la request no queda autenticada.

### 5. CustomUserDetailsService

Permite a Spring Security cargar usuarios desde la base de datos usando `UsuarioRepository`.

Devuelve un `UserDetails` con:

- username
- password
- authorities basadas en el rol

### 6. SecurityConfig

Se cambio la configuracion de seguridad para que:

- desactive CSRF
- use politica `STATELESS`
- agregue el filtro JWT antes de `UsernamePasswordAuthenticationFilter`
- deje solo algunas rutas publicas
- exija autenticacion para el resto

## Endpoints publicos

Quedaron publicos estos endpoints:

- `POST /auth/login`
- `POST /usuarios`
- `GET /items/**`
- `GET /categorias/**`
- `GET /roles/**`
- `GET /items/*/fotos`
- `/actuator/**`
- `/error`

## Endpoints protegidos

Todo endpoint que no este en la lista anterior requiere un JWT valido.

Ejemplos:

- `POST /pedidos/checkout/{usuarioId}`
- operaciones de carrito
- endpoints protegidos futuros

## Cambios en usuarios

### Encriptacion de password

En `UsuarioServiceImpl` ahora la contrasena se guarda usando BCrypt:

- antes: texto plano
- ahora: `passwordEncoder.encode(password)`

### Password oculta en respuestas

En la entidad `Usuario`, el campo `password` se marco como:

- `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)`

Eso significa:

- se puede recibir al crear usuario o loguearse
- no se devuelve en respuestas JSON

## Configuracion en application.properties

Se agregaron estas propiedades:

```properties
jwt.secret=...
jwt.expiration-ms=86400000
```

### jwt.secret

Es la clave usada para firmar y validar los tokens.

### jwt.expiration-ms

Es el tiempo de expiracion del token en milisegundos.

Valor actual:

- `86400000` = 24 horas

## Flujo de autenticacion

1. El cliente crea un usuario con `POST /usuarios` o usa uno ya existente.
2. Hace login en `POST /auth/login`.
3. El backend valida credenciales.
4. Si las credenciales son correctas, devuelve un JWT.
5. El cliente manda ese token en las requests protegidas.
6. El filtro JWT valida el token y autentica al usuario.

## Request de login

```json
{
  "username": "ramiro",
  "password": "1234"
}
```

## Response de login

```json
{
  "token": "JWT_AQUI",
  "tokenType": "Bearer",
  "userId": 1,
  "username": "ramiro",
  "rol": "ROLE_CLIENTE"
}
```

## Como usar el token

En cualquier endpoint protegido, enviar:

```http
Authorization: Bearer JWT_AQUI
```

## Ejemplo con checkout

```http
POST /pedidos/checkout/1
Authorization: Bearer JWT_AQUI
```

## Respuestas de error

Actualmente:

- login invalido devuelve `401 Unauthorized`
- request sin token en endpoint protegido devuelve `401 Unauthorized`
- token invalido o vencido no autentica la request

Todavia no se implemento una respuesta estandar global tipo:

```json
{
  "success": false,
  "message": "..."
}
```

Eso puede agregarse despues con `@ControllerAdvice`.

## Verificaciones realizadas

Se valido que la implementacion quede integrada con el proyecto:

- `./mvnw -q -DskipTests compile` OK
- `./mvnw -q test` OK

## Limitaciones actuales

- no hay refresh token
- no hay logout real del lado servidor
- no hay invalidacion manual de tokens
- no hay manejo global uniforme de errores
- aun no hay autorizacion fina por rol en cada endpoint

## Proximos pasos sugeridos

- agregar `@ControllerAdvice` para errores uniformes
- proteger endpoints por rol
- agregar refresh token
- mover `jwt.secret` a variables de entorno
- dejar todas las respuestas en un formato comun de exito/error

