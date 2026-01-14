# Demo Dashboard

> A modern, production-ready admin dashboard built with Nuxt 3, Vue 3, and Ant Design Vue, featuring comprehensive CRUD operations, multi-language support, and enterprise-grade authentication.

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.15.3-00DC82?logo=nuxt.js)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.5.13-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Ant Design Vue](https://img.shields.io/badge/Ant%20Design-4.2.6-0170FE)](https://antdv.com)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development](#development)
- [Testing](#testing)

## Features

### Core Functionality
- **Authentication System** - JWT-based auth with automatic token refresh
- **Product Management** - Full CRUD operations with search, filter, sort, and bulk actions
- **User Management** - Comprehensive user administration with role and status management
- **Dashboard Analytics** - Real-time statistics with Chart.js visualizations
- **Order Management** - Order listing and tracking

### User Experience
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Multi-Language** - Full i18n support (English, Russian, Uzbek)
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Search & Filter** - Advanced filtering with debounced search
- **Bulk Operations** - Multi-select actions for efficient data management
- **CSV Export** - Export data to CSV format
- **Loading States** - Skeleton screens for perceived performance

### Technical Features
- **Type-Safe** - Full TypeScript coverage
- **State Management** - Centralized state with Pinia
- **SSR/SSG Ready** - Server-side rendering and static generation support
- **Code Quality** - ESLint + Prettier with pre-configured rules
- **Testing** - Vitest setup with unit tests
- **Performance** - Code splitting, lazy loading, and optimized bundles

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd demo-dashboard

# Install dependencies
npm install

# Copy environment variables (if needed)
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Default Login Credentials

```
Username: emilys
Password: emilyspass
```

## Tech Stack

### Core Framework
- **[Nuxt 3](https://nuxt.com)** (^3.15.3) - Full-stack Vue framework with SSR
- **[Vue 3](https://vuejs.org)** (^3.5.13) - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org)** (^5.7.3) - Type-safe development

### UI & Styling
- **[Ant Design Vue](https://antdv.com)** (^4.2.6) - Enterprise UI component library
- **[TailwindCSS](https://tailwindcss.com)** (^3.4.19) - Utility-first CSS framework
- **[Chart.js](https://www.chartjs.org)** (^4.5.1) - Data visualization
- **[Swiper](https://swiperjs.com)** (^12.0.3) - Touch slider component

### State & Data
- **[Pinia](https://pinia.vuejs.org)** (^3.0.4) - Vue state management
- **[ofetch](https://github.com/unjs/ofetch)** - HTTP client (built-in)
- **[dayjs](https://day.js.org)** (^1.11.19) - Date manipulation

### Development Tools
- **[Vitest](https://vitest.dev)** (^4.0.16) - Unit testing framework
- **[ESLint](https://eslint.org)** (^8.56.0) - Code linting
- **[Prettier](https://prettier.io)** (^2.8.8) - Code formatting

## Project Structure

```
demo-dashboard/
├── pages/                        # Application routes (auto-routed)
│   ├── index.vue                 # Dashboard home
│   ├── login.vue                 # Authentication
│   ├── products.vue              # Product listing
│   ├── products/[id].vue         # Product detail page
│   ├── users.vue                 # User management
│   ├── orders.vue                # Order listing
│   ├── favourites.vue            # Favorites page
│   ├── profile.vue               # User profile
│   ├── settings.vue              # Settings page
│   ├── inbox.vue                 # Inbox page
│   ├── calendar.vue              # Calendar page
│   ├── todo.vue                  # Todo page
│   ├── team.vue                  # Team page
│   ├── invoice.vue               # Invoice page
│   ├── stock.vue                 # Stock page
│   ├── pricing.vue               # Pricing page
│   └── contact.vue               # Contact page
├── layouts/
│   ├── default.vue               # Main layout with sidebar + header
│   └── auth.vue                  # Authentication layout
├── components/                   # UI Components
│   ├── Common/                   # Reusable base components
│   │   ├── Button/               # Custom button
│   │   ├── Icon/                 # SVG icon component
│   │   ├── Logo/                 # Theme-aware logo
│   │   ├── LazyImage/            # Lazy loading image
│   │   ├── ImageModal/           # Full-screen image modal
│   │   ├── StatusChip/           # Status badge component
│   │   ├── Skeleton/             # Loading skeletons
│   │   └── ThemeTransition/      # Theme transition wrapper
│   ├── Header/                   # Top navigation bar
│   ├── Sidebar/                  # Side navigation menu
│   ├── ThemeSwitcher/            # Theme toggle components
│   ├── LanguageSwitcher/         # Language selector
│   ├── SearchModal/              # Global search modal
│   ├── NotificationsModal/       # Notifications dropdown
│   ├── DashboardStats/           # Dashboard charts & cards
│   ├── ProductsTable/            # Products data table
│   ├── ProductCard/              # Product card component
│   ├── ProductForm/              # Product create/edit form
│   ├── ProductModal/             # Product quick view modal
│   ├── EditProductModal/         # Product edit modal
│   ├── UsersTable/               # Users data table
│   ├── UserForm/                 # User create/edit form
│   ├── UserModal/                # User quick view modal
│   ├── UserDetailModal/          # User detail modal
│   ├── OrdersTable/              # Orders data table
│   └── PromoSwiper/              # Promotional carousel
├── composables/                  # Vue composables
│   ├── useAuth.ts                # Authentication logic
│   ├── useTokenService.ts        # Token management & refresh queue
│   ├── useApiClient.ts           # HTTP client with 401 handling
│   ├── useTheme.ts               # Theme management
│   └── useSidebar.ts             # Sidebar state
├── stores/                       # Pinia state stores
│   ├── dashboard.ts              # Dashboard statistics
│   ├── products.ts               # Products state & actions
│   ├── users.ts                  # Users state & actions
│   ├── orders.ts                 # Orders state & actions
│   ├── favorites.ts              # Favorites state
│   ├── search.ts                 # Search state
│   └── sidebar.ts                # Sidebar state
├── middleware/
│   └── auth.ts                   # Route protection & token refresh
├── plugins/
│   └── dayjs.client.ts           # Day.js initialization
├── utils/                        # Utility functions
│   ├── index.ts                  # Utils exports
│   └── debounce.ts               # Debounce helper
├── i18n/                         # Translation files
│   ├── en.json                   # English
│   ├── ru.json                   # Russian
│   └── uz.json                   # Uzbek
├── tests/                        # Unit tests
│   ├── shared/                   # Composable & component tests
│   │   ├── useAuth.test.ts
│   │   ├── Icon.test.ts
│   │   └── debounce.test.ts
│   └── stores/                   # Store tests
│       └── sidebar.test.ts
├── providers/                    # Context providers
│   └── LocaleProvider.vue        # Locale context
├── types/                        # TypeScript declarations
│   └── json.d.ts                 # JSON module types
├── assets/                       # Static assets
│   └── css/                      # Global styles
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.js            # Tailwind configuration
├── vitest.config.ts              # Test configuration
└── tsconfig.json                 # TypeScript configuration
```

## Documentation

Additional documentation is available in the [docs/README.md](docs/README.md) file.

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:host         # Start with network access

# Build
npm run build            # Build for production
npm run preview          # Preview production build
npm run generate         # Generate static site

# Code Quality
npm run lint             # Check linting errors
npm run lint:fix         # Auto-fix linting issues

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Open test UI dashboard
npm run test:run         # Run tests once
npm run test:coverage    # Generate coverage report
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
NUXT_PUBLIC_API_BASE_URL='https://dummyjson.com/'
```

### Code Quality

The project includes pre-configured ESLint and Prettier with:

- 4-space indentation
- Single quotes
- 100-character line width
- Automatic import sorting
- TypeScript strict mode

## Testing

Tests are written using Vitest and Vue Test Utils:

```bash
# Run all tests
npm run test

# Watch mode
npm run test

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

Current test coverage:
- Authentication composables
- Utility functions (debounce, throttle)
- UI components (Icon, Logo)
- Store logic (sidebar, products, users)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

---

**Built with Vue 3 and Nuxt 3**
