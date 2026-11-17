<div align="center">

# 3D Search

### Find a place that feels like home.

An interactive property-search app with a dimensional, CSS-powered interface and a lightweight listings API.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232A)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-runtime-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![CSS](https://img.shields.io/badge/CSS-3D%20transforms-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Data](https://img.shields.io/badge/Data-JSON-555555?logo=json&logoColor=white)](https://www.json.org/)

<br />

![Preview of the 3D Search property-search app](frontend/public/property-search-preview.png)

</div>

## Overview

3D Search is a sample real-estate discovery experience. Search listing details with flexible filters, rank homes by closeness to a target budget, and browse paginated results. The frontend is built with React and Vite; an Express API serves listing data from a local JSON file.

## What it can do

- Search listing addresses, cities, states, ZIP codes, and descriptions by keyword.
- Filter by city, maximum price, and minimum bedrooms.
- Optionally rank matches by closeness to a budget without excluding homes outside that budget.
- Browse results with pagination.
- Explore a responsive interface with CSS 3D styling and reduced-motion support.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, JavaScript, CSS |
| Development server and build | Vite 8 |
| Backend API | Node.js, Express 5 |
| Sample listing data | JSON |

## Run locally

Install [Node.js](https://nodejs.org/) and npm first. Start the API and frontend in separate terminals from the project root.

**Terminal 1 — API**

```sh
cd backend
npm install
npm start
```

The API listens at `http://localhost:3000`.

**Terminal 2 — frontend**

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The Vite development server proxies `/api` requests to the backend on port `3000`.

## Listings API

### `GET /api/listings`

Example:

```text
http://localhost:3000/api/listings?city=Springfield&budget=500000&page=1&limit=5
```

This returns up to five Springfield listings on page 1, ordered by proximity to a $500,000 budget.

| Parameter | Description |
| --- | --- |
| `keyword` | Case-insensitive text search across address, city, state, ZIP code, and description. |
| `city` | Keeps listings whose city contains the provided text, ignoring letter case. |
| `maxPrice` | Keeps listings at or below this price. |
| `minBedrooms` | Keeps listings with at least this many bedrooms. |
| `budget` | Ranks matches by absolute distance from this price; it does not filter results. |
| `page` | Results page to return; defaults to `1`. |
| `limit` | Results per page; defaults to `10` and is capped at `50`. The frontend requests `5`. |

The response contains `page`, `limit`, `total`, `totalPages`, and `results`.

The API also exposes `GET /health`, which returns a simple service status.

## Data and ranking

Sample listings are loaded from `backend/data/sample_listings.json`. Search filters are applied before ranking and pagination. If a budget is supplied, listings closest to it appear first; ties—and all results when no budget is supplied—are ordered by listing date, newest first. The frontend displays five listings per page.

## Project structure

```text
.
├── backend/
│   ├── data/sample_listings.json
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Possible next steps

- Add automated backend and frontend tests.
- Move listing data to a database such as PostgreSQL.
- Add more search filters and listing details.
- Prepare the application for deployment.
