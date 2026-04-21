# Guia Del Proyecto Backend

## 1. Idea Principal Del Proyecto

Este proyecto es un backend REST hecho con Spring Boot para un sistema de venta/catalogo con usuarios, roles, items, categorias, carrito, fotos de producto y pedidos.

La idea general es separar el sistema en capas para que cada parte tenga una responsabilidad clara:

- `controllers`: reciben requests HTTP y devuelven responses HTTP.
- `service`: contiene la logica de negocio.
- `repository`: accede a la base de datos.
- `entity`: representa las tablas y relaciones persistidas.
- `dto` y `Requests`: definen que entra y que sale por la API.
- `auth` y `security`: resuelven login, JWT y permisos.
- `exception` y `api`: unifican la forma en que el backend responde exitos o errores.

En otras palabras, el proyecto sigue esta idea:

`Cliente/Postman -> Controller -> Service -> Repository -> Base de datos`

Y para la salida:

`Base de datos -> Repository -> Service -> Mapper/DTO -> Controller -> ApiResponse -> Cliente`

## 2. Estructura De Carpetas

### `src/main/java/com/uade/tpo/demo`

Es la raiz del codigo fuente Java principal.

#### `DemoApplication.java`

Es el punto de entrada del proyecto.

- Tiene `@SpringBootApplication`.
- Arranca Spring Boot.
- Hace que Spring escanee componentes, configuraciones, servicios, repositorios y controllers.

Sin esta clase, la aplicacion no levantaria.

### `api`

Contiene clases auxiliares para el formato general de respuesta.

#### `ApiResponse.java`

Es la envoltura estandar que usa la API para responder.

Incluye:

- `success`: indica si la operacion fue exitosa o no.
- `message`: mensaje legible para el cliente.
- `data`: informacion devuelta.
- `timestamp`: momento de la respuesta.

Esto ayuda a que el backend responda de manera consistente y predecible.

### `auth`

Contiene la autenticacion y el soporte de JWT.

#### Archivos principales

- `AuthController.java`: expone el endpoint `POST /auth/login`.
- `AuthRequest.java`: body esperado para login.
- `AuthResponse.java`: respuesta del login con token, usuario y rol.
- `AuthService.java`: valida username y password.
- `CustomUserDetailsService.java`: integra usuarios del proyecto con Spring Security.
- `JwtService.java`: genera y valida tokens JWT.
- `JwtAuthenticationFilter.java`: intercepta requests, lee el token y autentica al usuario si el token es valido.

### `controllers`

Contiene los endpoints REST del sistema.

Cada controller representa un recurso funcional:

- `UsuarioController`
- `RolController`
- `CategoriaController`
- `ItemController`
- `FotoProductoController`
- `CarritoController`
- `PedidoController`

Los controllers no deberian contener la logica pesada del negocio. Su trabajo principal es:

- recibir la request
- validar el body con `@Valid`
- llamar al service correspondiente
- devolver una respuesta con `ApiResponse`

### `controllers/config`

Configura comportamiento global del backend.

#### `SecurityConfig.java`

Define las reglas de seguridad:

- que endpoints son publicos
- cuales requieren login
- cuales son solo admin
- uso de JWT sin sesiones

#### `ApplicationConfig.java`

Define beans globales y datos iniciales:

- `PasswordEncoder` con BCrypt
- `CommandLineRunner` para crear roles base y un usuario admin inicial

### `dto`

Contiene los DTO de salida.

DTO significa `Data Transfer Object`.

Se usan para devolver datos al cliente sin exponer directamente toda la entidad JPA.

Ejemplos:

- `UsuarioResponse`
- `ItemResponse`
- `CategoriaResponse`
- `CarritoResponse`
- `PedidoResponse`
- `DetallePedidoResponse`

Ventajas:

- evita devolver relaciones innecesarias
- evita ciclos infinitos al serializar entidades
- desacopla la respuesta HTTP del modelo de base de datos
- permite diseñar respuestas mas limpias

### `entity`

Contiene las entidades JPA.

Estas clases representan las tablas de base de datos y sus relaciones.

Entidades principales:

- `Usuario`
- `Rol`
- `Categoria`
- `Item`
- `FotoProducto`
- `Carrito`
- `ItemCarrito`
- `Pedido`
- `DetallePedido`
- `EstadoPedido`

Aqui se ve el DER traducido a objetos Java.

Ejemplos de relaciones:

- un `Usuario` tiene un `Rol`
- un `Usuario` tiene un `Carrito`
- un `Usuario` tiene muchos `Pedido`
- un `Item` pertenece a una `Categoria`
- un `Carrito` tiene muchos `ItemCarrito`
- un `Pedido` tiene muchos `DetallePedido`

### `exception`

Contiene excepciones del dominio y el manejador global.

Archivos importantes:

- `BadRequestException`
- `NotFoundException`
- `ConflictException`
- `ForbiddenException`
- `ApiExceptionHandler`

`ApiExceptionHandler` usa `@RestControllerAdvice` para atrapar errores y transformarlos en respuestas JSON estandarizadas.

### `mapper`

Contiene transformaciones entre entidades y DTOs.

#### `ResponseMapper.java`

Convierte entidades como `Usuario`, `Item`, `Pedido` o `Carrito` en DTOs de salida.

Esto evita meter logica de presentacion dentro de services o controllers.

### `repository`

Contiene interfaces de acceso a datos.

Estas interfaces extienden `JpaRepository`, por ejemplo:

- `UsuarioRepository`
- `ItemRepository`
- `PedidoRepository`
- `CarritoRepository`

Spring Data JPA implementa estas interfaces automaticamente en tiempo de ejecucion.

Eso significa que no hace falta escribir SQL manual para operaciones basicas como:

- guardar
- buscar por id
- listar
- eliminar

Y tambien se pueden declarar consultas derivadas por nombre, por ejemplo:

- `findByUsername`
- `findByEmail`
- `findByUsuarioId`

### `Requests`

Contiene DTOs de entrada.

Son los cuerpos esperados por los endpoints.

Ejemplos:

- `UsuarioRequest`
- `UsuarioUpdateRequest`
- `ItemRequest`
- `CategoriaRequest`
- `ItemCarritoRequest`
- `PedidoEstadoRequest`

Estos objetos se usan con validaciones como:

- `@NotBlank`
- `@NotNull`
- `@Min`
- `@Email`
- `@Size`

Esto ayuda a validar la request antes de entrar a la logica de negocio.

Observacion: el nombre del paquete esta escrito como `Requests` con mayuscula. Funciona, pero por convencion Java normalmente seria mejor `requests` en minuscula.

### `security`

Contiene logica de seguridad complementaria.

#### `CurrentUserService.java`

Sirve para:

- obtener el usuario autenticado actual
- saber si es admin
- validar que un usuario solo acceda a sus propios recursos, salvo que sea admin

Es una pieza importante para evitar duplicar controles de permisos en todos los controllers.

### `service`

Contiene la logica de negocio real del sistema.

Hay interfaces y sus implementaciones concretas en el mismo paquete:

- `UsuarioService` / `UsuarioServiceImpl`
- `ItemService` / `ItemServiceImpl`
- `CarritoService` / `CarritoServiceImpl`
- `PedidoService` / `PedidoServiceImpl`

La capa service decide que hacer con los datos.

Ejemplos:

- crear usuarios
- validar duplicados
- agregar items al carrito
- calcular total
- convertir carrito en pedido
- descontar stock
- cancelar pedido y devolver stock

## 3. Recursos En `src/main/resources`

### `application.properties`

Define configuracion principal de la aplicacion:

- puerto del servidor
- datasource
- dialecto JPA
- Flyway
- JWT
- H2 console

Hoy el proyecto esta configurado para correr localmente en:

- `server.port=4002`

Y usa por defecto H2 en archivo local, aunque tambien esta preparado para trabajar con PostgreSQL mediante variables de entorno.

### `application.properties.example`

Sirve como ejemplo de configuracion.

Es util para entender que variables puede usar el proyecto en otros ambientes.

### `logback-spring.xml`

Configura logging.

Controla como se imprimen logs en consola o archivo.

### `db/migration/V1__init.sql`

Es la migracion inicial de Flyway.

Define:

- tablas
- claves primarias
- claves foraneas
- insercion de roles base

Esto es importante porque permite versionar el esquema de base de datos junto con el codigo.

## 4. Estructura De Tests

### `src/test/java`

Contiene pruebas automatizadas.

Hay dos tipos visibles:

- tests de servicios
- tests de integracion de seguridad/catalogo

Ejemplos:

- `PedidoServiceImplTest`
- `UsuarioServiceImplTest`
- `PublicCatalogAccessIntegrationTest`

### `src/test/resources/application.properties`

Configuracion especial para tests.

Usa H2 en memoria, lo cual hace que las pruebas sean mas rapidas y aisladas.

## 5. Relacion Entre Las Carpetas

La relacion entre capas puede entenderse asi:

1. El cliente hace una request HTTP.
2. El `controller` correspondiente recibe la request.
3. El controller convierte el body en un objeto de `Requests`.
4. Si la request requiere autenticacion, `security` y `auth` intervienen antes.
5. El controller llama a un `service`.
6. El service usa uno o mas `repository`.
7. Los repositories interactuan con las `entity` y la base.
8. El service devuelve entidades o resultados.
9. El `mapper` transforma entidades en `dto`.
10. El controller envuelve la respuesta en `ApiResponse`.
11. Si ocurre un error, `ApiExceptionHandler` lo transforma en respuesta JSON.

## 6. Como Se Implementa Spring Boot En Este Proyecto

Spring Boot resuelve gran parte del arranque automatico del backend.

Gracias a `@SpringBootApplication`, Spring:

- detecta controllers
- detecta services
- detecta repositories
- detecta configuraciones
- crea beans automaticamente
- levanta el servidor embebido

El `pom.xml` muestra las piezas clave del ecosistema Spring usadas por el proyecto:

- `spring-boot-starter-web`: API REST
- `spring-boot-starter-data-jpa`: persistencia ORM
- `spring-boot-starter-security`: autenticacion/autorizacion
- `spring-boot-starter-validation`: validacion de requests
- `spring-boot-starter-actuator`: monitoreo
- `flyway-core`: migraciones de base

## 7. Inyeccion De Dependencias Y Acoplamiento

La inyeccion de dependencias si se esta usando.

Se ve sobre todo en los constructores. Por ejemplo:

- un controller recibe un service
- un service recibe repositories
- `SecurityConfig` recibe el filtro JWT y `ObjectMapper`
- `AuthService` recibe `UsuarioRepository`, `PasswordEncoder` y `JwtService`

Esto reduce el acoplamiento porque una clase no crea sus dependencias con `new`.

Beneficios:

- las clases dependen de contratos, no de creacion manual
- es mas facil testear
- es mas facil cambiar implementaciones
- el codigo queda mas modular

### Acoplamiento En Este Proyecto

El proyecto esta relativamente bien desacoplado por capas:

- controller separado de service
- service separado de repository
- entity separada de dto
- seguridad separada de negocio

Pero no es un desacoplamiento extremo. Por ejemplo:

- las implementaciones `*ServiceImpl` conviven en el mismo paquete que las interfaces
- algunos controllers conocen directamente detalles de autorizacion mediante `CurrentUserService`

Eso no esta mal para un proyecto academico o mediano, pero en sistemas mas grandes podria separarse aun mas.

## 8. DTOs: Para Que Sirven Y Como Se Usan

El proyecto usa DTOs de entrada y salida.

### Entrada

Las clases en `Requests` representan lo que la API espera recibir.

Ejemplo:

- `UsuarioRequest` define los campos requeridos para registrar un usuario.

### Salida

Las clases en `dto` representan lo que la API devuelve.

Ejemplo:

- `UsuarioResponse` devuelve `id`, `username`, `email`, `nombre`, `apellido` y `rol`
- no devuelve la password

### Mapper

`ResponseMapper` es la pieza que toma una entidad y la traduce a un DTO.

Esto es importante porque:

- protege datos sensibles
- evita devolver entidades crudas
- mejora la claridad de la API
- disminuye acoplamiento entre persistencia y capa HTTP

## 9. Manejo De Errores

El backend usa un enfoque centralizado.

### Excepciones De Negocio

Se lanzan excepciones especificas como:

- `NotFoundException`
- `BadRequestException`
- `ConflictException`
- `ForbiddenException`

### Manejador Global

`ApiExceptionHandler` atrapa esas excepciones y devuelve respuestas JSON coherentes.

Ejemplos de salida:

- recurso no encontrado
- request invalida
- conflicto por duplicado
- acceso prohibido
- credenciales invalidas

Tambien maneja:

- validaciones de `@Valid`
- body invalido
- `Content-Type` incorrecto
- errores genericos inesperados

### Formato Estandar

En general, el sistema responde con:

```json
{
  "success": true,
  "message": "Operacion realizada correctamente",
  "data": {},
  "timestamp": "2026-04-20T10:00:00"
}
```

O, si hay error:

```json
{
  "success": false,
  "message": "Descripcion del error",
  "data": null,
  "timestamp": "2026-04-20T10:00:00"
}
```

Esto le da consistencia a la API.

## 10. Como Se Implementa JWT

JWT se usa para autenticar usuarios sin mantener sesion en el servidor.

### Paso 1: Login

El cliente hace:

- `POST /auth/login`

Manda:

- `username`
- `password`

### Paso 2: Validacion De Credenciales

`AuthService`:

- busca el usuario en base de datos
- compara password
- si es valida, genera token JWT

### Paso 3: Generacion Del Token

`JwtService` genera un token firmado con:

- `subject`: username
- claim `userId`
- claim `rol`
- fecha de emision
- fecha de expiracion

El secreto se toma desde `application.properties` o desde variables de entorno.

### Paso 4: Uso En Requests Protegidas

El cliente manda:

```http
Authorization: Bearer TU_TOKEN
```

### Paso 5: Filtro JWT

`JwtAuthenticationFilter`:

- lee el header `Authorization`
- extrae el token
- valida firma y expiracion
- obtiene el username
- carga el usuario con `CustomUserDetailsService`
- si todo es correcto, coloca la autenticacion en el `SecurityContext`

### Paso 6: Autorizacion

`SecurityConfig` decide si ese usuario puede acceder o no segun:

- endpoint
- metodo HTTP
- rol del usuario

## 11. Seguridad Y Permisos

La seguridad esta basada en roles y rutas.

Actualmente la idea es:

- catalogo publico para lectura
- registro y login publicos
- carrito, compra y datos personales para usuario autenticado
- administracion del catalogo y estados de pedidos para admin

Ejemplos:

- cualquiera puede ver `GET /items`
- cualquiera puede hacer `POST /usuarios`
- solo admin puede hacer `POST /items`
- solo el usuario dueño o un admin puede ver su carrito o sus pedidos

## 12. Persistencia De Datos

La persistencia esta implementada con:

- Spring Data JPA
- Hibernate
- Flyway

### JPA/Hibernate

Las `entity` representan tablas y Hibernate se encarga de mapear objetos Java a registros de la base.

### Repositories

Los repositories ejecutan operaciones sobre la base sin necesidad de SQL manual para los casos mas comunes.

### Flyway

Flyway versiona la estructura de la base de datos mediante scripts SQL.

En este proyecto, `V1__init.sql` crea el esquema inicial.

### Base Local Y Produccion

En local:

- H2 en archivo local `./data/demo`

En un entorno mas real:

- PostgreSQL mediante variables de entorno

## 13. Ejemplo De Flujo Completo: Checkout

Un buen ejemplo para entender como colaboran las carpetas es el checkout.

### Flujo

1. El cliente autenticado llama a `POST /pedidos/checkout/{usuarioId}`.
2. `PedidoController` recibe la request.
3. `CurrentUserService` valida que sea el mismo usuario o un admin.
4. `PedidoServiceImpl` busca el carrito del usuario.
5. Verifica que el carrito no este vacio.
6. Recorre los items del carrito.
7. Valida stock.
8. Descuenta stock de cada item.
9. Crea un `Pedido`.
10. Crea `DetallePedido` por cada item.
11. Calcula total.
12. Guarda el pedido usando `PedidoRepository`.
13. Vacia el carrito.
14. `ResponseMapper` convierte el pedido en `PedidoResponse`.
15. El controller devuelve `ApiResponse.success(...)`.

Ese flujo muestra muy bien la relacion entre:

- controller
- security
- service
- repository
- entity
- dto
- api response

## 14. Como Se Traduce El DER A Este Proyecto

El DER original se implementa en el codigo de forma bastante directa:

- `Usuario` <-> `Rol`
- `Usuario` <-> `Carrito`
- `Usuario` <-> `Pedido`
- `Categoria` <-> `Item`
- `Carrito` <-> `ItemCarrito` <-> `Item`
- `Pedido` <-> `DetallePedido` <-> `Item`
- `Item` <-> `FotoProducto`

Hay algunos cambios de nombre respecto del DER:

- en vez de `Orden`, el proyecto usa `Pedido`
- en vez de `Item_Orden`, el proyecto usa `DetallePedido`

Eso no cambia la idea conceptual, solo el nombre elegido en la implementacion.

## 15. Principales Fortalezas Del Proyecto

- separacion clara por capas
- uso de DTOs
- seguridad JWT
- validaciones con anotaciones
- errores bastante centralizados
- migraciones versionadas con Flyway
- posibilidad de correr localmente sin depender de una base externa
- test basicos ya presentes

## 16. Cosas A Tener En Cuenta

- el formato uniforme de errores esta bastante avanzado, pero siempre se puede seguir cerrando para cubrir todos los edge cases HTTP
- hay archivos `.DS_Store` dentro del proyecto que no aportan a Java y convendria limpiar
- el paquete `Requests` podria renombrarse a `requests` por convencion
- el proyecto mezcla interfaces e implementaciones dentro del mismo paquete `service`, lo cual es valido pero podria organizarse distinto en una version mas grande

## 17. Resumen Final Para Explicarlo En Una Leccion

Si tuvieras que explicarlo de forma corta, podrias decir algo asi:

> Este proyecto es un backend REST en Spring Boot para un ecommerce/catalogo. Usa una arquitectura en capas donde los controllers exponen endpoints, los services aplican la logica de negocio, los repositories acceden a la base y las entities representan el modelo persistido. La seguridad se resuelve con Spring Security y JWT, las respuestas se estandarizan con `ApiResponse`, los DTOs evitan exponer directamente las entidades y Flyway versiona la base de datos. El checkout del carrito a pedido muestra bien como interactuan todas las capas del sistema.

## 18. Archivo Utiles Para Estudiar Primero

Si queres recorrer el proyecto en un orden pedagogico, te conviene leer:

1. `pom.xml`
2. `DemoApplication.java`
3. `application.properties`
4. `SecurityConfig.java`
5. `ApiResponse.java`
6. `ApiExceptionHandler.java`
7. `Usuario`, `Item`, `Carrito`, `Pedido`
8. `UsuarioController`, `ItemController`, `PedidoController`
9. `UsuarioServiceImpl`, `CarritoServiceImpl`, `PedidoServiceImpl`
10. `JwtService`, `JwtAuthenticationFilter`, `AuthService`
11. `ResponseMapper`
12. `V1__init.sql`

Con ese recorrido se entiende bastante rapido toda la arquitectura.
