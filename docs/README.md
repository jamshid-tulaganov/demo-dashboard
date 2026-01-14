# Demo Dashboard Documentation

A modern, feature-rich Nuxt 3 dashboard with dark/light themes, multi-language support, and custom design system.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
demo-dashboard/
├── components/           # All UI components (auto-imported)
│   ├── Common/          # Shared UI components (Button, Icon, Logo, etc.)
│   ├── Header/          # Header component
│   ├── Sidebar/         # Sidebar navigation
│   ├── DashboardStats/  # Dashboard statistics components
│   └── ...              # Other feature components
├── composables/         # Vue composables (auto-imported)
│   ├── useAuth.ts       # Authentication logic
│   ├── useApiClient.ts  # API client utilities
│   ├── useTheme.ts      # Theme management
│   └── useSidebar.ts    # Sidebar state
├── utils/               # Utility functions
│   └── debounce.ts      # Debounce and throttle utilities
├── stores/              # Pinia stores
├── pages/               # Application pages
│   ├── index.vue        # Dashboard home
│   └── login.vue        # Login page
├── layouts/             # Page layouts
│   ├── default.vue      # Main dashboard layout
│   └── auth.vue         # Authentication layout
├── locales/             # i18n translation files
├── assets/              # Static assets (fonts, images)
└── public/              # Public static files
    ├── icons/           # SVG icons
    └── assets/          # Logo files
```

## Features

### 1. Dark/Light Theme

**Toggle anywhere in the app:**
```vue
<template>
    <!-- ThemeSwitcher is auto-imported -->
    <ThemeSwitcher />
</template>
```

**Use in code:**
```typescript
// useTheme is auto-imported by Nuxt
const { isDark, toggleTheme } = useTheme();
```

**Color Palette:**
- Primary: `#4880FF`
- Success: `#00B69B`
- Warning: `#FFA756`
- Error: `#EA0234`

### 2. Multi-Language Support

**Available languages:** Uzbek (uz), Russian (ru), English (en)

**Switch language:**
```vue
<template>
    <!-- LanguageSwitcher is auto-imported -->
    <LanguageSwitcher />
</template>
```

**Use translations:**
```vue
<script setup>
// useI18n is auto-imported by Nuxt
const { t } = useI18n();
</script>

<template>
    <h1>{{ t('dashboard.title') }}</h1>
</template>
```

**Add translations:** Edit files in `locales/` directory

### 3. Custom Icons

**Add your icons:**
1. Place SVG files in `/public/icons/`
2. Make sure they use `currentColor` for theme support

**Use in components:**
```vue
<template>
    <!-- Icon is auto-imported -->
    <!-- Basic -->
    <Icon name="home" />

    <!-- Custom size -->
    <Icon name="settings" :size="32" />

    <!-- With color -->
    <Icon name="user" class="text-primary" />
</template>
```

**Convert existing icons:**
```bash
npm run icons:convert ./your-icons-folder ./public/icons
```

### 4. Logo Component

**Logo automatically switches for dark/light mode:**
```vue
<template>
    <!-- Logo is auto-imported -->
    <!-- Default size -->
    <Logo />

    <!-- Custom height -->
    <Logo :height="60" />
</template>
```

**Replace logo:** Put your SVG files in `/public/assets/icons/logo/`
- `dark.svg` - Shows in light mode
- `light.svg` - Shows in dark mode

## Typography

**Font:** Nunito Sans (loaded from Google Fonts)

**Usage:**
```vue
<template>
    <!-- Headings -->
    <h1 class="text-3xl font-bold">Title</h1>
    <h2 class="text-2xl font-semibold">Subtitle</h2>

    <!-- Body text -->
    <p class="text-base">Regular text</p>

    <!-- Emphasis -->
    <span class="font-medium">Important</span>
</template>
```

## Color System

### Tailwind Classes

**Theme-aware text:**
```vue
<template>
    <!-- Adapts to dark/light mode -->
    <p class="text-light-text-primary dark:text-dark-text-primary">
        Text content
    </p>
</template>
```

**Brand colors:**
```vue
<template>
    <div class="bg-primary text-white">Primary</div>
    <div class="text-green">Success</div>
    <div class="text-red">Error</div>
    <div class="text-orange">Warning</div>
</template>
```

**Chart colors:** `text-chart-purple`, `text-chart-yellow`, `text-chart-green`, etc.

## Creating New Pages

1. Create file in `pages/` directory
2. Choose a layout:

```vue
<script setup>
definePageMeta({
    layout: 'default',  // or 'auth'
});
</script>

<template>
    <div>Your page content</div>
</template>
```

## Components

All components are **auto-imported** by Nuxt. No import statements needed!

### Common Components

**Icon** - SVG icons with theme support
```vue
<Icon name="home" :size="24" />
```

**Logo** - Theme-aware logo
```vue
<Logo :height="40" />
```

**Button** - Reusable button component
```vue
<Button>Click me</Button>
```

**StatusChip** - Status indicator
```vue
<StatusChip status="active" />
```

**LazyImage** - Optimized image loading
```vue
<LazyImage src="/path/to/image.jpg" alt="Description" />
```

### Feature Components

- **Header** - Top navigation bar
- **Sidebar** - Side navigation menu
- **ThemeSwitcher** - Theme toggle
- **LanguageSwitcher** - Language selector
- **SearchModal** - Global search
- **NotificationsModal** - Notifications panel

### Ant Design Components

All Ant Design Vue components are available:
```vue
<template>
    <a-button type="primary">Button</a-button>
    <a-card>Card content</a-card>
    <a-form>Form</a-form>
</template>
```

## Composables

All composables are **auto-imported** by Nuxt.

### useAuth
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### useApiClient
```typescript
const { fetch, client, loading } = useApiClient();

// SSR-friendly fetch
const { data } = await fetch.get('/users');

// Client-side mutations
await client.post('/users', { body: userData });
```

### useTheme
```typescript
const { isDark, toggleTheme, themeConfig } = useTheme();
```

### useSidebar
```typescript
const { collapsed, toggleCollapsed, mobileMenuOpen } = useSidebar();
```

## Common Tasks

### Add a new language

1. Add locale file: `locales/fr.json`
2. Update `nuxt.config.ts`:
```typescript
i18n: {
    locales: [
        { code: 'fr', name: 'Français', file: 'fr.json' },
        // ...existing locales
    ],
}
```

### Change primary color

Edit `composables/useTheme.ts`:
```typescript
token: {
    colorPrimary: '#YOUR_COLOR',
}
```

### Add custom font

1. Add Google Fonts link in `nuxt.config.ts`
2. Update `tailwind.config.js`:
```javascript
fontFamily: {
    sans: ["Your Font", "sans-serif"],
}
```

## Troubleshooting

### "Failed to fetch dynamically imported module"
```bash
# Clear cache and restart
rm -rf .nuxt node_modules/.vite
npm run dev
```

### Icons not showing
- Check file exists in `/public/icons/`
- Verify file name matches (case-sensitive)
- Hard refresh browser (Ctrl+Shift+R)

### Theme not switching
- Check localStorage in browser DevTools
- Verify `typeof window !== 'undefined'` checks are in place
- Clear browser cache

### Translation not found
- Check key exists in locale files
- Verify locale file is imported in `i18n.config.ts`
- Check for typos in translation key

## Tech Stack

- **Framework:** Nuxt 3
- **UI Library:** Ant Design Vue
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Internationalization:** @nuxtjs/i18n
- **TypeScript:** Full type safety

## Configuration Files

- `nuxt.config.ts` - Nuxt configuration
- `tailwind.config.js` - Tailwind CSS setup
- `i18n.config.ts` - i18n configuration
- `tsconfig.json` - TypeScript settings

## Best Practices

1. **Use composables** - Keep logic in `composables/`
2. **Auto-imports** - Components and composables are auto-imported
3. **Type everything** - Use TypeScript for all code
4. **Theme-aware** - Always consider dark/light modes
5. **Translations** - Use `t()` for all user-facing text
6. **SSR-safe** - Use `typeof window !== 'undefined'` for browser APIs

## Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Generate static site
npm run generate
```

## License

Private project

---

**Need help?** Check the code or create an issue in the repository.
