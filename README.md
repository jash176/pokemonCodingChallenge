# Pokemon Trainer App

A React Native mobile application that allows users to browse Pokemon, view detailed information, create teams, and manage user accounts. This app uses the PokeAPI to fetch Pokemon data and provides a rich, interactive experience for Pokemon enthusiasts.

## Features

- **Authentication System**: User registration and login with email/password and Google Sign-In
- **Pokemon Browsing**: Browse through a list of Pokemon with infinite scrolling
- **Pokemon Details**: View detailed information about each Pokemon including:
  - Stats (HP, Attack, Defense, etc.)
  - Types
  - Abilities
  - Moves
  - Physical characteristics (height, weight)
- **Team Building**: Create your own Pokemon team (up to 6 Pokemon)
- **Team Management**: Add and remove Pokemon from your team
- **Push Notifications**: Receive notifications about Pokemon
- **User Settings**: Manage your account and preferences

## Tech Stack

- **Framework**: React Native (v0.78.2)
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query v5)
- **Authentication**: Firebase Authentication
- **Push Notifications**: Firebase Cloud Messaging & Notifee
- **Navigation**: React Navigation v7
- **Storage**: React Native MMKV
- **UI Components**: Custom components with React Native's core components
- **Testing**: Jest with React Native Testing Library

## Project Structure

```
src/
├── api/            # API clients and data fetching utilities
├── assets/         # Static assets like icons
├── components/     # Reusable UI components
├── contexts/       # React Context providers (auth, team)
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # App screens
├── services/       # Background services (notifications)
└── utils/          # Utility functions and helpers
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- React Native development environment set up
- For iOS: macOS with Xcode installed
- For Android: Android Studio with SDK tools

### Installation

1. Clone the repository

```sh
git clone <repository-url>
cd pokemonCodingChallenge
```

2. Install dependencies

```sh
npm install
# or
yarn install
```

3. For iOS, install CocoaPods dependencies

```sh
cd ios && pod install
```

### Running the App

#### Start Metro server

```sh
npm start
# or
yarn start
```

#### Run on Android

```sh
npm run android
# or
yarn android
```

#### Run on iOS

```sh
npm run ios
# or
yarn ios
```

## Testing

Run the test suite with:

```sh
npm test
# or
yarn test
```
