# MoneyQuest Frontend - Optimization & Debugging Guide

## 🎯 Overview
This document describes the frontend optimization and automated debugging enhancements for **MoneyQuest**, a cute RPG AI accounting app built with React Native.

## ✨ Optimizations Applied

### 🔧 Performance Enhancements
- **Memoization**: Used `React.useMemo` in `DashboardScreen` to prevent unnecessary re-renders
- **useCallback**: Wrapped stage renderers in `RecordsScreen` with `useCallback` to optimize performance
- **Lottie Animation Control**: Added speed control for Low Power Mode (reduces animation speed to 30%)
- **Optimized Re-renders**: Prevented re-renders by memoizing computed values (EXP percentage, sanitized NPC messages)

### 🔒 Security Improvements
- **JWT Token Integration**: Added request interceptor to attach JWT tokens from AsyncStorage to all API calls
- **Input Validation**: Created Pydantic-like validation utilities for:
  - Amount validation (numeric, range checks)
  - Description validation (length limits)
  - Category validation
- **XSS Prevention**: Implemented `sanitizeInput()` to prevent cross-site scripting in NPC messages and user inputs
- **Error Handling**: Added response interceptor for standardized error logging

### 🎨 UI/UX Refinements
- **Q-Version Aesthetic**: Soft color palette already in place (#90EE90 light green, #ADD8E6 light blue)
- **User Feedback**: Replaced alerts with Toast notifications for better UX on Android
- **Smooth Transitions**: Enhanced stage transitions in RecordsScreen
- **Validation Feedback**: Immediate user feedback for invalid inputs with Chinese messages

### 🧪 Testing
- **Jest Configuration**: Added jest-expo preset with proper transformIgnorePatterns
- **Unit Tests**:
  - `validation.test.js`: Comprehensive tests for all validation utilities
  - `RecordsScreen.test.js`: Component tests for rendering, validation, navigation, and API calls
- **Coverage**: Tests include boundary cases (empty inputs, invalid data, API errors)

## 📦 New Dependencies

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.1.0"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.4.3",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "jest-expo": "^51.0.4",
    "prettier": "^3.2.5",
    "simple-git": "^3.22.0"
  }
}
```

## 🚀 Usage

### Install Dependencies
```bash
cd frontend
npm install
```

### Run Tests
```bash
npm test
```

### Run Optimization Script
The optimization script automatically:
1. Formats code with Prettier
2. Runs Jest tests
3. Commits changes to Git
4. Pushes to remote repository

```bash
npm run optimize
```

Or directly:
```bash
node src/services/optimizeScript.js
```

### Manual Git Operations
If the automatic Git push fails, use these commands:
```bash
git add .
git commit -m "Auto-debug, optimize and perfect frontend code"
git push
```

## 📁 File Structure

```
frontend/
├── src/
│   ├── __tests__/              # Jest tests
│   │   ├── validation.test.js
│   │   └── RecordsScreen.test.js
│   ├── screens/
│   │   ├── DashboardScreen.js  # Optimized with useMemo, Lottie speed control
│   │   └── RecordsScreen.js    # Enhanced with validation, useCallback
│   ├── services/
│   │   ├── api.js              # JWT interceptors, error handling
│   │   ├── validation.js       # Input validation utilities
│   │   └── optimizeScript.js   # Automated optimization & Git script
│   └── constants/
│       └── theme.js            # Q-version color palette
├── package.json
└── README.md                   # This file
```

## 🎮 Key Features

### DashboardScreen
- **Interactive Map**: Lottie animation with dynamic speed control
- **NPC Dialog**: Sanitized messages to prevent XSS
- **Performance**: Memoized EXP percentage calculation
- **Low Power Mode**: Reduces animation speed when enabled

### RecordsScreen
- **Input Validation**: Real-time validation for amount and description
- **Toast Notifications**: User-friendly error messages in Chinese
- **Stage Management**: Smooth transitions between Input and Preview stages
- **Security**: Sanitized description before API submission

### API Layer
- **JWT Authentication**: Automatic token attachment to requests
- **Error Interceptor**: Standardized error logging and handling
- **Timeout Management**: 5-second timeout for all requests

## 🧪 Testing Guide

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test validation.test.js
npm test RecordsScreen.test.js
```

### Watch Mode (for development)
```bash
npm test -- --watch
```

## 🔄 Git Workflow

The `optimizeScript.js` automates:
1. **Code Quality**: Runs Prettier and ESLint (if configured)
2. **Testing**: Ensures all tests pass before committing
3. **Git Operations**: Stages, commits, and pushes changes
4. **Fallback**: Provides manual commands if automated push fails

## 🌟 Best Practices Implemented

1. **Separation of Concerns**: Validation logic separated into `validation.js`
2. **Reusability**: Validation and sanitization utilities are reusable across components
3. **Error Handling**: Comprehensive try-catch blocks with user-friendly messages
4. **Performance**: Minimized re-renders with memoization
5. **Security**: Input sanitization and JWT token management
6. **Testing**: High test coverage for critical paths

## 🎨 Q-Version Design Philosophy

- **Soft Colors**: Light green (#90EE90), light blue (#ADD8E6)
- **Rounded Elements**: Border radius of 20px for cards and buttons
- **Friendly Tone**: Chinese messages with warm, encouraging language
- **Smooth Animations**: Lottie animations with performance optimization
- **Cute Icons**: NPC sprites and emoji for visual appeal

## 📝 Future Improvements

- [ ] Add E2E tests with Detox
- [ ] Implement offline mode with local storage synchronization
- [ ] Add more comprehensive ESLint configuration
- [ ] Create snapshot tests for UI components
- [ ] Add performance monitoring (React Native Performance)

## 🤝 Contributing

When making changes:
1. Write tests for new features
2. Run `npm test` before committing
3. Use `npm run optimize` to auto-format and commit
4. Follow the Q-version design aesthetic

## 📄 License

This project is part of the MoneyQuest application.
