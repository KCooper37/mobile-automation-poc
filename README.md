# Mobile Automation Architecture POC

This repository is a starter/demo for mobile QA automation. A small Express API powers a React Native shopping app, with example suites in **WebdriverIO (Appium)**, **Detox**, and **Maestro**. A Flutter client is also included as a separate prototype.

## 🏗️ Architecture Overview

The workspace is organized as a monorepo consisting of:
- **`apps/api`**: A mock Node.js/Express backend storing cart/order state in memory.
- **`apps/mobile`**: The React Native frontend (Awesome Shop).
- **`apps/flutter_mobile`**: Flutter client prototype; the Android test instructions below target React Native.
- **`apps/e2e-wdio`**: The WebdriverIO (Appium) E2E suite.
- **`apps/e2e-detox`**: The Detox gray-box E2E suite.
- **`apps/e2e-maestro`**: The Maestro black-box E2E suite.

---

## 🚀 Quickstart

### 1. Start the API Backend (Required)
All mobile clients and test suites expect the Express API to be running on port `3005`.
```bash
cd apps/api
npm install
npm start
# Server runs on http://0.0.0.0:3005
```

Run the API tests from `apps/api` with `npm test`. They cover the checkout-to-order-lookup flow and invalid requests without an emulator.

### 2. Start the Mobile Client
Currently, the primary client is the React Native app.
```bash
cd apps/mobile
npm install
npx expo start
# Hit 'a' to open in the Android Emulator
```

---

## 🧪 E2E Automation Suites

These suites demonstrate three mobile automation styles. The checkout examples seed a cart through the API before driving the UI; other flows exercise login, saved carts, and order lookup.

### Option 1: Maestro (The Modern Black-Box Standard)
Maestro relies heavily on accessibility layers and structural validation, written completely in YAML.

* **Setup**: Install Maestro CLI (`curl -Ls "https://get.maestro.mobile.dev" | bash`)
* **How to run**:
  With the app running in the emulator:
  ```bash
  cd apps/e2e-maestro
  maestro test checkout-flow.yaml
  maestro test order-lookup-flow.yaml
  maestro test save-cart-flow.yaml
  ```
* **What it demonstrates**: YAML flows can read a generated order ID from the UI and use it in a later search. The current scripts target the React Native app ID and labels; reuse with Flutter would require verifying its identifiers and UI text.

### Option 2: Detox (The React Native Gray-Box Standard)
Detox integrates deeply with the React Native event loop to provide synchronized, flake-free testing.

* **Setup**: Detox requires the app to be fully compiled (prebuilt).
  ```bash
  # Inside apps/mobile
  npx expo prebuild
  # Inside apps/e2e-detox
  npm install
  ```
* **How to run**:
  ```bash
  cd apps/e2e-detox
  npx detox build -c android.emu.debug
  npx detox test -c android.emu.debug
  ```

### Option 3: WebdriverIO / Appium (The Legacy Enterprise Standard)
Appium provides the most robust cross-platform capability but requires heavy SDK configuration.

* **Setup**: Requires Java, Android SDK, an Android emulator, and the `uiautomator2` driver (`npx appium driver install uiautomator2` from `apps/e2e-wdio`). Build and install the React Native APK first; this configuration connects to the installed `com.mobileautomationpoc` app.
* **How to run**:
  ```bash
  cd apps/e2e-wdio
  npm install
  npm run wdio
  ```

---

## ♿ Accessibility (A11y) Auditing

The test suites use accessibility labels and IDs for mobile element lookup. A dedicated automated accessibility audit is a possible next example; it is not currently part of the passing test claims.

---

## 👁️ Visual Regression Testing (VRT)

To ensure pixel-perfect rendering across different screen sizes and OS versions, this POC integrates **Applitools Eyes**.
Applitools uses Visual AI to detect visual bugs rather than relying solely on DOM/view hierarchy matching.

* **Architecture**: The VRT implementation is housed within the WebdriverIO suite (`apps/e2e-wdio/test/specs/vrt.spec.js`).
* **Execution**: The optional example uses the `@applitools/eyes-webdriverio` SDK alongside the `VisualGridRunner`.
* **Cross-Environment**: The configuration allows for simulating how the app looks across multiple mock devices (e.g., iPhone 11 vs Pixel 5) simultaneously via the Applitools Ultrafast Grid.

*Note: For the purpose of this portfolio piece, the execution code exists to demonstrate architectural knowledge but skips actual cloud execution unless a valid `APPLITOOLS_API_KEY` is provided in the environment.*

---

## ⚡ Performance Testing (Flashlight / BAM)
While E2E tests ensure functional correctness, mobile apps require strict performance auditing (60FPS rendering, minimal JS thread locks).
In the React Native ecosystem, we recommend **Flashlight.dev**. It measures performance across E2E flows to ensure no new feature introduces dropped frames or heavy CPU spikes.
* **Usage Example:** `flashlight measure --bundleId com.mobileautomationpoc --duration 10000`

---

## 🤖 CI/CD Integration
This repository includes fully configured **GitHub Actions** pipelines (`.github/workflows/maestro-ci.yml` and `detox-ci.yml`). 

Both mobile workflows are manually triggered. The API tests can run locally without an emulator; WDIO is a local showcase and is not part of these workflows. See the [Actions history](https://github.com/KCooper37/mobile-automation-poc/actions) for recorded runs.

*Note: These pipelines are currently configured to run manually via `workflow_dispatch` rather than on every push. Running headless Android Emulators alongside the React Native Metro Bundler on GitHub's free-tier runners often hits CPU/Memory limits, leading to flakiness and bridge timeouts. For a POC, executing these suites locally is the recommended way to verify the architecture.*

The pipelines are configured to:
1. Boot the Express API backend.
2. Compile the React Native application into a physical `.apk`.
3. Start the Metro Bundler.
4. Spin up a headless Android Emulator via `reactivecircus/android-emulator-runner`.
5. Execute the test suites against the built APK.

---

The core example combines API state seeding with mobile UI assertions so test setup and user-visible behavior can be inspected separately.
