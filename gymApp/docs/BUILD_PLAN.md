# Gym App: Build Plan

Status: Phase 0 in review ([PR #1](https://github.com/kylekovac1997/React-auth0/pull/1)) · updated 2026-10-20 with the extra features in 4.10

## 1. What we're building

A cross-platform mobile gym app with:

- **Two modes**: *Simple* (beginner-friendly, info split across more tabs, plain-English explanations of macros and workouts) and *Advanced* (dense dashboards, full macro/micro breakdowns, volume, RPE, 1RM, trends).
- **A 3D body** at the centre of the app that represents the user, built from stats entered at onboarding, with a "goal body" they're working towards.
- **Barcode food scanning** to log calories and macros.
- **Workout plans by style** (bodybuilding, powerlifting, CrossFit-style conditioning, general fitness, etc.).
- **Daily workout tracker**: start workout → pick exercise → log sets → rest countdown that vibrates when it's time to go again.
- **Health app sync** (Apple Health / Android Health Connect) and **step reminders**.
- **Scheduled weigh-in reminders**.
- **An advice engine** that tells the user how to reach their goal based on their data.
- **Rich animations** throughout.

## 2. Tech stack

| Area | Choice | Why |
|---|---|---|
| App framework | **React Native + Expo (TypeScript)**, Expo Router for navigation | One codebase for iOS and Android; Expo dev builds support the native modules we need |
| 3D body | **@react-three/fiber/native** + **expo-gl** + **@react-three/drei** (`useGLTF`) | Three.js on mobile; supports glTF models with morph targets |
| Animations | **react-native-reanimated** + **react-native-gesture-handler**, **Moti** for declarative transitions, **Lottie** (`lottie-react-native`) for celebration / empty-state animations, **react-native-skia** for animated rings and charts | Runs on the UI thread at 60/120fps |
| Barcode scanning | **expo-camera** (`CameraView` with `barcodeScannerSettings` for EAN-13/UPC) | Built into Expo, no extra licence |
| Health data | **react-native-health** (Apple HealthKit), **react-native-health-connect** (Android) | The two maintained bridges; need an Expo dev build with config plugins |
| Step fallback | **expo-sensors** `Pedometer` | Works if the user declines health permissions |
| Notifications | **expo-notifications** (local scheduled notifications) | Weigh-ins, step nudges, rest-timer end while app is backgrounded |
| Vibration | **expo-haptics** + RN `Vibration` for longer patterns | Rest timer finish |
| Local storage | **expo-sqlite** with **Drizzle ORM** | Offline-first workout and food logs |
| State | **Zustand** (+ TanStack Query for API calls/caching) | Small, simple |
| Charts | **victory-native** (Skia-based) | Weight, macro and volume trends |
| Cloud sync (later) | **Supabase** (free tier) | Accounts, backup, multi-device. Optional for v1 |

## 3. Free data sources (checked)

### Food: Open Food Facts ✅ free
- Read a product by barcode: `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json?fields=product_name,brands,nutriments,serving_size,image_front_url`
- **No API key.** Must send a custom User-Agent: `GymApp/1.0 (contact email)`.
- **Rate limit: 15 product reads per minute per IP.** From a phone app this applies per user, which is fine for scanning.
- Licence: database ODbL, images CC BY-SA, so we need an attribution line in the app.
- Gaps: not every product is listed and some have missing nutrients. Plan: a "not found" flow where the user types values in manually (and optionally contributes back to OFF), plus a local cache of scanned items.
- Source: [OFF API docs](https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/)

### Exercises: free-exercise-db ✅ free (public domain)
- One JSON file, **876 exercises**, with images, instructions, level (beginner/intermediate/expert), equipment, and primary/secondary muscles.
- Categories: strength 584, stretching 123, plyometrics 61, powerlifting 38, olympic weightlifting 35, strongman 21, cardio 14.
- **Unlicense (public domain)**, so we bundle it in the app and it works offline.
- The 17 muscle names (chest, lats, quadriceps, glutes, etc.) map directly to regions on the 3D body, so we can light up the muscles each exercise works.
- Source: [github.com/yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)

### Exercises (backup/extra): wger ✅ free
- Open-source REST API at wger.de. Exercise lists need no authentication and aren't throttled. Good for extra exercises, translations and videos.
- Its routines are user-owned (need a login), so it **does not** give us ready-made public plans.
- Source: [wger API docs](https://wger.readthedocs.io/en/latest/api/api.html)

### Workout plans by style: we write these ourselves
No free API offers curated programmes for bodybuilding, CrossFit-style training and so on. We'll ship our own plan templates as JSON that reference exercise IDs from free-exercise-db:

- **Bodybuilding**: Push/Pull/Legs, Upper/Lower, Bro split (hypertrophy, 8 to 12 reps)
- **Powerlifting / strength**: 5×5 linear progression, 5/3/1-style
- **CrossFit-style conditioning**: EMOM, AMRAP and For Time templates using plyometric, olympic and cardio moves
- **General fitness / fat loss**: full-body 3 days a week plus a step target
- **Home / no equipment**: filtered by `equipment = body only`

Each template is scaled by experience level (from onboarding) and days per week.

## 4. Feature specs

### 4.1 Onboarding
1. Mode pick (Simple / Advanced). This can be changed any time in settings.
2. Stats: sex, age, height, weight, optional body-fat % (or a visual picker of body shapes), activity level.
3. Goal: lose fat / build muscle / recomp / get stronger / improve fitness, plus a target weight and date.
4. Training: style, days per week, session length, equipment available, experience.
5. Permissions: health data, notifications, camera (each asked at the moment it's first needed, with a short explanation).
6. Result: the 3D body is generated, then "your plan" is revealed with calorie and macro targets.

**Calorie and macro maths**: Mifflin-St Jeor BMR × activity factor = TDEE. Adjust for the goal (for example −20% for a cut, +10% for a lean bulk). Protein 1.6 to 2.2 g/kg, fat ~25% of calories, carbs fill the rest. Recalculate after each weigh-in trend.

### 4.2 Simple vs Advanced modes
Same data underneath, different presentation. A `useMode()` hook picks the component variant for each screen.

| Screen | Simple | Advanced |
|---|---|---|
| Home | 3D body, today's workout card, one calorie ring | 3D body plus a macro split, weekly volume per muscle, readiness |
| Nutrition | Separate tabs: Calories, Protein, Carbs, Fats, each with a "what is this?" explainer | One dense screen: macros, fibre, sugar, sodium, per-meal breakdown, net vs target |
| Workout | Guided: one exercise at a time with image and instructions | Table view: sets × reps × weight, RPE/RIR, estimated 1RM, previous-session comparison |
| Progress | Weight trend line and "you're on track" message | Weight with moving average, body measurements, volume and PR charts |

### 4.3 The 3D body
- **Model**: one base human in glTF with **morph targets** (height, body fat, muscle mass, shoulder/waist/hip widths), male and female bases. Source: export from **MakeHuman** (exported models are CC0), then add shape keys in Blender and split muscle groups into named meshes or vertex groups.
- **Mapping stats to shape**: height scales the skeleton; weight plus body-fat % drives the fat and muscle morph weights. This is an approximation of the user, not a body scan.
- **Goal ghost**: a translucent second body showing the target shape. Users can scrub a slider from "now" to "goal".
- **Muscle highlighting**: when an exercise is picked, its primary muscles glow and secondary muscles glow faintly. On the home screen a heatmap shows the muscles trained this week (it also flags neglected ones).
- **Interaction**: drag to rotate, pinch to zoom, tap a muscle to see exercises for it.
- **Performance**: low-poly mesh (< 30k triangles), compressed textures, lazy-loaded, and a 2D SVG body as fallback on low-end devices.

### 4.4 Barcode food tracking
Scan → look up (local cache first, then Open Food Facts) → product card with an animated macro breakdown → pick serving size or grams → add to Breakfast/Lunch/Dinner/Snacks.
Also: manual entry, recent and favourite foods, quick-add calories, and copy yesterday's meals.

- **Search by name**: text search through Open Food Facts (debounced and cached, because search has tighter rate limits than barcode lookups), with the user's own recent and custom foods shown first.
- **Custom foods, saved meals and recipes**: build a recipe from ingredients, set the number of servings, and log one serving in a tap.
- **Water tracking**: tap to add a glass or bottle against a daily target (default from body weight), with an animated fill and an optional reminder. Synced to Health where supported.

### 4.5 Workout tracker
1. **Start Workout** (from today's plan or empty) starts the session timer.
2. Tap an exercise to see its image and instructions, then log sets (weight × reps, with the previous session's numbers pre-filled).
3. **Complete set** auto-starts the **rest countdown** (default chosen by goal: 60 to 90 s for hypertrophy, 2 to 3 min for strength, editable with ±15 s buttons).
4. When the countdown ends, the **phone vibrates** with a haptic pattern and a sound. If the app is in the background, a **scheduled local notification** fires at the exact end time. This is needed because JS timers pause in the background, so the countdown is calculated from a stored end timestamp, not a ticking counter.
5. Finish the workout to see a summary (duration, volume, PRs) with a celebration animation. Calories burned and the workout are written back to Health.

Also in the tracker:
- **Lock-screen rest timer**: an iPhone Live Activity (lock screen and Dynamic Island) and an ongoing Android notification that shows the countdown, so the app doesn't need to stay open.
- **Exercise history and PRs**: every past set for an exercise, best weight, best reps and estimated 1RM, with a PR badge when one is beaten.
- **Warm-up sets** (generated from the working weight and not counted in volume), **supersets and circuits** (grouped exercises that share one rest timer), and a **plate calculator** that shows which plates to load for a target weight and bar.
- **Custom exercises** (name, muscles, equipment, optional photo) and a **plan editor** to copy a built-in plan and change its days, exercises, sets, reps and rest.

### 4.6 Health sync and step automation
- Read: steps, active energy, weight, heart rate, sleep (optional). Write: workouts, weight, nutrition (where allowed).
- **Step nudges** (local, smart):
  - Mid-afternoon check: "You're at 3,200 of 8,000 steps, a 20-minute walk gets you there."
  - Evening: celebrate if the goal was hit, or show what's left.
  - Quiet hours are respected, and nudges stop for the day once the goal is reached.
- On Android this runs through background fetch (`expo-background-task`). On iOS, background execution is limited, so nudges are scheduled ahead of time and their text is updated whenever the app opens.

### 4.7 Weigh-in reminders
- The user picks a frequency (daily / 3× a week / weekly) and a time. The default is weekly, morning, before eating.
- A notification opens a quick weigh-in sheet. The value is saved locally and to Health.
- The trend uses a 7-day moving average so daily swings don't discourage people.

### 4.8 Advice engine ("Coach")
v1 is a **rules engine that runs on the device** (free, private, works offline). It looks at weight trend vs goal rate, calorie and protein adherence, training frequency, volume per muscle, and steps. Example rules:
- Losing faster than 1% of body weight a week: raise calories by 150 to 200 and keep protein high.
- Weight flat for 2+ weeks on a cut with good adherence: drop 150 kcal or add 2,000 steps a day.
- Protein under target 4 of the last 7 days: suggest high-protein foods from their own history.
- A muscle group trained less than 10 sets a week (advanced mode): suggest an accessory exercise.
- Same weight × reps for 3 sessions: suggest a deload or a rep-range change.

Advice shows as cards on Home and as an optional weekly summary notification. Simple mode gets one clear action; advanced mode gets the reasoning and the numbers.
*Later option*: an AI coach chat built on an LLM API. This costs money per request, so it would be an optional, paid feature.

### 4.9 Animation plan
- Shared-element transitions from an exercise card to its detail screen (Reanimated layout animations).
- Animated macro rings and progress bars (Skia).
- A rest countdown ring that pulses in its last 5 seconds.
- An animated tab bar, and a cross-fade when switching modes.
- 3D body: idle breathing motion, smooth morphing when stats change, and a glow pulse on highlighted muscles.
- Lottie confetti for PRs and goals hit.
- Respect the system "Reduce Motion" setting.

### 4.10 Extra features
- **Body measurements and progress photos**: waist, chest, arms, thighs, hips and neck on the weigh-in schedule. Photos stay on the device by default, with a side-by-side or slider before-and-after view.
- **Units and appearance**: kg/lb, cm/in and kcal/kJ chosen at onboarding and changeable later, with light, dark or system theme.
- **Data export and backup**: export everything to CSV/JSON, and back up and restore through iCloud Drive or Google Drive. This later moves to account sync.
- **Streaks and achievements**: workout and logging streaks (with a rest-day allowance so a planned day off doesn't break them), plus badges for milestones like a first PR, 10 workouts or 30 days logged.
- **Home screen widgets**: calories left and today's workout. iOS widgets are built with WidgetKit through a config plugin, and Android widgets use react-native-android-widget.
- **Watch apps**: an Apple Watch app (SwiftUI) and a Wear OS app to log sets and run the rest timer from the wrist, syncing with the phone. This is native code outside React Native, so it comes last.
- **Social sharing**: share a workout summary or PR as an image card. Friends and feeds come later with accounts.

## 5. Data model (local SQLite)
`user_profile` (including units and theme), `goals`, `body_metrics` (weight, body fat, measurements, date), `progress_photos`, `foods` (cache from OFF + custom), `recipes`, `recipe_items`, `food_logs`, `water_logs`, `exercises` (seeded from free-exercise-db + custom), `plan_templates`, `user_plans` (editable copies), `workout_sessions`, `workout_sets` (with warm-up flag and superset group), `personal_records`, `reminders`, `advice_log`, `achievements`.

## 6. Phases

| Phase | Scope | Done when |
|---|---|---|
| **0. Setup** | Expo + TypeScript repo, Expo Router, ESLint/Prettier, EAS dev builds for iOS and Android, CI (typecheck, lint, tests), design tokens, mode context | App runs on both platforms from a dev build |
| **1. Onboarding and profile** | Onboarding flow, BMR/TDEE/macro maths with unit tests, SQLite schema, Simple/Advanced toggle, units (kg/lb, cm/in) and theme choice | A new user gets calorie and macro targets |
| **2. Workout tracker** | Bundle the exercise DB, exercise browser with search and filters, plan templates, Start Workout, set logging, rest countdown + haptics + background notification, lock-screen timer (Live Activity / Android notification), exercise history and PRs, warm-up sets, supersets, plate calculator, custom exercises, plan editor, session summary | A full workout can be logged and the rest timer vibrates even when the phone is locked |
| **3. Nutrition** | Barcode scanner, search by name, OFF client with caching and rate-limit handling, food log and diary, custom foods, saved meals and recipes, water tracking, Simple tabs vs Advanced dashboard | Scanning a real product logs its macros |
| **4. 3D body** | Model pipeline (MakeHuman → Blender → glTF), R3F scene, stats-to-morph mapping, goal ghost, muscle highlight + weekly heatmap, 2D fallback | The body reflects onboarding stats and lights up muscles per exercise |
| **5. Health, progress and reminders** | HealthKit + Health Connect read/write, pedometer fallback, step nudges, weigh-in reminders, body measurements, progress photos with before/after view, notification settings | Steps show from Health and reminders fire on schedule |
| **6. Coach** | Rules engine, advice cards, weekly summary | Advice changes sensibly with seeded test data |
| **7. Engagement and data** | Streaks and achievements, home screen widgets, data export and backup, share cards for workouts and PRs | Widgets update after logging; an export can be restored on a new phone |
| **8. Polish** | Animation pass, accessibility, Reduce Motion, empty and error states, performance on low-end Android, app store assets | Ready for TestFlight / Play internal testing |
| **9. Watch apps** | Apple Watch and Wear OS apps for logging sets and running the rest timer | A workout can be logged from the watch |
| **10. Later** | Supabase accounts and sync, friends and feeds, AI coach | — |

Phases 2 and 3 can run in parallel; phase 4 can start alongside phase 2 because the model pipeline is separate work.

## 7. Risks and open questions
- **3D model quality** is the biggest unknown. A convincing, customisable body needs real 3D asset work in Blender. Fallback: a stylised body or the 2D muscle map.
- **Expo Go won't work** because the HealthKit, Health Connect and 3D modules need native code. We use EAS development builds instead. iOS builds need an Apple Developer account ($99/year); Play Console is a one-off $25.
- **Open Food Facts coverage** varies by country. Manual entry is a must.
- **Health/fitness advice**: keep the advice general and add a "not medical advice" disclaimer. Calorie floors (for example never below ~1,200 to 1,500 kcal) are built into the rules.
- **Background limits on iOS** restrict how "live" step nudges can be (see 4.6).

## 8. Next step
The code lives in `gymApp/` in the React-auth0 repo. Phase 0 is in review; Phase 1 starts once it's merged.

Not planned: food logging from photos with AI (left out at Kyle's request).
