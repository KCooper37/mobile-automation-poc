# Mobile Automation Architecture POC

This repository serves as a comprehensive Proof of Concept (POC) demonstrating how a single backend API can power multiple frontend clients (React Native, Flutter) and be validated by three of the industry's leading mobile test automation frameworks: **WebdriverIO (Appium)**, **Detox**, and **Maestro**.

## 🏗️ Architecture Overview

The workspace is organized as a monorepo consisting of:
- **`apps/api`**: A mock Node.js/Express backend storing cart/order state in memory.
- **`apps/mobile`**: The React Native frontend (Awesome Shop).
- **`apps/flutter-mobile`**: The Flutter frontend twin (coming soon).
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

This repo is structured to demonstrate three paradigms of mobile testing. All suites perform advanced **State Injection** via HTTP API seeding before driving the UI.

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
* **Why this matters**: Maestro can extract strings from the UI (like our dynamic `ORD-XXXXXX` IDs) and push them back into input fields seamlessly. Because it's black box, the exact same `.yaml` scripts can test both the React Native and Flutter binaries without modification!

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
  detox test -c android.emu.debug
  ```

### Option 3: WebdriverIO / Appium (The Legacy Enterprise Standard)
Appium provides the most robust cross-platform capability but requires heavy SDK configuration.

* **Setup**: Requires Java, Android SDK, and a running Appium Server with the `uiautomator2` driver.
* **How to run**:
  ```bash
  cd apps/e2e-wdio
  npm install
  npm run wdio
  ```

---

## ♿ Accessibility (A11y) Auditing

While Maestro inherently tests accessibility by tapping semantic labels, deep auditing is best handled via Appium.
By installing `@axe-core/appium` inside the WebdriverIO suite, you can scan the view hierarchy for WCAG violations (contrast, touch targets) during runtime.

---

## 👁️ Visual Regression Testing (VRT)

To ensure pixel-perfect rendering across different screen sizes and OS versions, this POC integrates **Applitools Eyes**.
Applitools uses Visual AI to detect visual bugs rather than relying solely on DOM/view hierarchy matching.

* **Architecture**: The VRT implementation is housed within the WebdriverIO suite (`apps/e2e-wdio/test/specs/vrt.spec.js`).
* **Execution**: It utilizes the `@applitools/eyes-webdriverio` SDK alongside the `VisualGridRunner`.
* **Cross-Environment**: The configuration allows for simulating how the app looks across multiple mock devices (e.g., iPhone 11 vs Pixel 5) simultaneously via the Applitools Ultrafast Grid.

*Note: For the purpose of this portfolio piece, the execution code exists to demonstrate architectural knowledge but skips actual cloud execution unless a valid `APPLITOOLS_API_KEY` is provided in the environment.*

---

## ⚡ Performance Testing (Flashlight / BAM)
While E2E tests ensure functional correctness, mobile apps require strict performance auditing (60FPS rendering, minimal JS thread locks).
In the React Native ecosystem, we recommend **Flashlight.dev**. It measures performance across E2E flows to ensure no new feature introduces dropped frames or heavy CPU spikes.
* **Usage Example:** `flashlight measure --bundleId com.anonymous.mobile --duration 10000`

---

## 🤖 CI/CD Integration
This repository includes fully configured **GitHub Actions** pipelines (`.github/workflows/maestro-ci.yml` and `detox-ci.yml`). 

*Note: These pipelines are currently configured to run manually via `workflow_dispatch` rather than on every push. Running headless Android Emulators alongside the React Native Metro Bundler on GitHub's free-tier runners often hits CPU/Memory limits, leading to flakiness and bridge timeouts. For a POC, executing these suites locally is the recommended way to verify the architecture.*

The pipelines are configured to:
1. Boot the Express API backend.
2. Compile the React Native application into a physical `.apk`.
3. Start the Metro Bundler.
4. Spin up a headless Android Emulator via `reactivecircus/android-emulator-runner`.
5. Execute the test suites against the built APK.

---

*This POC proves that a unified QA strategy—blending API state seeding with declarative UI interaction—can seamlessly scale across any mobile tech stack.*
