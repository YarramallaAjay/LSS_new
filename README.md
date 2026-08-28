# Lalitha Surya Sweets — React + Spring Boot REST API

This is a refactor of the original Thymeleaf-based "LalithaSweets" e-commerce app into a
decoupled architecture:

- **`frontend/`** — a React 18 + Vite single-page app (storefront + admin panel), talking to the
  backend over a JSON REST API.
- **`backend/`** — the original Spring Boot app, converted from server-rendered Thymeleaf views
  into a pure REST API (`/api/**`), backed by a PostgreSQL schema.

## What changed from the original repo

- All Thymeleaf templates, `HomeController`/`CartController`/`CheckoutController`/admin
  controllers etc. were replaced with `*ApiController` classes under `/api/**` that return JSON
  DTOs instead of rendering views.
- Admin authentication moved from session/form login to stateless **JWT** (`/api/admin/auth/login`
  issues a token; the React admin panel stores it and sends `Authorization: Bearer <token>`).
- The guest shopping cart is still backed by the HttpSession (it's anonymous, ephemeral state —
  there's nothing to gain from JWT-ifying it), so the frontend calls the cart API with
  `credentials: include` and the backend CORS config allows credentials from the configured
  frontend origin.
- JPA entities are never serialized directly — every API response goes through a DTO
  (`OrderDto`, `ProductDto`, `CustomerDto`, ...) to avoid the `Order ↔ Customer` circular
  reference and lazy-loading leaks that the entity graph has.
- **Every secret was pulled out of source control.** `application.properties` now reads
  everything (DB credentials, mail credentials, Razorpay keys, JWT signing secret, admin seed
  password) from environment variables — see [Security](#security--rotate-leaked-secrets) below,
  this is important.
- A global `@RestControllerAdvice` (`GlobalExceptionHandler`) gives every endpoint a consistent
  JSON error shape instead of ad hoc handling per controller.
- Found and fixed a real bug in the original code: `repository/historyRepository.java` had a
  static `save()` method with an empty body, so order-status history silently never persisted for
  orders placed through the old checkout flow. It's gone; the correct Spring Data
  `OrderStatusHistoryRepository` is used everywhere now.

## Security — rotate leaked secrets

The original repository had real credentials committed in `application.properties` and in
`EmailService`/`InvoiceService` (a hardcoded personal ngrok URL). Removing them from the current
files does **not** remove them from git history — anyone with read access to the repo's history
can still see them. Before making this repository public or sharing it further, please:

1. **Rotate the Gmail App Password** used for `spring.mail.password` (generate a new one at
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and revoke the
   old one).
2. **Rotate the Razorpay key/secret** that were hardcoded (regenerate in the Razorpay dashboard).
3. **Change the database root/app password** if the same one is still in use anywhere.
4. **Change the admin panel password** — the original app seeded a hardcoded `admin123` password
   on first run. The new `DataInitializer` either uses `ADMIN_DEFAULT_PASSWORD` from your `.env`
   or generates a random one and logs it once at startup; either way, log in and change it (or
   set your own via env) before going live.
5. Optionally, scrub the old secrets from git history entirely (e.g. `git filter-repo` or BFG
   Repo-Cleaner) if this repo will ever be public.

None of the above is optional — those values were exposed in a public-facing repo, so treat them
as compromised regardless of whether anyone is known to have used them.

## Prerequisites

- Java 17+, Maven 3.9+ (or use the Docker setup and skip installing these locally)
- Node.js 20+, npm (or Docker)
- PostgreSQL 16 (or Docker)
- A Razorpay account (test keys are fine for development)
- A Gmail account with an App Password (or any SMTP provider) for order-confirmation emails
- Optional: a local WhatsApp gateway (e.g. a `whatsapp-web.js` bridge) listening on
  `http://localhost:3000/send` for WhatsApp notifications — the app degrades gracefully (logs a
  warning, doesn't fail the request) if this isn't running

## Quick start with Docker Compose

```bash
cp .env.example .env
# edit .env and fill in real values (DB passwords, mail creds, Razorpay keys, JWT secret, admin password)

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

Compose builds the backend jar and the frontend static bundle from source, so there's no need to
run Maven or npm on your host machine for this path.

## Running locally without Docker

### Backend

```bash
cd backend
cp .env.example .env
# edit .env, then export the vars (or use a tool like `direnv`/`dotenv-cli`)
export $(grep -v '^#' .env | xargs)   # simple way to load .env into the shell on macOS/Linux

mvn clean install
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. On first run against an empty database it seeds
one admin account from `ADMIN_DEFAULT_USERNAME`/`ADMIN_DEFAULT_PASSWORD` (or logs a generated
password if you didn't set one — check the startup logs).

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` (Vite's default) and expects the backend at the
URL in `VITE_API_BASE_URL` (`http://localhost:8080` by default).

> **Note on this delivery:** this project was built in a sandboxed environment without access to
> Maven Central or the npm registry, so `mvn clean install` and `npm install && npm run build`
> could not actually be executed here to verify the build. Everything was written carefully and
> cross-checked by hand (endpoint-by-endpoint against the frontend API calls, repository methods
> against their usages, no dangling imports), but please run the real build as your first step
> and let me know if anything doesn't compile — happy to fix it.

## Project structure

```
.
├── backend/            Spring Boot REST API (Java 17)
│   ├── src/main/java/com/lalitha/sweets/
│   │   ├── controller/  REST controllers (/api/**)
│   │   ├── dto/         Response/request DTOs
│   │   ├── model/       JPA entities
│   │   ├── repository/  Spring Data repositories
│   │   ├── service/     Business logic (cart, orders, email, WhatsApp, invoices, ...)
│   │   ├── security/    JWT filter/service
│   │   └── config/      Security config, global exception handling
│   ├── .env.example
│   └── Dockerfile
├── frontend/            React 18 + Vite SPA
│   ├── src/
│   │   ├── api/          One file per backend resource (axios calls)
│   │   ├── context/       CartContext, AuthContext
│   │   ├── components/    Shared layout/UI
│   │   ├── pages/         Storefront pages
│   │   └── pages/admin/   Admin panel pages
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
└── .env.example         Env file for docker-compose itself
```

## API overview

All endpoints are under `/api`. Public/storefront endpoints (`/api/home/**`, `/api/products/**`,
`/api/cart/**`, `/api/checkout/**`, `/api/orders/**`) require no auth. `/api/admin/**` (other than
`/api/admin/auth/login`) requires a valid admin JWT.

| Area | Endpoints |
|---|---|
| Products | `GET /api/products`, `GET /api/products/category/{category}` |
| Home | `GET /api/home/featured`, `/sweet`, `/hot` |
| Cart | `GET /api/cart`, `POST /api/cart/add`, `/update`, `/remove`, `/clear` |
| Checkout | `GET /api/checkout`, `GET /api/checkout/pincode/{pincode}`, `POST /api/checkout/place-order`, `POST /api/checkout/payment-verify`, `GET /api/checkout/order/{id}`, `GET /api/checkout/invoice/{id}` |
| Order tracking | `GET /api/orders/{id}/track`, `POST /api/orders/{id}/cancel` |
| Admin auth | `POST /api/admin/auth/login` |
| Admin dashboard | `GET /api/admin/dashboard` |
| Admin orders | `GET /api/admin/orders`, `GET /{id}`, `PUT /{id}/status` |
| Admin products | `GET /api/admin/products`, `GET/POST/PUT/DELETE /{id}`, `POST /{id}/toggle` |
| Admin customers | `GET /api/admin/customers` |

## License / attribution

This is a refactor of the original `LS_Sweets` project — same functionality, new architecture.
