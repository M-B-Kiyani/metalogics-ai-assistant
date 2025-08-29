# Metalogics AI Assistant Chatbot

A production-ready AI Assistant chatbot that integrates seamlessly with metalogics.io, providing company information, capturing leads, and scheduling appointments.

## Features

- **Brand Alignment**: Matches metalogics.io design and tone
- **RAG Knowledge Base**: Scrapes and stores website content for intelligent responses
- **Lead Capture**: Collects user information and schedules appointments
- **Smart Conversations**: Natural flow with fallback to human support
- **Responsive Widget**: React-based floating chat widget
- **Secure Backend**: Node.js API with PostgreSQL database

## Project Structure

```
├── client/                 # React chatbot widget
│   ├── src/
│   │   ├── components/     # Chat components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── styles/         # Tailwind CSS
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
├── scraper/               # Website scraping tools
└── docs/                  # Documentation
```

## Setup

1. Install dependencies: `npm run install:all`
2. Configure environment variables (see .env.example)
3. Run development: `npm run dev`

## Environment Variables

- `OPENAI_API_KEY`: OpenAI API key for GPT integration
- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: SendGrid API key for email notifications
- `JWT_SECRET`: Secret for JWT token generation

## Deployment

- Frontend: Deploy to Vercel/Netlify
- Backend: Deploy to Railway/Render/AWS
- Database: PostgreSQL on Railway/Supabase/AWS RDS
