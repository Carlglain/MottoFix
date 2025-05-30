# 🚗 Car Fault Diagnostic Mobile App

A cross-platform mobile app built with **React Native (Expo)** to diagnose car issues using dashboard light scanning, engine sound analysis, and repair tutorials.

## 📁 Project Structure
Motto-Fix/
├── assets/ # Static files (images, fonts, icons)
│ ├── images/ # App visuals (logos, UI graphics)
│ └── fonts/ # Custom fonts (if any)
│
├── components/ # Reusable UI components
│ ├── buttons/ # Custom buttons (PrimaryButton.tsx)
│ ├── cards/ # Diagnostic cards (FaultCard.tsx)
│ └── ... # Other shared components
│
├── screens/ # App screens (1 file per screen)
│ ├── auth/ # Auth-related screens
│ │ ├── LoginScreen.tsx # User login
│ │ └── SignupScreen.tsx # User registration
│ │
│ ├── diagnostic/ # Diagnostic flows
│ │ ├── DashboardScan.tsx # Dashboard light scanner
│ │ └── EngineSound.tsx # Engine sound analyzer
│ │
│ └── ... # Other screens (Home, History, etc.)
│
├── navigation/ # App routing
│ ├── AppNavigator.tsx # Main stack navigator
│ └── BottomTabs.tsx # Tab navigator (if needed)
│
├── services/ # APIs and external services
│ ├── auth.ts # Firebase/auth functions
│ ├── diagnosticAPI.ts # Mock/real diagnostic API calls
│ └── youtubeService.ts # Fetch repair tutorials
│
├── utils/ # Helpers and utilities
│ ├── constants.ts # App-wide constants (colors, API keys)
│ ├── formatters.ts # Data formatting functions
│ └── hooks/ # Custom React hooks
│
├── types/ # TypeScript interfaces
│ ├── User.ts # User data model
│ └── Diagnostic.ts # Fault code interfaces
│
├── App.tsx # Root component
├── app.json # Expo configuration
└── package.json # Dependencies

---

## 🛠️ Setup Instructions

### 1. **Prerequisites**
- Node.js v18+ ([Download](https://nodejs.org/))
- npm or yarn
- Expo Go app (for testing on physical devices)

### 2. **Install Dependencies**
```bash
npm install
# or
yarn install
```
### 3. **Run the App**
Android:
```bash
npx expo start --android
```
iOS:
```bash
npx expo start --ios
```
🔧 Key Libraries Used
Library	Purpose
expo	Cross-platform development
react-navigation	Screen navigation
firebase	Authentication & database
expo-camera	Dashboard light scanning
expo-av	Engine sound recording
react-native-maps	Mechanic location finder
🌟 Features
Dashboard Light Scanner: Use phone camera to detect warning lights.

Engine Sound Analysis: Record and classify engine noises via ML.

Multilingual Support: English/French/local languages.

Offline Mode: Cache tutorials and diagnostic history.

🤝 How to Contribute
- Clone the repo:
Scan the QR code with the Expo Go app (Android/iOS) or open in a browser for web.
```bash
git clone https://github.com/Atangwa/CEF440-project-Grp21.git
```
Create a feature branch:

```bash
git checkout -b feature/your-feature
```
Commit changes:

```bash
git commit -m "Add: [Your feature]"
```
Push to GitHub:

```bash
git push origin feature/your-feature
```
📄 License
MIT © [Group 21]

