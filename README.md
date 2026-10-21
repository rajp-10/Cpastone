# AI Travel Planner Application 🌍✈️

An intelligent, full-stack AI-powered travel planning application built with React, Vite, TypeScript, FastAPI, and Google Gemini AI.

## 🚀 Features

- **AI-Powered Itinerary Generation:** Personalized daily itineraries using Google Gemini AI.
- **Smart Recommendations:** Discover activities, dining, attractions, and local hidden gems.
- **Interactive Budget & Route Planning:** Estimated budgets, day-by-day scheduling, and weather forecast integration.
- **PDF Export:** Export travel plans to beautifully formatted PDF documents.
- **Authentication & User Profiles:** Secure JWT-based authentication and user trip storage.
- **Multi-language Support (i18n):** Internationalization for multiple languages.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **State Management:** Zustand
- **PDF Generation:** jsPDF + html2canvas
- **APIs:** Gemini AI, OpenWeatherMap

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL + SQLAlchemy ORM
- **Authentication:** JWT (python-jose), Passlib / bcrypt
- **AI Integration:** Google Generative AI (Gemini)

---

## 📦 How to Pull & Run (Restore Guide)

### 1. Clone the Repository
`ash
git clone https://github.com/guru-vamshi1514/ai-travel-planner-application.git
cd ai-travel-planner-application
`

### 2. Frontend Setup
`ash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and insert your API keys (Gemini, OpenWeather, etc.)

# Start frontend dev server
npm run dev
`

### 3. Backend Setup
`ash
# Navigate to backend folder
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit backend/.env with your PostgreSQL database credentials and keys

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
`

---

## 📄 License
This project is for personal backup and development.
