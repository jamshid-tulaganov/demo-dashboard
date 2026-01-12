# Demo Dashboard

A modern admin dashboard built with Nuxt 3, Vue 3, and Ant Design Vue.

## Features

- 📊 Dashboard with statistics and charts
- 👥 User management
- 📦 Product management
- 🌐 Multi-language support (English, Russian, Uzbek)
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔐 Authentication system

## Tech Stack

- **Framework:** Nuxt 3
- **UI Library:** Ant Design Vue
- **State Management:** Pinia
- **Styling:** TailwindCSS
- **Charts:** Chart.js
- **i18n:** @nuxtjs/i18n
- **Testing:** Vitest

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Testing

Run unit tests:

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate coverage report
```

## Project Structure

```
demo-dashboard/
├── assets/          # Static assets (CSS, images)
├── i18n/            # Translation files
├── layouts/         # App layouts
├── middleware/      # Route middleware
├── pages/           # App pages/routes
├── plugins/         # Nuxt plugins
├── providers/       # Data providers
├── shared/          # Shared components and utilities
├── stores/          # Pinia stores
├── tests/           # Unit tests
└── widgets/         # Complex UI components
```

## API

This project uses [DummyJSON API](https://dummyjson.com) for demo data.

## License

MIT
