# Gym App

A cross-platform (iOS and Android) gym app built with Expo and React Native. It has a Simple mode for people new to the gym and an Advanced mode for experienced lifters.

The full feature list and phased roadmap are in [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md).

## Getting started

```bash
cd gymApp
npm install
npx expo start
```

Health data, 3D rendering and other native modules don't run in Expo Go, so use a development build:

```bash
npx eas-cli@latest build --profile development --platform ios   # or android
```

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Jest unit tests |

## Project layout

- `src/app/`: screens (Expo Router; each file is a route)
- `src/components/`: shared UI
- `src/store/`: app state (Zustand, saved on the device with expo-sqlite)
- `src/constants/theme.ts`: colours and spacing
