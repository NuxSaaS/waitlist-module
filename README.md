# Waitlist Module

## Features

- 🚀 **User Registration**: Simple email-based waitlist signup
- 📊 **Admin Dashboard**: Comprehensive waitlist management interface
- 🌍 **Multi-language Support**: English, Chinese, Japanese, and French
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Theme Support**: Light and dark mode compatibility
- 📈 **Analytics Tracking**: UTM parameters and source tracking
- 🔒 **Duplicate Prevention**: Email uniqueness validation
- 📧 **Status Management**: Pending, invited, and registered states

## Version
- **1.0.0**

## Installation

### Add as Git Submodule
```bash
git submodule add git@github.com:NuxSaaS/waitlist-module.git modules/waitlist
```

### Update .gitmodules (Automatically)
`.gitmodules`
```ini
[submodule "modules/waitlist"]
	path = modules/waitlist
	url = git@github.com:NuxSaaS/waitlist-module.git
```

### Configure in nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: [
    './modules/waitlist'
  ],
  waitlist: {
    enabled: true,
    path: '/waitlist',
    adminPath: '/admin/waitlist',
    apiPath: '/api/waitlist'
  }
})
```
