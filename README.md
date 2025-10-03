# 🎬 Movie Scan

**Movie Scan** is a web application designed for **film authorities, censorship boards, and content compliance teams**.  
It helps organizations efficiently **analyze, review, and approve films** for public release.

## ✨ Features

- 🔍 **Automated Content Scanning** — AI-assisted detection of sensitive or restricted scenes
- 🏷️ **Tagging & Classification** — Frame-by-frame tagging, age-rating suggestions (PG, R, 18+, etc.)
- ✅ **Approval Workflow** — Digital submission, multi-level review, and final certification
- 📊 **Analytics & Reporting** — Generate compliance reports, track decisions, and export approvals
- 🎥 **Media Management** — Advanced video/audio processing with CDN optimization
- 🔐 **Role-based Access** — Secure authentication and authorization for regulatory teams

## 🛠️ Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite
- **Styling:** TailwindCSS, Headless UI
- **State Management:** Pinia stores
- **Routing:** Vue Router with dynamic routes
- **Authentication:** Firebase Auth / Google Identity Services
- **Media Processing:** HLS.js, WebVTT for video analysis
- **Icons:** Material Design Icons (MDI)
- **Testing:** Vitest + Vue Test Utils
- **Deployment:** Cloudflare Pages

## 🛠️ Development Guidelines

- **Icons**: Use Material Design Icons (MDI) via unplugin-icons. See [Icon Usage Guide](docs/ICON_USAGE.md) for conventions.
- **Styling**: Tailwind CSS classes only
- **State Management**: Pinia stores
- **API**: Use composables and services, not direct fetch calls
- **Media Processing**: Leverage existing video/audio components for content analysis
- **Security**: Implement role-based access control for regulatory compliance

### Quick start

```bash
# 1) Copy environment and fill values
cp env.example .env
# 2) Install dependencies
pnpm install
# 3) Start the dev server
pnpm dev
# 4) Build for production
pnpm build
# 5) Preview production build
pnpm preview
```
