
# 🛒 BuyBasket - React Native E-Commerce App

BuyBasket is a cross-platform e-commerce mobile application built using React Native and Expo.It provides a complete shopping experience with user authentication, product browsing, cart management, and placed order details.

The app uses Firebase Authentication for secure login/signup and Firestore for real-time data handling, ensuring smooth synchronization across devices.
## Features

- User authentication (Email & Password via Firebase)
- Product listing with search functionality
- Shopping cart with real-time updates
- Order placement and order history
- Dark and Light mode support


## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bhara5t/buybasket.git
```

---

### 2. Open Project

* Open **VS Code** or your preferred editor
* Navigate to the cloned project folder
* Open terminal in the project root

---

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

### 4. Add Firebase Configuration

* Go to **Firebase Console**
* Create a new project
* Add a **Web App**
* Copy the Firebase configuration

Create a file `firebaseConfig.ts` in the root:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

### 5. Enable Firebase Services

* Authentication → Enable **Email/Password**
* Firestore Database → Create database (test mode)

---

### 6. Run the App

```bash
npx expo start
```

* Install **Expo Go** on your device
* Scan the QR code (Android → Expo Go, iOS → Camera)

---


---

### 🛒 Add Sample Products

#### Option 1: Manual (Firebase Console)

* Go to Firestore → Create collection: `products`

Add document fields:

```text
name: iPhone 15 Pro
price: 129900
description: Latest iPhone with A17 Pro chip
image: https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
```

---

#### Option 2: Bulk Import Script

```bash
cp scripts/addProducts.example.js scripts/addProducts.js
node scripts/addProducts.js
```

---

---

### 🔥 Firebase Notes

* Firestore rules must allow read/write (for testing)
* Cart & Orders are user-specific (linked via `userId`)
* Real-time updates handled using `onSnapshot`

---

## 📱 Build Requirements

* Node.js: 18+
* Expo SDK: 54.0.33
* React Native: 0.81.5
* React: 19.1.0
* Android: API 24+
* iOS: 13+
