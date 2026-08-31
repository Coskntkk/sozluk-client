# 📖 Sözlük Client

> A full-featured, production-grade **community dictionary platform** built as a portfolio project. Users write and discuss dictionary-style entries on topics — powered by Next.js SSR, real-time Socket.IO notifications, a complete moderation suite, and interactive admin analytics.

[![CI](https://github.com/Coskntkk/sozluk-client/actions/workflows/ci.yml/badge.svg)](https://github.com/Coskntkk/sozluk-client/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Tests](https://img.shields.io/badge/tests-32%2F32%20passing-brightgreen?logo=jest)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

---

## ✨ Features

### 🌐 Platform Core
- **Server-Side Rendering (SSR)** — Dynamic `getServerSideProps` on all public routes for SEO and fast initial paint
- **Community Dictionary** — Create topics, write entries, vote up/down, browse by agenda or recents
- **User Profiles** — Avatars, bio, role badges, authored entries tab, voted entries tab, follow/unfollow
- **Real-Time Notifications** — Socket.IO live feed for votes, follows, comments, and moderation events

### 🛡️ Moderation & Admin Suite
- **Report Queue** — Triage reported entries; accept (delete) or reject with in-site confirmation modals
- **Rookie Queue** — Review pending first-time entries, approve for publication or promote user to Author
- **Admin Visual Analytics** — Interactive role distribution matrix, content velocity metrics, moderation pipeline health gauge
- **Moderator Management** — Appoint or dismiss moderators by username; live moderator list

### 🌓 Dark Mode
- Zero-flicker theme engine (light / dark / system) with `localStorage` persistence and OS preference detection
- Applied across all components — navbar, sidebar, entries, modals, forms, and analytics

### 🌍 Internationalization
- Full **English**, **Turkish**, and **French** localization (`i18next` / `react-i18next`)
- Every UI string, error message, and confirmation dialog is translated — zero hardcoded text

### 🏷️ Role System
| Role | Badge | Permissions |
|---|---|---|
| Rookie 🌱 | First-time contributor | Entries require moderator approval |
| Author ✍️ | Established contributor | Posts instantly |
| Moderator 🛡️ | Platform moderator | Report queue, rookie queue |
| Admin ⚡ | Platform administrator | Full access + analytics + mod management |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) — Pages Router + SSR |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| State | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Forms | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| Real-time | [Socket.IO Client](https://socket.io/) |
| i18n | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) |
| Testing | [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) |
| Containerization | [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) |
| CI | [GitHub Actions](https://github.com/features/actions) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `20.x` or higher
- Running [Sözlük API](https://github.com/Coskntkk/sozluk-api) backend (default: `http://localhost:3000`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Coskntkk/sozluk-client.git
cd sozluk-client

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Development Server

```bash
npm run dev
# → http://localhost:3001
```

### Production Build

```bash
npm run build
npm start
# → http://localhost:3001
```

---

## 🧪 Testing

```bash
# Run all 32 tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Suite

| File | Coverage |
|---|---|
| `__tests__/context/ThemeContext.test.tsx` | Theme toggling, dark class sync, persistence |
| `__tests__/services/TokenService.test.ts` | In-memory & localStorage token storage |
| `__tests__/utils/ToastNotify.test.ts` | Notification triggers and configs |
| `__tests__/redux/authSlice.test.ts` | Auth state transitions, role hydration |
| `__tests__/components/ConfirmModal.test.tsx` | In-site confirmation dialogs |
| `__tests__/components/Pagination.test.tsx` | Page navigation and boundary states |
| `__tests__/components/TitleHeader.test.tsx` | Heading structure and entry counts |
| `__tests__/components/UserComponent.test.tsx` | Profile headers, badges, dual tabs |

---

## 🐳 Docker

### Quick Start with Docker Compose

```bash
docker compose up --build -d
# → http://localhost:3001
```

### Manual Docker Build

```bash
# Build
docker build -t sozluk-client .

# Run
docker run -d -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  --name sozluk-client \
  sozluk-client
```

---

## ⚙️ CI/CD

Every push and pull request to `main` automatically runs:

1. **TypeScript type check** — `tsc --noEmit`
2. **ESLint** — enforces code style
3. **Jest test suite** — 32 tests with coverage report
4. **Next.js production build** — validates the full build pipeline

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for the full pipeline definition.

---

## 📁 Project Structure

```
sozluk-client/
├── components/
│   ├── Entry/            # Entry detail page & permalink
│   ├── Home/             # Homepage agenda & top entries
│   ├── Moderation/       # Dashboard, report & rookie queues, admin analytics
│   ├── Title/            # Topic page with paginated entry feed
│   ├── User/             # Profile view, edit modal, follow
│   └── shared/           # ConfirmModal, CreateEntry, Pagination, Notifications…
├── context/              # ThemeContext, SocketContext
├── layout/               # Navbar, LeftFrame, RightFrame, Footer, ThemeToggle
├── pages/                # Next.js routes + getServerSideProps
│   ├── index.tsx         # SSR homepage
│   ├── t/[slug].tsx      # SSR topic page
│   ├── e/[id].tsx        # SSR entry permalink
│   ├── u/[username].tsx  # SSR user profile
│   └── moderation.tsx    # Protected moderation dashboard
├── public/locales/       # i18n — EN / TR / FR
├── redux/                # Store, auth slice
├── services/             # Axios API client, TokenService, SocketService
├── types/                # Shared TypeScript interfaces
├── utils/                # ToastNotify helpers
└── __tests__/            # Jest test suites
```

---

## 🔗 Related

- **API / Backend**: [Coskntkk/sozluk-api](https://github.com/Coskntkk/sozluk-api)

---

## 👤 Author

**Coşkun Taşkın Küçük** — [@Coskntkk](https://github.com/Coskntkk)
