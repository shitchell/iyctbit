# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- Open `index.html` in a browser to run the application
- No build system or package manager
- Edit code directly and refresh browser to test changes

## Code Style Guidelines
- JavaScript: 2-space indentation, semicolons, single quotes
- HTML/CSS: 2-space indentation, semantic elements
- JSON: 2-space indentation, double quotes for keys and values

## Naming Conventions
- camelCase for variables and functions
- Classes use descriptive names for HTML elements
- Keep function names descriptive of their purpose

## Architecture
- Vanilla JavaScript only - no frameworks or libraries
- Data stored in JSON files in `js/data/` directory
- Direct DOM manipulation with standard browser APIs
- Game state managed in a global state object

## Error Handling
- Use try/catch for async operations
- Provide user-friendly error messages in the UI
- Log errors to console for debugging

When making changes, maintain the existing patterns and architectural decisions.