# SubTrackr

> Smart subscription tracking app built with Expo + React Native.
>
> Keep renewals under control, avoid surprise charges, and track your spending like a pro.

## 📌 About

SubTrackr is a mobile-first subscription management app designed to help people stay in control of recurring expenses. It gives users a clean view of active plans, upcoming renewals, and spending insights so they can make better financial decisions before charges hit.

This project focuses on practical day-to-day usability: fast onboarding, clear subscription visibility, secure authentication, and intuitive dashboards. It is built with Expo and React Native, making it easy to run, extend, and ship across platforms.

## ✨ App Highlights

- 🔐 Authentication with Clerk
- 👋 Smooth onboarding and auth flow
- 🧭 Tab-based navigation with Expo Router
- 📅 Subscription list + upcoming renewals
- 📊 Insights screen for spending visibility
- 🎨 NativeWind styling system
- 🛡️ Secure session token storage
- 📈 PostHog analytics integration

## 🧰 Tech Stack

```txt
Frontend: React Native, Expo
Routing: Expo Router
Language: TypeScript
Styling: NativeWind + global.css
Auth: Clerk (@clerk/expo)
Analytics: PostHog (posthog-react-native)
Storage: Expo Secure Store
```

## 🗂️ Project Structure

```txt
app/
  (auth)/             # Sign-in and sign-up screens
  (tabs)/             # Main app tabs: home, subscriptions, insights, settings
  _layout.tsx         # Root providers + app shell
components/           # Reusable UI components
constants/            # Theme tokens, static config, icons/images refs
libs/                 # Validation and utility helpers
assets/               # Fonts and images
global.css            # NativeWind global styling entry
metro.config.js       # NativeWind metro integration
```

## 🚀 Quick Start

### 1) Prerequisites

- Node.js 18+
- npm
- Expo Go app (phone) or emulator/simulator

### 2) Install

```bash
npm install
```

### 3) Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Add the following keys:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
EXPO_PUBLIC_POSTHOG_API_KEY=your_key_here
EXPO_PUBLIC_POSTHOG_HOST=https://your-host
```

### 4) Run the App

```bash
npm run start
```

Then use:

- `a` -> Android
- `i` -> iOS
- `w` -> Web

Or run platform commands directly:

```bash
npm run android
npm run ios
npm run web
```

## 📜 Scripts

```bash
npm run start          # Start Expo dev server
npm run android        # Launch on Android
npm run ios            # Launch on iOS
npm run web            # Launch on web
npm run lint           # Run lint checks
npm run reset-project  # Reset project helper script
```

## 🎨 Styling Setup

```txt
global.css            -> Global utility styles and design styling
constants/theme.ts    -> Theme tokens (colors, spacing, component values)
metro.config.js       -> NativeWind input wiring
```

## 🔒 Security Notes

- Auth/session handled via Clerk
- Tokens stored with `expo-secure-store`
- Keep `.env` private (never commit secrets)

## 🤝 Contributing

Contributions are welcome.

```bash
# Typical flow
git checkout -b feature/your-feature-name
npm run lint
# test on device/emulator
git commit -m "feat: your change"
```

Open a PR with:

- Short summary
- Screenshots/GIF if UI changed
- Test notes

## 🛣️ Roadmap

- 🔔 Renewal reminders/notifications
- 💸 Spend limits and budget alerts
- 🔍 Better analytics filters
- 📤 Data export options
- 👨‍👩‍👧 Shared workspace/family subscriptions

## 📄 License

Add your preferred license (for example: MIT).

---

Built with caffeine, TypeScript, and subscription anxiety. ☕
