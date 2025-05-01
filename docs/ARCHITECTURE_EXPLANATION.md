# "If You Could Go Back In Time" Architecture Explanation

This document explains the architecture of the game, detailing how components interact with each other.

## Core Architecture Overview

The game follows a Model-View-Controller-like architecture:

- **Model**: Content classes (KnowledgeTransmission, Technology, etc.) and Data files
- **View**: Currently embedded in GameEngine (console.log/prompt)
- **Controller**: GameEngine and supporting classes

## Component Interactions

### Game Initialization Flow

1. **Entry point** (`main.js`):
   - Creates a `Settings` object with game configuration
   - Initializes `Logger` and `ErrorHandler` for monitoring
   - Creates a `GameEngine` instance with the settings
   - Calls `startNewGame()` to begin
2. **Game Engine Startup** (`GameEngine.js`):
   - Creates a new `GameState` to track player progress
   - Uses `EraLoader` to load era data (currently hardcoded to "1500AD.json")
   - Calls `askCoreQuestions()` to start the game loop

### Game Loop & Question Flow

1. **Question Generation**:
   - `GameEngine.askCoreQuestions()` gets random questions from the loaded era
   - Each question comes from `EraLoader` which creates question objects from JSON
   - Questions contain choices representing possible answers
2. **Player Interaction**:
   - `GameEngine.askQuestion()` displays the question text and choices
   - Gets player input via `prompt()` (currently mixed UI logic)
   - Evaluates the selected choice with `evaluateChoiceCoherence()`
3. **Coherence Evaluation**:
   - `evaluateChoiceCoherence()` calculates if a choice is historically accurate
   - Uses either combined coherence (environmental × cultural) or just environmental coherence based on settings
   - `GameEngine.shouldContinueRabbitHole()` decides if the player can go deeper based on coherence score
4. **Response Processing**:
   - `GameState.recordAnsweredQuestion()` tracks the player's choice
   - Creates an `AnsweredQuestion` object with the question, chosen answer, and depth
   - If the choice is correct (coherence > 0.8), rabbit hole depth increases
5. **Rabbit Hole Progression**:
   - If allowed, `getFollowupQuestions()` generates deeper questions
   - `Technology` generates questions about components/recipes
   - `KnowledgeIdea` would generate questions about underlying principles
6. **Game Conclusion**:
   - `GameEngine.endGame()` is called after core questions are answered
   - `GameState.calculateFinalScore()` determines the player's score
   - Identifies best impact and worst mistake
   - `GameHistory.saveGame()` stores the completed game

### Knowledge Representation

1. **Base Knowledge** (`KnowledgeTransmission`):
   - Abstract base class for all knowledge elements
   - Contains coherence scores (environmental, cultural)
   - Provides impact scores and response messages
2. **Technology** (extends `KnowledgeTransmission`):
   - Represents physical inventions
   - Contains recipes (arrays of components)
   - Generates followup questions about components
3. **KnowledgeIdea** (extends `KnowledgeTransmission`):
   - Represents social, political, or medical knowledge
   - Would generate followup questions about principles

### Game State Tracking

1. **GameState**:
   - Tracks score, rabbit hole depth, and answered questions
   - Records player choices and determines if they're correct
   - Calculates final score based on choices and depth
2. **GameHistory**:
   - Stores completed game states for review
   - Allows retrieval of the most recent game

### Infrastructure Components

1. **Logger**:
   - Provides DEBUG, INFO, WARN, ERROR log levels
   - Tracks log history for debugging
   - Used throughout the application
2. **ErrorHandler**:
   - Standardizes error codes and handling
   - Provides global error catching
   - Creates structured error objects for tracing

## Key Architectural Patterns

1. **Factory Pattern**: `EraLoader` acts as a factory creating Question and Choice objects from data
2. **Strategy Pattern**: `evaluateChoiceCoherence()` switches strategies based on settings
3. **Composite Pattern**: Knowledge elements can contain other knowledge elements (recipes)
4. **Observer Pattern**: Game events are logged through the Logger system
5. **Repository Pattern**: `GameHistory` acts as a repository for completed games

## Current Architectural Challenges

1. **UI Mixing**: GameEngine directly uses console.log/prompt for UI which violates separation of concerns
2. **Mock Objects**: EraLoader creates mock objects with minimally implemented methods, which could be improved with proper class instantiation
3. **Hardcoded Values**: Some coherence thresholds and other values are hardcoded rather than in Settings
4. **Limited Error Recovery**: While errors are detected, recovery strategies are minimal

## Future Architecture Improvements

1. **UI Abstraction**: Create a proper UI layer to separate display from game logic
2. **Proper Object Creation**: Update EraLoader to instantiate actual classes instead of mock objects
3. **Expanded Settings**: Move hardcoded values to centralized Settings
4. **Component Event System**: Implement proper events for component communication instead of direct calling
5. **Service Locator**: Add a service locator for cross-cutting concerns like logging and error handling
