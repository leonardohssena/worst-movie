# 🎬 Worst Movie API

RESTful API built with **NestJS** and **Prisma** that processes a CSV file with Golden Raspberry Award winners for "Worst Movie".

---

## 🚀 Tech Stack

| Tool / Library     | Description                                 |
|--------------------|---------------------------------------------|
| **NestJS**         | Node.js framework for scalable applications |
| **Prisma**         | ORM to manage the SQLite database           |
| **SQLite**         | In-memory embedded database                 |
| **Jest**           | Testing framework                           |
| **Supertest**      | HTTP assertions for integration tests       |
| **TypeScript**     | Static typing                               |

---

## 📁 CSV Format

The system expects a CSV file with the following structure:

|year;title;studios;producers;winner|
|-----------------------------------|
|1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes|
|1980;Cruising;Lorimar Productions;Jerry Weintraub;|

The file should be located in:  
`assets/data/Movielist.csv`

To use a different CSV file for seeding, set the environment variable in .env
``
SEED_CSV_MOVIE_FILE_NAME=custom-file.csv
``

Ensure your custom file is located in:
`assets/data`

---

## 📦 Installation

Clone the repository, create env file and install the dependencies:

```bash
git clone https://github.com/leonardohssena/worst-movie.git
cd worst-movie
cp .env.example .env
pnpm install
```

## ▶️ Running the Application

### Development

```bash
pnpm run start:dev
```

### Production

```bash
pnpm run build
pnpm run start:prod
```

On startup, the app automatically reads and imports data from the CSV file into an in-memory SQLite database.

## 📡 API Endpoint

### 🔍 Swagger Documentation

You can access the Swagger UI at:
`http://localhost:3000/api`

This provides interactive documentation for all available endpoints, request/response schemas, and examples.
> Swagger is automatically available when the app is running.

### GET /api/producers/interval

Returns producers with the minimum and maximum intervals between two wins:

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Joel Silver",
      "interval": 10,
      "previousWin": 1990,
      "followingWin": 2000
    }
  ]
}
```

## 🧪 Running Integration Tests

```bash
npm run test
```
