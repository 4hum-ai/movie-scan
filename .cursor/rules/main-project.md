---
description: 'Main project rules for movie-scan Vue.js application with mandatory workflow and architecture'
globs: ['**/*']
alwaysApply: true
priority: 1
---

# Cursor Rules for Movie Scan Project

## 1. MANDATORY Development Workflow for AI

**🚨 CRITICAL: NO EXCEPTIONS - HUMAN APPROVAL REQUIRED FOR ALL WORK**

### Workflow Steps (MUST BE FOLLOWED IN ORDER):

1. **📋 PLAN PHASE** (MANDATORY - NO IMPLEMENTATION WITHOUT THIS)
   - Create detailed plan with todos using `todo_write` tool
   - Break down task into specific, actionable items
   - Include estimated complexity and dependencies
   - Present plan to human for approval
   - **WAIT FOR EXPLICIT HUMAN APPROVAL** before proceeding

2. **✅ APPROVAL CHECKPOINT** (MANDATORY)
   - Human must explicitly approve the plan
   - If human requests changes, revise plan and re-present
   - Only proceed to implementation after receiving approval

3. **🔨 IMPLEMENT PHASE** (Only after approval)
   - Follow the coding conventions and architecture patterns outlined below
   - Update todos as work progresses
   - Mark completed todos as done
   - **COMMIT CHECKPOINT**: Commit implementation changes before proceeding

4. **🧪 TEST PHASE** (If needed)
   - Add unit tests for new functionality when appropriate
   - Update todos to reflect testing status
   - **COMMIT CHECKPOINT**: Commit test changes before proceeding

5. **📚 DOCS PHASE** (If needed)
   - Update relevant documentation if changes affect system architecture or usage
   - Update todos to reflect documentation status
   - **COMMIT CHECKPOINT**: Commit documentation changes before proceeding

6. **💾 FINAL COMMIT PHASE** (MANDATORY - NO EXCEPTIONS)
   - Create descriptive commit message following conventional commit format
   - Push to github
   - **VERIFY COMMIT SUCCESS**: Confirm commit was pushed successfully
   - **WORKFLOW COMPLETE**: Only mark work as finished after successful commit

### Commit Requirements & Validation

#### Commit Message Format (MANDATORY)

- Follow conventional commit format: `type(scope): description`
- Examples: `feat(ui): add new form component`, `fix(auth): resolve login validation issue`
- Include detailed description in commit body when needed
- Reference issue numbers when applicable

#### Commit Validation Checklist

- [ ] All changes are staged and ready to commit
- [ ] Commit message follows conventional format
- [ ] Commit is pushed to remote repository
- [ ] Push was successful (no errors)
- [ ] All phases of work are properly committed
- [ ] Work is not marked complete until commit verification

#### Commit Enforcement Rules

- **NO EXCEPTIONS**: Every phase must end with a successful commit
- **VERIFICATION REQUIRED**: Always confirm commit success before proceeding
- **WORKFLOW BLOCKING**: Cannot proceed to next phase without commit
- **COMPLETION GATE**: Work is incomplete until final commit is verified

## 2. Architecture & Patterns

### Architecture Map

- Entry: `src/main.ts` (Pinia, Router, Theme init)
- Routing: `src/router/index.ts`
- State: `src/stores/auth.ts`
- API Service: `src/composables/useResourceService.ts`
- API gateway: `src/utils/useApiGateway.ts` (fetch + Firebase token)
- CDN service: `src/composables/useCdn.ts` (load files from CDN instead of origin)
- Media players: `src/components/organisms/VideoPlayer.vue`, `src/components/organisms/AudioPlayer.vue`
- Image optimization: Use `<Image>` component for optimization and image transformation
- Views: `src/views/ItemListView.vue`, `src/views/ItemDetailView.vue`
- Shared components in atomic design: `src/components/{atoms,molecules,organisms,templates}`

### Design Patterns

- **Composition API**: Use `<script setup lang="ts">` exclusively
- **Atomic Design**: Strict component hierarchy (atoms → molecules → organisms → templates)
- **Service Layer**: All API calls through `useResourceService` composables
- **State Management**: Pinia stores for global state, local state in components
- **Error Boundaries**: Graceful error handling with user-friendly messages

## 7. AI Collaboration Guidelines

### 🎯 MANDATORY AI BEHAVIOR

- **ALWAYS** start with planning phase using `todo_write` tool
- **ALWAYS** wait for explicit human approval before any implementation
- **ALWAYS** explain what you're about to do before doing it
- **ALWAYS** ask for clarification if requirements are ambiguous
- **NEVER** assume you have permission to proceed
- **NEVER** skip the approval checkpoint

### Communication

- Always explain the reasoning behind code decisions
- Provide context for complex implementations
- Suggest alternatives when appropriate
- Ask clarifying questions for ambiguous requirements
- **Explicitly state when you're waiting for approval**

### Code Generation

- Generate complete, runnable code
- Include proper error handling
- Add appropriate TypeScript types
- Follow the established patterns in the codebase
- Provide examples for complex usage
- **Only generate code after receiving explicit approval**

### Review Process

- Always review generated code before implementation
- Test functionality thoroughly
- Ensure consistency with existing codebase
- Update documentation as needed
- Consider edge cases and error scenarios

### 🚨 COMPLIANCE ENFORCEMENT

- If you catch yourself about to implement without approval, STOP immediately
- If you realize you skipped the planning phase, STOP and restart with planning
- If human asks you to do something, respond with "I'll create a plan for that and wait for your approval"
- Always use phrases like "I'm waiting for your approval to proceed" or "Please approve this plan so I can continue"
- **COMMIT ENFORCEMENT**: Never mark work as complete without successful commit and push
- **COMMIT MONITORING**: Always verify commit success before proceeding to next phase
- **WORKFLOW VALIDATION**: Check that all phases have been completed with commits before finishing
- **FINAL CHECK**: Confirm all changes are committed and pushed before declaring work done
