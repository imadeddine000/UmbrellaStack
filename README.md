
## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

## 📁 Project Structure
```
fullstack-pro/
├── frontend/          # Vite + React + TypeScript + shadcn/ui
├── backend/           # Java Spring Boot
├── docs/              # Documentation
└── README.md
```

## 🛠 Tech Stack
- **Frontend**: Vite, React, TypeScript, shadcn/ui, Tailwind
- **Backend**: Spring Boot, Java 17+, PostgreSQL
- **Tools**: Git, Docker, ESLint, Prettier

## 💻 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm test            # Run tests
```

### Backend Development
```bash
cd backend
./mvnw spring-boot:run    # Start server
./mvnw test              # Run tests
./mvnw clean package     # Build JAR
```

## 📝 Commit Convention
We use conventional commits:

```bash
# Features
git commit -m "feat(frontend): add user authentication UI"
git commit -m "feat(backend): implement JWT authentication"

# Fixes
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "fix(ui): correct mobile responsive layout"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor(backend): optimize database queries"

# Testing
git commit -m "test(frontend): add component unit tests"
```

## 🤝 Contributing
1. Fork the repository
2. Follow commit conventions
3. Add tests for new features


## 🎯 Development Mindset
- **Performance First**: Optimize from start
- **Accessibility**: WCAG compliance
- **Testing**: TDD approach
- **Security**: Built-in from beginning

## 📈 Why This Stack?
- **Vite**: Blazing fast dev server
- **shadcn/ui**: Copy-paste components, fast development
- **Spring Boot**: Production ready backend
- **TypeScript**: Type safety and better DX

---

**Start coding!** Choose frontend or backend and begin with `npm run dev` or `./mvnw spring-boot:run`
