# Demo Dashboard

Frontend Dashboard Application built with Nuxt 3, following Feature-Sliced Design (FSD) architecture.

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** methodology for better scalability and maintainability.

### 📁 Project Structure

```
demo-dashboard/
├── app/                    # App initialization layer
│   └── providers/         # Global providers (theme, etc.)
├── pages/                  # Nuxt pages (routing)
│   └── index.vue          # Home page
├── widgets/               # Composite UI blocks
│   ├── Header/            # Header widget with language switcher
│   └── LanguageSwitcher/  # Language switcher widget
├── features/              # User interactions & business features
├── entities/              # Business entities
├── shared/                # Shared layer (reusable across all layers)
│   ├── lib/               # Shared libraries
│   │   └── i18n/         # Internationalization utilities
│   ├── ui/                # Shared UI components
│   │   └── Button/       # Reusable button component
│   ├── config/            # App configuration
│   └── api/               # API clients
├── plugins/               # Nuxt plugins
│   └── i18n.ts           # i18n plugin configuration
├── locales/               # Translation files
│   ├── uz.json           # Uzbek (default)
│   ├── en.json           # English
│   └── ru.json           # Russian
├── assets/                # Static assets
│   └── css/              # Stylesheets
├── types/                 # TypeScript declarations
│   ├── vue-i18n.d.ts     # i18n types
│   └── json.d.ts         # JSON module types
└── public/                # Public static files
```

## 🎯 FSD Layers (Bottom to Top)

1. **shared/** - Reusable utilities, UI kit, configs
   - Can be used by all layers above
   - No business logic
   - Pure, isolated code

2. **entities/** - Business entities (User, Product, etc.)
   - Represents business domain models
   - Can use: shared

3. **features/** - User scenarios and business features
   - Complete user interactions
   - Can use: shared, entities

4. **widgets/** - Large composite UI blocks
   - Assembled from features, entities, shared
   - Can use: shared, entities, features

5. **pages/** - Full pages (routes)
   - Composed of widgets, features
   - Can use: shared, entities, features, widgets

6. **app/** - App-level setup and providers
   - Global initialization
   - Can use: all layers

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Development Server

```bash
npm run dev
# or
yarn dev
```

Visit: http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌍 Internationalization (i18n)

The app supports three languages:
- 🇺🇿 **Uzbek (uz)** - Default
- 🇷🇺 **Russian (ru)**
- 🇬🇧 **English (en)**

### Usage in Components

```vue
<script setup lang="ts">
import { useLocale } from '~/shared/lib/i18n';

const { t, locale, setLocale, availableLocales } = useLocale();
</script>

<template>
    <div>
        <h1>{{ t('common.welcome') }}</h1>
        <button @click="setLocale('en')">Switch to English</button>
    </div>
</template>
```

### Adding Translations

Edit JSON files in `locales/` directory:
- `locales/uz.json` - Uzbek translations
- `locales/en.json` - English translations
- `locales/ru.json` - Russian translations

Example structure:
```json
{
    "common": {
        "welcome": "Welcome",
        "home": "Home"
    },
    "dashboard": {
        "title": "Dashboard"
    }
}
```

## 🎨 Tech Stack

- **Nuxt 3** - Vue.js framework
- **Vue 3** - Composition API
- **TypeScript** - Type safety
- **Pinia** - State management
- **Vue I18n** - Internationalization
- **Ant Design Vue** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **ESLint + Prettier** - Code quality

## 📝 Code Quality

### Linting

```bash
npm run lint
```

### Auto-fix Issues

```bash
npm run lint:fix
```

## 📖 FSD Import Rules

**Import restrictions by layer:**

```typescript
// ✅ Allowed
// shared/ can import: nothing (lowest layer)
// entities/ can import: shared/*
// features/ can import: shared/*, entities/*
// widgets/ can import: shared/*, entities/*, features/*
// pages/ can import: shared/*, entities/*, features/*, widgets/*
// app/ can import: everything

// ❌ Not allowed
// Lower layers cannot import from upper layers
// shared/ ❌ cannot import from entities/
// entities/ ❌ cannot import from features/
```

### Example Imports

```typescript
// In widgets/Header/Header.vue
import { useLocale } from '~/shared/lib/i18n';  // ✅ OK
import { LanguageSwitcher } from '~/widgets/LanguageSwitcher';  // ✅ OK (same layer)

// In entities/User/model.ts
import { api } from '~/shared/api';  // ✅ OK
import { SomeWidget } from '~/widgets/SomeWidget';  // ❌ BAD (upper layer)

// In shared/ui/Button/Button.vue
import { useUser } from '~/entities/User';  // ❌ BAD (shared cannot import from entities)
```

## 🛠️ Development Guidelines

1. **Follow FSD layer rules** - Respect import restrictions
2. **Keep shared/ pure** - No business logic in shared layer
3. **Single responsibility** - One component = one purpose
4. **Barrel exports** - Use index.ts for clean imports
5. **Type safety** - Always use TypeScript
6. **Component structure**:
   ```
   FeatureName/
   ├── FeatureName.vue
   ├── index.ts (barrel export)
   └── types.ts (if needed)
   ```

## 📦 Adding New Features

1. Determine the correct layer (shared/entities/features/widgets)
2. Create folder with component name
3. Add barrel export (index.ts)
4. Import using the layer path (e.g., `~/features/FeatureName`)

## 🤝 Contributing

1. Follow FSD architecture principles
2. Use TypeScript for all new files
3. Add translations for all user-facing text
4. Run linter before committing
5. Keep components small and focused

## 📄 License

MIT
