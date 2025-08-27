docker-compose down
docker-compose up -d

Para ingresar a MongoDB desde tu contenedor Docker (`dashboard-asistencia-api-mongo-1`), puedes seguir estos pasos desde tu terminal de PowerShell:

---

### ✅ Paso 1: Ingresar al contenedor MongoDB

Ejecuta:

```bash
docker exec -it dashboard-asistencia-api-mongo-1 mongosh
```

Esto abrirá el cliente interactivo `mongosh` dentro del contenedor MongoDB.

---

### ✅ Paso 2: Verificar la conexión

Una vez dentro del prompt de `mongosh`, puedes verificar a qué base de datos estás conectado (por defecto es `test`):

```js
db
```

---

### ✅ Comandos útiles en `mongosh`

* Mostrar todas las bases de datos:

  ```js
  show dbs
  ```

* Cambiar a una base de datos específica:

  ```js
  use nombre_de_la_base
  ```

* Mostrar colecciones dentro de la base de datos:

  ```js
  show collections
  ```

* Consultar documentos de una colección:

  ```js
  db.nombre_coleccion.find().pretty()
  ```

---

Si no tienes `mongosh` instalado en tu contenedor de MongoDB por defecto (es raro, pero puede pasar), puedes probar con el cliente anterior:

```bash
docker exec -it dashboard-asistencia-api-mongo-1 mongo
```

¿Quieres conectarte desde otro contenedor (por ejemplo, tu app `dashboard-asistencia-api-app-1`) o desde tu host Windows también? Puedo ayudarte con eso si lo necesitas.
