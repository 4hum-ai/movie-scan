---
description: 'Vue.js component development rules for Composition API, atomic design, and Vue 3 best practices'
globs: ['src/components/**/*.vue', 'src/views/**/*.vue']
alwaysApply: false
priority: 2
---

# Vue.js Component Development Rules

## 3. Coding Conventions

### Language & Framework

- Language: TypeScript, Vue 3 SFC `<script setup lang="ts">`
- State: Pinia stores under `src/stores/*`
- Composables: `src/composables/*` return plain functions/objects and avoid side effects on import
- Styling: Tailwind classes only; do not add global CSS unless in `src/style.css`
- API: Use `useResourceService` methods; do not fetch directly in components
- CDN: Use `useCdn()` composable to load files from CDN instead of origin
- Media: Use `VideoPlayer` and `AudioPlayer` components for media playback with CDN by default.
- Images: Use `<Image>` component for optimization and image transformation
- Routing: `src/router/custom.ts` for custom routes and `src/router/generic.ts` for generic routes that support low-code backend
- Icons: Use `unplugin-icons` with mdi iconset `@iconify-json/mdi`

### Component Development

- Use atomic design principles strictly
- Props should be typed with interfaces: `defineProps<PropsInterface>()`
- Emit events with proper typing: `defineEmits<EmitsInterface>()`
- Use `ref()` and `reactive()` appropriately for state
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Use `computed()` for derived state
- Use `watch()` and `watchEffect()` for side effects

### Error Handling

- Use try-catch blocks in composables and async functions
- Surface errors via `useToast.push()` with appropriate severity levels
- Log errors to console in development mode
- Handle network errors gracefully with retry logic
- Provide fallback UI for error states
- Never use `alert()` or `console.error()` for user-facing errors

### Performance

- Use `v-memo` for expensive list rendering
- Implement proper loading states with skeleton loaders
- Lazy load heavy components with `defineAsyncComponent()`
- Optimize images with proper sizing and lazy loading
- Use `shallowRef()` for large objects that don't need deep reactivity
- Debounce search inputs and API calls
- Implement virtual scrolling for large lists

## 5. Code Quality

### Code Organization

- One component per file
- Group related composables together
- Use barrel exports (`index.ts`) for clean imports
- Keep files under 300 lines when possible
- Use meaningful variable and function names

### Documentation

- JSDoc comments for complex functions
- README updates for architectural changes
- Inline comments for business logic
- Type definitions serve as documentation

## 6. Security & Best Practices

### Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

### Performance Monitoring

- Use browser dev tools for performance analysis
- Monitor bundle size and loading times
- Implement proper caching strategies
- Use service workers for offline functionality
- Monitor Core Web Vitals
