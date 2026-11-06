# Solicitudes de crédito

Backend en NestJS + Knex + MySQL y frontend en React.

## Cómo ejecutarlo

Requisitos: Node.js 20+ y MySQL 8.0.16+.

### Backend

1. Crear el archivo `.env` a partir de `.env.example` con los datos de MySQL.
2. Instalar, crear la base de datos con sus tablas y cargar clientes de prueba:

```bash
npm install
npm run db:setup
npm run seed
npm run start:dev
```

La API queda en `http://localhost:3000`.

### Frontend

1. Crear `frontend/.env` a partir de `frontend/.env.example`.
2. Ejecutar:

```bash
cd frontend
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

### Tests

```bash
npm test
```

## Endpoints

- `GET /loan-applications?page=1&limit=10&status=approved&from=2026-11-01&to=2026-11-30`: lista con paginación y filtros opcionales.
- `POST /loan-applications`: crea una solicitud; si viene `approved`, genera las cuotas en una transacción.
- `GET /clients`: no lo pedía el enunciado; lo agregué para que el formulario permita buscar al cliente por nombre o DNI.

- `GET /loan-applications/:id/installments`: devuelve el plan de cuotas de una solicitud (404 si no existe).

## Arquitectura

Organicé el backend con Clean Architecture por capas: `domain` (entidades y el cálculo de cuotas), `application` (casos de uso, DTOs y contratos de repositorios), `infrastructure` (Knex) y `api` (controllers). Los casos de uso dependen de los contratos y no de Knex, por eso en los tests uso repositorios falsos.

## Decisiones

- Montos en `DECIMAL(12,2)` para evitar errores de redondeo con dinero.
- DNI como texto de 13 dígitos, porque puede empezar con 0.
- Llaves foráneas con `RESTRICT` para no perder el historial de solicitudes y pagos.
- Fechas guardadas y devueltas en UTC.
- Cuotas sin intereses (el esquema no tiene tasa): monto ÷ plazo, calculado en centavos. Los centavos que sobran van en la última cuota para que la suma sea exacta. La primera cuota vence un mes después de la creación.
- Si no se envía `status`, la solicitud queda como `pending`. Plazo máximo de 84 meses y `limit` máximo de 100.
- El rango de fechas del filtro incluye el día `to` completo. Si `from` es mayor que `to`, responde 400.
- Por tiempo, los casos de uso lanzan directamente excepciones de NestJS. En un proyecto más grande usaría errores de dominio propios con un Exception Filter global.

## Uso de knex.raw

Las consultas usan el query builder. Solo usé `knex.raw` en las migraciones, para las restricciones `CHECK` (como validar que el DNI tenga 13 dígitos con `REGEXP`), para que la base de datos proteja los datos aunque se inserte sin pasar por la API; y en `GET /health`, para verificar la conexión.

## Consultas SQL (Parte 2)

Están en la carpeta `sql/`, junto con los índices recomendados.

## Preguntas de criterio

**¿Cuándo usarías una transacción con Knex en este ejercicio?**
Al crear una solicitud aprobada, porque se guardan la solicitud y sus cuotas, y deben quedar consistentes decidi   en el repositorio de infraestructura: si falla cualquier insert, se revierte todo y nunca queda una solicitud aprobada sin su plan de pagos.

**¿Qué diferencia práctica hay entre un Guard y un Interceptor?**
El Guard decide si la petición puede llegar al handler, el Interceptor envuelve la ejecución antes y después, y puede transformar la respuesta, registrar logs o medir tiempos.

**¿Cómo evitar que la tabla se re-renderice al escribir en el buscador?**
Con debounce, para que el filtro solo cambie cuando el usuario deja de escribir, y con `React.memo` en la tabla, para que solo se vuelva a dibujar cuando cambian sus datos.
