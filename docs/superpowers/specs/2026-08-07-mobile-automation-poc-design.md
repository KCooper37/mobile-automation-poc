# Mobile Automation POC Design Specification

## Overview
A comprehensive proof-of-concept (POC) demonstrating modern mobile test automation frameworks. This project compares **Appium (WebDriverIO)** and **Maestro** side-by-side against a containerized cross-platform mobile application (React Native / Expo) backed by a simple Express REST API.

## Repository Architecture
The repository uses a monorepo structure to treat test frameworks as first-class citizens, mirroring the web testing POC.

```text
mobile-automation/
├── apps/
│   ├── mobile/         # React Native (Expo) Store App
│   └── api/            # Express.js REST API Backend
└── frameworks/
    ├── appium/         # WebDriverIO + Appium Tests
    └── maestro/        # Maestro YAML Tests
```

## System Components

### 1. The Backend (Express API)
A lightweight JSON REST API providing data to the mobile app.
- **`GET /api/products`**: Returns an array of mock product objects (id, name, price, image URL, description).
- **`POST /api/checkout`**: Accepts a JSON payload containing the cart items and user shipping information. Returns a `200 OK` success confirmation.

### 2. The Mobile App (React Native / Expo)
A simple, functional eCommerce flow focusing on testability:
- **Product List Screen**: Displays the products fetched from the API.
- **Product Detail Screen**: Shows item details and provides an "Add to Cart" button.
- **Checkout Screen**: Displays cart summary and a form (Name, Address) to submit the order.
- **Testability**: All interactive elements will be instrumented with `testID` props (accessible via `accessibility_id` in Appium) to ensure deterministic test selectors.

### 3. Test Frameworks & Scenarios
Both frameworks will execute the identical core E2E scenario to demonstrate parity and contrast their respective developer experiences.

**Scenario: Happy Path Checkout**
1. Launch the application.
2. Verify the product list loads.
3. Tap on the first product.
4. Tap "Add to Cart".
5. Navigate to the Checkout Screen.
6. Fill out the shipping form.
7. Tap "Submit Order".
8. Assert that the Success confirmation message is displayed.

**Appium (WebDriverIO)**
- Programmatic, code-driven approach (TypeScript).
- Utilizes the Page Object Model (POM) pattern for maintainability.
- Interfaces via the standard WebDriver/Appium protocol.

**Maestro**
- Declarative, flow-driven approach (YAML).
- Focuses on simplicity and human-readable steps (e.g., `tapOn: "Add to Cart"`).
- Runs native queries directly against the UI tree.

## Future Scope / Exclusions
- iOS automation requires a macOS environment. The CI pipeline and primary local execution will target Android Emulators to ensure cross-platform compatibility on Linux/Windows hosts.
- Advanced performance testing (e.g., memory profiling) is excluded from this initial POC phase.
