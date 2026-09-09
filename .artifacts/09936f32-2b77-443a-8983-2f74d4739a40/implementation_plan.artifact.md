# Create Debug APK for Mausam

This plan outlines the steps to build a debug APK for the Capacitor-based Android project.

## Proposed Changes

No source code changes are required. The process involves running build commands to generate the web assets and then the Android APK.

### Build Process

1. **Build Web Assets**: Run `npm run build` to compile the React application into the `dist` directory.
2. **Sync Capacitor**: Run `npx cap sync android` to copy the `dist` contents and update Android project dependencies.
3. **Assemble APK**: Run `./gradlew assembleDebug` inside the `android` directory to generate the debug APK.

## Verification Plan

### Automated Steps
- I will verify that `dist/index.html` exists after the web build.
- I will verify that `android/app/build/outputs/apk/debug/app-debug.apk` is generated after the Gradle build.

### Manual Verification
- The user can locate the APK in the project directory and install it on a device or emulator.
