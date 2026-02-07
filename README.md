# FinestControl API

A robust and scalable **financial control REST API** built with **TypeScript**, **Fastify**, and **Drizzle ORM**. This project is designed to manage personal or small-business finances, including transactions, tags, payment types, and monthly totals, with a strong focus on clean architecture, type safety, and maintainability.

---

## 🚀 Features

* 📊 **Transaction management** (create, list, filter by month, tag, or payment type)
* 🏷 **Tags system** with usage statistics and spending aggregation
* 💳 **Payment types** with soft-delete and restore support
* 💰 **Monthly and rough total amount calculations**
* 📁 **Spreadsheet (Excel) export** for reports
* ✅ **Schema validation** using Zod
* 🧱 **Strongly typed controllers and models**
* 🗃 **Database migrations** with Drizzle
* 🐳 **Docker & Docker Compose support**
* ☁️ **Ready for cloud deployment (Discloud)**

---

## 🛠 Tech Stack

* **Node.js**
* **TypeScript**
* **Fastify**
* **Drizzle ORM**
* **Zod** (validation)
* **PostgreSQL** (recommended)
* **Docker / Docker Compose**
* **pnpm**

---

## 📂 Project Structure

```text
src/
├─ controller/        # Business logic (controllers)
├─ routes/            # HTTP route definitions
├─ drizzle/           # ORM schemas, client, and migrations
├─ model/             # Data access layer
├─ zod/               # Validation schemas
├─ errors/            # Custom error handling
├─ class/             # Domain utilities (Money, Excel, Helpers)
├─ config/            # Fastify, plugins, logger, routes
├─ enums/             # Shared enums (status codes)
├─ utils/             # Shared utilities
├─ settings/          # Environment configuration
└─ index.ts           # Application entry point
```

---

## ⚙️ Environment Setup

Create an environment file based on `.env.dev`:

```bash
cp .env.dev .env
```

Configure your database connection and required variables.

---

## 📦 Installation

```bash
pnpm install
```

---

## ▶️ Running the Project

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

---

## 🗄 Database & Migrations

Generate and run migrations using Drizzle:

```bash
pnpm drizzle:generate
pnpm drizzle:migrate
```

Migration files are located in:

```
src/drizzle/migrations
```

---

## 🔌 API Modules Overview

### Transactions

* Create transactions
* List all transactions
* Filter by month, tag, or payment type

### Tags

* Create, update, remove, and restore tags
* Get most-used tags
* Get tags with aggregated spending
* Export tag data to Excel

### Payment Types

* Create, update, remove, and restore payment types
* Get most-used payment types

### Total Amount

* Get total amount
* Get monthly amount
* Rough amount calculations

---

## 🧪 Validation & Error Handling

* All inputs are validated using **Zod schemas**
* Centralized error handling with custom error classes
* Consistent HTTP status codes via enums

---

## 🐳 Docker Support

Run the API using Docker Compose:

```bash
docker-compose up --build
```

---

## 📌 Design Principles

* Clean architecture separation (routes, controllers, models)
* Strong type safety with TypeScript interfaces
* Scalable folder organization
* Easy to extend with new financial modules

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**André Sales**
GitHub: [https://github.com/andreluke](https://github.com/andreluke)

---

If you find this project useful or plan to build on top of it, feel free to fork, star ⭐, or contribute!
