# Workflow Automation Builder

A modern drag-and-drop workflow automation platform built with React, TypeScript, and React Flow.

## 🚀 Features

- **Drag-and-Drop Interface**: Visual workflow creation
- **Multiple Step Types**: Source, Processing, Decision, and Output steps  
- **Real-time Configuration**: Form-based step configuration
- **Auto-save**: Automatic localStorage persistence
- **Import/Export**: JSON workflow sharing

## 🛠 Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Redux Toolkit (state management)
- React Flow (workflow visualization)
- Heroicons (icons)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

## 📁 Project Structure

```
src/
├── components/         # React components
├── store/             # Redux store and slices
├── types/             # TypeScript definitions
├── constants/         # Step definitions
├── utils/             # Utility functions
└── hooks/             # Custom hooks
```

## 🎯 Usage

1. **Create Workflow**: Click dropdown in header
2. **Add Steps**: Drag components from sidebar to canvas
3. **Connect Steps**: Drag between connection points
4. **Configure**: Click steps to open config panel
5. **Save/Export**: Auto-saves to localStorage, export as JSON

## 📝 Architecture Decisions

### State Management
- Redux Toolkit for predictable state
- Normalized workflow data structure
- Separated UI and workflow state

### Component Design
- TypeScript for full type safety
- Custom React Flow node types
- Modular, reusable components

### Data Persistence
- localStorage for client-side storage
- JSON serialization for portability
- Automatic backup on changes

## 🔧 Step Types

- **Sources**: Webhook, HTTP Request, File Upload, Database, Scheduled
- **Processing**: Transform, API Call, Email, Validation, Custom Script
- **Decisions**: Conditional, Switch, Loop, Try/Catch
- **Outputs**: Response, File Export, Database Insert, Notification, Log

## 🚀 Future Enhancements

- Workflow execution engine
- Real-time collaboration
- Advanced validation
- Template library
- API integrations

## 📄 License

MIT License - see LICENSE file for details.