# 🏡 HOMEMAKERS – AI-Powered Real Estate Platform

**HOMEMAKERS** is a full-stack real estate web application that helps users explore, analyze, and engage with property listings using intelligent search, content-based recommendations, and an AI-powered chatbot.

Built using the **PERN stack** (PostgreSQL, Express, React, Node.js) with a Python-based AI microservice for natural-language interaction.

---

## 🚀 Features

### 🌐 Frontend (React)
- **Explore Page**: Displays property cards with search, filter, and wishlist features.
- **Insight Pages**: Detailed property view with:
  - Pricing, amenities, location map
  - Floor-wise layout (bed, bath, kitchen, hall)
  - Owner contact info & user reviews
- **Rrecommendations** : Explore content based recommended(based on SQL quries) properties
- **Wishlist & Review System**: Logged-in users can bookmark properties and leave/update reviews.

### 🧠 AI Chatbot (Python + FastAPI)
- Users can ask natural-language questions like:
  - _"What is the average pricing of the properties located at xyz district per sq feet"_
  - _"properties that have high review and decent neighbourhood"_
- The chatbot:
  1. Generates SQL using a language model (Gemini)
  2. Executes the SQL via `asyncpg`
  3. Returns clear, conversational answers

### 🗃️ PostgreSQL Database
- Optimized schema with normalized property tables, array fields for amenities, and review/wishlist relations.
- Content-based recommendation queries for similar listings.

## ⚙️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express, PostgreSQL, JWT Auth
- **AI Backend**: Python, FastAPI, asyncpg, LangGraph, Gemini
- **Database**: PostgreSQL (hosted on NeonDB)

---

### 🔗 Related Repositories

- 🔧 [Backend Repo (Node.js/Express)](https://github.com/Brinda-Sorathiya/HomeMaker_backend.git)
- 🤖 [AI Backend Repo (Python/FastAPI)](https://github.com/Brinda-Sorathiya/homemaker_backend_bot.git)
