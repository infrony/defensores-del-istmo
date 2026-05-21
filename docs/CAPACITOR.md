# Capacitor Mobile Build Guide

Defensores del Istmo uses [Capacitor 6](https://capacitorjs.com/) to wrap the Phaser 3 / Vite web build into a native Android (and optionally iOS) app.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node / pnpm | ≥ 18 / any | Already required by the project |
| JDK | 17+ | `java -version` must show 17+ |
| Android Studio | Hedgehog or newer | Includes SDK, emulator, and signing tools |
| Android SDK | API 34+ | Install via Android Studio SDK Manager |

> **JDK tip:** Android Studio bundles its own JDK. Point `JAVA_HOME` to it if the standalone JDK causes conflicts:
> `JAVA_HOME=C:\Program Files\Android\Android Studio\jbr`

## First-time setup

Run once after cloning the repo (requires Android Studio to be installed):

```bash
pnpm install          # install Capacitor packages
npx cap add android   # scaffold the android/ native project
```

This creates the `android/` directory. Commit it to source control.

## Daily build flow

```bash
pnpm cap:build    # 1. tsc check + vite build → dist/  2. cap sync android
pnpm cap:open     # open Android Studio with the android/ project
```

Inside Android Studio:
- **Run** (▶) to launch on an emulator or connected device.
- **Build > Generate Signed Bundle / APK** to produce a release APK or AAB.

## What each script does

| Script | Equivalent commands |
|--------|---------------------|
| `pnpm cap:build` | `pnpm build && npx cap sync android` |
| `pnpm cap:open` | `npx cap open android` |

`cap sync` copies `dist/` into the native WebView assets and applies any Capacitor plugin changes.

## Signing for release

Signing is done inside Android Studio:

1. **Build > Generate Signed Bundle / APK**
2. Create or select a keystore (`.jks` / `.keystore`).
3. Choose **APK** for sideloading or **Android App Bundle (AAB)** for Play Store.
4. Select the `release` build variant.

Store the keystore and its passwords securely — losing the keystore means you cannot update the Play Store listing.

## iOS (optional)

iOS builds require a Mac with Xcode 15+.

```bash
npx cap add ios       # scaffold the ios/ native project (run once)
pnpm build && npx cap sync ios
npx cap open ios      # open Xcode
```

In Xcode, select your team under **Signing & Capabilities** and press **Run** or archive for TestFlight / App Store.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| White screen in WebView | Confirm `vite.config.ts` has `base: './'` — already set. |
| `cap sync` can't find Android SDK | Set `ANDROID_HOME` env var to your SDK path. |
| Mixed-content errors | `androidScheme: 'https'` is already set in `capacitor.config.ts`. |
| Outdated assets after `pnpm build` | Run `npx cap sync android` again (or use `pnpm cap:build`). |
