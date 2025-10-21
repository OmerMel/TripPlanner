
# 🗺️ Personal Trip Planner (MERN Full-Stack)

An intelligent **AI-powered trip planning platform** built with the **MERN stack (MongoDB, Express, React, Node)** — empowering users to generate, visualize, and manage customized travel itineraries with real-time maps and weather insights.

---

## 🪲 Known Bugs
   - The LLM returns random points unrelated to the daily details.
   - ~~The map fails to generate a route.~~ fixed
   - AI returns water coordinates that aren’t being filtered or corrected by the code.

---

## 🚀 Key Features

### 🌎 General
- Full **AI trip generation** (city, country, and trip type aware)
- Smart route validation — no water or ocean coordinates
- **Dynamic maps** with markers and paths via **Leaflet**
- Live **weather forecast** for trip destinations
- Secure **user authentication (JWT + bcrypt)**
- **Responsive UI** built with React (CRA)
- **Persistent trip storage** per user (MongoDB)
- **Swagger API docs** for backend testing

### 🤖 AI Layer
- Uses OpenAI (`gpt-5-nano-2025-08-07`) for realistic, detailed trip descriptions.  
- Output strictly follows JSON schema (`tripDescription`, `route`, `dailyBreakdown`, etc.).  
- Post-validation ensures all points are on land using a local `water_osm.geojson` index.  
---

## 🏗️ System Architecture

### 🖥️ Frontend (`/client`)

```
client/
├─ public/                           # Static files served directly (favicon, manifest)
│
├─ src/
│  ├─ components/                    # Reusable UI building blocks
│  │  ├─ FormCheckboxGroup.js        # Checkbox input group for trip options
│  │  ├─ FormDDLInput.js             # Dropdown list input
│  │  ├─ FormRadioGroup.js           # Radio button group for trip type
│  │  ├─ FormStringInput.js          # Text input field component
│  │  ├─ SavedTripsList.js           # Displays all trips saved by user
│  │  ├─ TripCard.js                 # Summary card showing trip info
│  │  ├─ TripMap.js                  # Leaflet-based interactive map for routes
│  │  ├─ WeatherForecastCard.js      # Displays weather forecast for destination
│  │  └─ style/
│  │     ├─ TripCard.css             # Styling for trip cards
│  │     └─ WeatherForecastCard.css  # Styling for weather forecast cards
│  │
│  ├─ pages/                         # Main page components (routed via React Router)
│  │  ├─ HistoryPage.js              # Displays user’s trip history
│  │  ├─ HomePage.js                 # Main landing page after login
│  │  ├─ LandingPage.js              # Public landing / welcome page
│  │  ├─ LoginPage.js                # Login form with JWT auth integration
│  │  ├─ MainLayout.js               # Shared layout wrapper for all pages
│  │  ├─ PlannerPage.js              # Main trip planner interface with AI generation
│  │  ├─ RegisterPage.js             # User registration form
│  │  ├─ TripDetailsPage.js          # Detailed trip view (map + daily plan)
│  │  ├─ TripOptionsPage.js          # Additional options for trip customization
│  │  └─ style/
│  │     ├─ HistoryPage.css          # Styles for history page
│  │     ├─ HomePage.css             # Styles for home page
│  │     ├─ LandingPage.css          # Styles for landing page
│  │     ├─ LoginPage.css            # Styles for login
│  │     ├─ MainLayout.css           # Layout-related styles
│  │     ├─ PlannerPage.css          # Styles for trip planner
│  │     ├─ RegisterPage.css         # Styles for registration
│  │     ├─ TripDetailsPage.css      # Styles for trip detail view
│  │     └─ TripOptionsPage.css      # Styles for trip options page
│  │
│  ├─ style/
│  │  └─ global.css                  # Global CSS variables and base styling
│  │
│  ├─ utils/
│  │  └─ validation.js               # Client-side form validation helpers
│  │
│  ├─ App.js                         # Main React component, defines routing and structure
│  ├─ App.css                        # Global app styling
│  ├─ App.test.js                    # Unit tests for the App component
│  ├─ index.js                       # Application entry point (ReactDOM rendering)
│  ├─ index.css                      # Global CSS imports
│  ├─ logo.svg                       # App logo
│  ├─ reportWebVitals.js             # Performance analytics setup
│  └─ setupTests.js                  # Jest configuration for testing
│
├─ .env                              # Environment variables for client configuration
└─ package.json                      # Client dependencies and scripts
```

---

### ⚙️ Backend (`/server`)

```
server/
├─ config/
│  ├─ db.js                          # MongoDB connection using Mongoose
│  └─ swagger.js                     # Swagger (OpenAPI) documentation configuration
│
├─ controllers/
│  ├─ trip.controller.js             # Trip CRUD operations + AI-based trip generation
│  ├─ user.controller.js             # User registration, login, and JWT issuance
│  └─ weather.controller.js          # Fetches live weather data from Open-Meteo API
│
├─ middleware/
│  └─ authMiddleware.js              # JWT authentication middleware for protected routes
│
├─ models/
│  ├─ trip.model.js                  # Mongoose schema for trip data structure
│  └─ user.model.js                  # Mongoose schema for user accounts
│
├─ routes/
│  ├─ trip.route.js                  # Endpoints for trip generation, saving, deletion
│  ├─ user.route.js                  # Endpoints for login and registration
│  └─ weather.route.js               # Endpoint for weather forecast retrieval
│
├─ services/
│  ├─ imageService.js                # Fetches trip images from Unsplash API
│  ├─ llmService.js                  # Handles OpenAI prompts and JSON parsing
│  └─ localGeoService.js             # Validates trip routes against land/water polygons
│
├─ .env                              # Environment variables for server configuration
├─ index.js                          # Server entry point – Express setup and route mounting
├─ .gitignore                        # Excludes node_modules, .env, etc. from Git
├─ package.json                      # Server dependencies and scripts
└─ package-lock.json                 # Exact dependency tree for reproducible installs
```




---

## 💽 Database Configuration & Management

**Database:** MongoDB (via Mongoose)

- Connection: defined in `.env → MONGO_URI`
- Entities:
  - **User**
    - `username`, `email`, `password`
  - **Trip**
    - Full itinerary (route, daily breakdown, total distance, difficulty)
    - Linked to `userId`
- Indexed & timestamped with `createdAt` / `updatedAt`

---

## ⚙️ Technical Implementation

### Backend Highlights
- **Framework:** Node.js + Express  
- **AI Integration:** OpenAI API  
- **Image Service:** Unsplash API  
- **Geo Validation:** Turf.js + geojson-rbush spatial index  
- **Auth:** JWT middleware + bcrypt encryption  

### Frontend Highlights
- **Framework:** React (Create React App)  
- **Map Engine:** Leaflet
- **State Management:** React hooks  
- **HTTP Client:** Axios  
- **Environment Config:** `.env`  
- **Routing:** React Router v6  

---

## 🔗 API Documentation

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/users/register` | Register a new user |
| `POST` | `/api/users/login` | Login and obtain JWT |
| `POST` | `/api/trips/generate` | Generate new AI-based trip |
| `POST` | `/api/trips/save` | Save a generated trip |
| `GET` | `/api/trips/my` | Fetch all user’s trips |
| `GET` | `/api/trips/:id` | Retrieve a single trip |
| `DELETE` | `/api/trips/:id` | Delete a saved trip |
| `GET` | `/api/weather?lat=..&lng=..` | Get 3-day forecast |


---

## 🧰 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/OmerMel/TripPlanner.git
cd trip-planner
```

### 2️⃣ Install dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3️⃣ Configure environment variables

#### `/server/.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://...
OPENAI_API_KEY=your_openai_key
UNSPLASH_KEY=your_unsplash_key
JWT_SECRET=your_secret_key
WATER_GEOJSON_PATH=./data/water_osm.geojson
```

#### `/client/.env`
```env
REACT_LEAFLET_API_KEY=your_leaflet_key
```

### 4️⃣ Run development servers
```bash
# Run both server and client side concurrently
npm run dev

# or manually:
cd server && npm run dev
cd ../client && npm start
```

http://localhost:3000 

---

## 🔒 Security Considerations

- JWT-based authentication for all private routes  
- Encrypted passwords (bcrypt, salt rounds 10)  
- Validation middleware & error handling  
- Secure `.env` variable management  

---

## 🙏 Acknowledgments

- 🧠 **OpenAI** — AI route generation  
- 🖼️ **Unsplash** — travel imagery  
- 🌦️ **Open-Meteo** — live weather forecasts  
- 🌍 **Leaflet** — interactive mapping  
- 🗺️ **Turf.js** — geospatial computation  
- 💾 **MongoDB Atlas** — scalable NoSQL DB  
