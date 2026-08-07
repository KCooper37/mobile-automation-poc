# Mobile Automation POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cross-platform React Native (Expo) store application with an Express backend, and implement end-to-end automation test coverage using Appium (WDIO) and Maestro.

**Architecture:** We will use a monorepo structure. The Express API will serve mock products and handle checkout submissions. The mobile app will be built in Expo (React Native) with deterministic accessibility IDs. Tests will live in dedicated framework folders.

**Architecture Diagram:**

```mermaid
graph TD
    subgraph "Mobile Automation POC"
        A[Mobile App (Expo)] --> B[Express API]
        C[Appium/WDIO Tests] -->|Appium Protocol| A
        D[Maestro Tests] -->|Native Queries| A
    end
```

**Tech Stack:** React Native (Expo), Express, Appium, WebdriverIO, Maestro.

## Global Constraints

- Backend must listen on port `3001` or similar to avoid conflict with standard React Native Metro bundler (port 8081).
- All interactive React Native components (Buttons, Inputs) MUST have `testID` props to support robust UI testing.
- Git commits must follow the conventional commits standard.

---

### Task 1: Express API Setup

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/index.js`
- Create: `apps/api/tests/api.test.js`

**Interfaces:**
- Consumes: None.
- Produces: `GET /api/products`, `POST /api/checkout`

- [ ] **Step 1: Write the failing API test**

```javascript
const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
    it('GET /api/products returns products list', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/api && npm test`
Expected: FAIL due to missing express app.

- [ ] **Step 3: Write minimal implementation**

```javascript
// apps/api/index.js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/products', (req, res) => {
    res.json([{ id: 1, name: 'Sample Item', price: 9.99 }]);
});

app.post('/api/checkout', (req, res) => {
    res.json({ success: true, message: 'Order received' });
});

module.exports = app;

if (require.main === module) {
    app.listen(3001, () => console.log('API listening on port 3001'));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "feat: implement mock express backend API"
```

### Task 2: Scaffold Expo Application

**Files:**
- Create: `apps/mobile/app.json` (via Expo CLI)
- Create: `apps/mobile/App.js`

**Interfaces:**
- Consumes: Nothing
- Produces: The base Expo React Native shell.

- [ ] **Step 1: Initialize the project**

Run: `npx create-expo-app apps/mobile --template blank`

- [ ] **Step 2: Add essential dependencies**

Run: `cd apps/mobile && npx expo install axios @react-navigation/native @react-navigation/native-stack`

- [ ] **Step 3: Start Metro to verify setup**

Run: `npx expo start` (verify it launches without error, then terminate).

- [ ] **Step 4: Commit**

```bash
git add apps/mobile
git commit -m "chore: scaffold empty expo mobile application"
```

### Task 3: Build Product List & Cart UI

**Files:**
- Create: `apps/mobile/src/screens/ProductList.js`
- Create: `apps/mobile/src/screens/Checkout.js`

**Interfaces:**
- Consumes: API endpoints from Task 1.

- [ ] **Step 1: Implement ProductList with accessibility IDs**

```javascript
// Example snippet
<Button 
  title="Add to Cart" 
  onPress={() => addToCart(item)} 
  testID={`add-to-cart-${item.id}`} 
/>
<Button 
  title="Go to Checkout" 
  onPress={() => navigation.navigate('Checkout')} 
  testID="checkout-btn" 
/>
```

- [ ] **Step 2: Implement Checkout form**

```javascript
<TextInput placeholder="Name" testID="checkout-name-input" />
<TextInput placeholder="Address" testID="checkout-address-input" />
<Button title="Submit Order" testID="submit-order-btn" />
<Text testID="success-message">{statusMessage}</Text>
```

- [ ] **Step 3: Connect API calls (Axios)**

Ensure Axios hits `http://10.0.2.2:3001/api/...` (standard Android Emulator alias for localhost).

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/src
git commit -m "feat: implement product list and checkout UI flows"
```

### Task 4: WebDriverIO & Appium Configuration

**Files:**
- Create: `frameworks/appium/package.json`
- Create: `frameworks/appium/wdio.conf.ts`
- Create: `frameworks/appium/test/specs/checkout.e2e.ts`

- [ ] **Step 1: Init WDIO**

Run: `cd frameworks/appium && npm init -y && npm install @wdio/cli`
Run: `npx wdio config` (Select Appium, Android environment, TypeScript).

- [ ] **Step 2: Write Checkout E2E Test**

```typescript
// checkout.e2e.ts
describe('Store App Checkout Flow', () => {
    it('should complete an order', async () => {
        // Appium accesses testID via ~ (accessibility id)
        const addToCartBtn = await $('~add-to-cart-1');
        await addToCartBtn.click();

        const checkoutBtn = await $('~checkout-btn');
        await checkoutBtn.click();

        const nameInput = await $('~checkout-name-input');
        await nameInput.setValue('Test User');

        const submitBtn = await $('~submit-order-btn');
        await submitBtn.click();

        const successMsg = await $('~success-message');
        expect(await successMsg.getText()).toContain('Order received');
    });
});
```

- [ ] **Step 3: Commit**

```bash
git add frameworks/appium
git commit -m "test: add wdio appium framework and e2e spec"
```

### Task 5: Maestro Configuration

**Files:**
- Create: `frameworks/maestro/checkout-flow.yaml`

- [ ] **Step 1: Write the Maestro Flow**

```yaml
appId: com.mobile.store
---
- launchApp
- tapOn: "Add to Cart"
- tapOn: "Go to Checkout"
- tapOn: "Name"
- inputText: "Test User"
- tapOn: "Address"
- inputText: "123 Test St"
- tapOn: "Submit Order"
- assertVisible: "Order received"
```

- [ ] **Step 2: Commit**

```bash
git add frameworks/maestro
git commit -m "test: add maestro checkout flow"
```
