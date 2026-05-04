# MathGenius AI - Adaptive Intelligent Tutoring System

![MathGenius AI](https://img.shields.io/badge/Status-Production--Ready-green)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/License-Research-orange)

## 🎯 Overview

MathGenius AI is a **research-level adaptive intelligent tutoring system** that goes beyond simple chatbot functionality to provide personalized, adaptive math education. The system implements novel cognitive profiling algorithms and adaptive explanation modulation based on real-time student performance analysis.

### Key Innovations

- **Adaptive Explanation Engine**: Dynamically adjusts explanation complexity based on student profiling
- **Cognitive Performance Tracking**: Real-time skill score calculation with learning velocity metrics
- **Intelligent Difficulty Progression**: Automated difficulty adjustment based on performance patterns
- **Personalized Learning Paths**: AI-driven recommendation system for optimal learning trajectories

## 🏗️ Architecture

```
MathGenius-AI/
├── backend/                    # FastAPI Python backend
│   ├── main.py                # Application entry point
│   ├── database.py            # SQLAlchemy configuration
│   ├── models.py              # Database models
│   ├── adaptive_engine.py     # Core adaptive logic (NOVEL COMPONENT)
│   ├── student_model.py       # Student profiling system (NOVEL COMPONENT)
│   ├── solver.py              # SymPy-based math solver
│   ├── routes/                # API endpoints
│   │   ├── solve.py          # Problem solving endpoint
│   │   ├── analytics.py      # Analytics & progress endpoints
│   │   └── users.py          # User management
│   └── utils/
│       └── llm_client.py     # LLM integration layer
│
└── frontend/                  # Next.js React frontend
    ├── src/
    │   ├── app/              # Next.js app router
    │   ├── components/       # React components
    │   │   ├── ProblemSolver.tsx
    │   │   ├── AnalyticsDashboard.tsx
    │   │   └── MathDisplay.tsx
    │   └── lib/
    │       └── api.ts        # API client
    └── public/
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt --break-system-packages

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Run the server
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📊 Core Features

### 1. Natural Language Math Understanding

- Accepts algebra, calculus, arithmetic, and geometry problems
- Natural language parsing using LLM integration
- Converts problems to symbolic mathematical form

### 2. Step-by-Step Solution Engine

- Symbolic solving using SymPy
- Structured step generation with LaTeX rendering
- Reasoning explanations for each step

### 3. Adaptive Explanation Module

**Novel Research Component**: `adaptive_engine.py`

Implements intelligent tutoring by:
- Tracking user accuracy and response time patterns
- Detecting repeated mistakes
- Assigning dynamic skill scores (0-100 scale)
- Modulating explanation complexity:
  - **Beginner**: Detailed, step-by-step with definitions
  - **Intermediate**: Balanced explanation with key concepts
  - **Advanced**: Concise, high-level insights

### 4. Student Profiling System

**Novel Research Component**: `student_model.py`

Maintains comprehensive cognitive profiles:
- Overall skill score with topic-specific breakdowns
- Performance metrics (accuracy, response time)
- Improvement rate calculation (learning velocity)
- Automated difficulty level assignment
- Weak area identification for targeted intervention

### 5. Analytics Dashboard

Real-time visualization of:
- Performance trends over time
- Topic-wise accuracy breakdown
- Learning velocity indicators
- Personalized study recommendations

## 🔬 Research & Novel Components

### Adaptive Tutoring Framework

The system implements a novel framework for adaptive tutoring that differs from traditional ITS systems:

1. **Dynamic Complexity Modulation**
   - Real-time adjustment of explanation depth
   - Context-aware hint generation
   - Performance-based feedback calibration

2. **Cognitive Profiling Algorithm**
   - Multi-dimensional skill assessment
   - Exponential moving average for score updates
   - Difficulty-weighted performance calculation

3. **Learning Velocity Metrics**
   - Linear regression-based trend analysis
   - Predictive difficulty adjustment
   - Intervention trigger detection

### Patentable Components

1. **Adaptive Explanation Engine** (`adaptive_engine.py`)
   - Novel algorithm for dynamic explanation complexity determination
   - Context-aware educational content generation

2. **Cognitive Performance Profiling** (`student_model.py`)
   - Multi-dimensional student skill assessment
   - Real-time learning trajectory prediction

3. **Intelligent Difficulty Progression System**
   - Automated difficulty adjustment based on performance patterns
   - Optimal challenge point identification

## 🔧 API Endpoints

### Problem Solving

```
POST /api/solve
{
  "user_id": 1,
  "question": "Solve for x: 2x + 5 = 15",
  "student_answer": "5" (optional)
}
```

### User Progress

```
GET /api/user-progress/{user_id}
```

### Analytics

```
GET /api/analytics/{user_id}
```

### Adaptive Settings

```
GET /api/adaptive-settings/{user_id}
POST /api/adaptive-settings/{user_id}
```

## 📦 Technology Stack

### Backend
- **FastAPI**: Modern async web framework
- **SQLAlchemy**: ORM for database management
- **SymPy**: Symbolic mathematics engine
- **OpenAI/Anthropic**: LLM integration for NLP
- **NumPy/Pandas**: Data analysis

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **KaTeX**: LaTeX math rendering
- **Recharts**: Data visualization

### Database
- **SQLite**: Lightweight embedded database
- Easily upgradeable to PostgreSQL for production

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🔐 Environment Variables

### Backend (.env)
```
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here (optional)
DATABASE_URL=sqlite:///./data/mathgenius.db
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 📈 Performance Metrics

The system tracks:
- **Skill Score**: 0-100 scale for overall ability
- **Topic Scores**: Individual scores for algebra, calculus, geometry, arithmetic
- **Accuracy**: Percentage of correct answers
- **Response Time**: Average time per problem
- **Improvement Rate**: Learning velocity metric

## 🎓 Educational Philosophy

MathGenius AI is built on principles of:
- **Adaptive Learning**: Content adjusts to student level
- **Mastery-Based Progression**: Move forward when ready
- **Immediate Feedback**: Real-time correctness checking
- **Growth Mindset**: Focus on improvement over time

## 🚀 Deployment

### Production Considerations

1. **Database**: Migrate from SQLite to PostgreSQL
2. **API Keys**: Use environment-specific secrets management
3. **Caching**: Implement Redis for session management
4. **CDN**: Serve frontend assets via CDN
5. **Monitoring**: Add application performance monitoring

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 License

This project is designed for research and educational purposes. Contact for commercial licensing.

## 👥 Contributing

This is a research project. For contributions or collaboration:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## 📧 Contact

For research inquiries, collaborations, or licensing:
- Email: research@mathgenius.ai
- Documentation: See `research_novelty.md`

## 🙏 Acknowledgments

- SymPy community for symbolic mathematics
- OpenAI and Anthropic for LLM capabilities
- Educational technology research community

---

**Built with ❤️ for advancing personalized education through AI**
