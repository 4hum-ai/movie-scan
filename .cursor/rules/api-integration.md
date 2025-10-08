---
description: 'API integration rules for useResourceService, API gateway, and CDN service patterns'
globs: ['src/composables/**/*.ts', 'src/utils/**/*.ts', 'src/stores/**/*.ts']
alwaysApply: false
priority: 4
---

# API Integration Rules

## Service Layer Architecture

All API calls must go through the service layer:

- **useResourceService**: Main composable for CRUD operations
- **useApiGateway**: Low-level fetch wrapper with Firebase token
- **useCdn**: CDN service for loading files from CDN instead of origin
- **Pinia Stores**: Global state management for API data

## 6. Security & Best Practices

### Security

- Sanitize user inputs
- Validate API responses
- Use proper authentication tokens
- Implement proper CORS policies
- Never expose sensitive data in client code
