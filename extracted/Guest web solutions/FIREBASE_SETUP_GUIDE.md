# Guest Web Solutions - Firebase Setup Guide
## Complete Step-by-Step Instructions

---

## STEP 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Create a project"**
3. Enter project name: `guest-web-solutions`
4. Disable Google Analytics (optional) -> Click **"Create project"**
5. Wait for project creation -> Click **"Continue"**

---

## STEP 2: Register Your Web App

1. On the Firebase Console homepage, click the **</>** (Web) icon
2. App nickname: `Guest Web Solutions Website`
3. Check **"Also set up Firebase Hosting for this app"** (optional)
4. Click **"Register app"**
5. You will see a block of code like this - **COPY these values**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "guest-web-solutions.firebaseapp.com",
  projectId: "guest-web-solutions",
  storageBucket: "guest-web-solutions.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## STEP 3: Enable Firebase Authentication

1. In the left sidebar, click **"Build"** -> **"Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable these providers:

### Email/Password:
- Click **"Email/Password"**
- Toggle **"Enable"** to ON
- Click **"Save"**

### Google Sign-In:
- Click **"Google"**
- Toggle **"Enable"** to ON
- Set **Support email** (your email)
- Click **"Save"**

---

## STEP 4: Create Firestore Database

1. In the left sidebar, click **"Build"** -> **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** -> Click **"Next"**
4. Choose your region (e.g., `asia-south1` for India) -> Click **"Enable"**

### Update Security Rules (IMPORTANT):
1. Go to Firestore Database -> **"Rules"** tab
2. Replace ALL the rules with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactSubmissions/{id} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email']);
      allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /users/{uid} {
      allow read, create, update: if request.auth != null && request.auth.uid == uid;
    }
    match /payments/{id} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

3. Click **"Publish"**

---

## STEP 5: Set Environment Variables

1. In your project folder, find the file `.env.example`
2. Copy it to a new file named `.env`:

```bash
cp .env.example .env
```

3. Open `.env` and fill in your Firebase config values from Step 2:

```env
VITE_FIREBASE_API_KEY=AIzaSxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=guest-web-solutions.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=guest-web-solutions
VITE_FIREBASE_STORAGE_BUCKET=guest-web-solutions.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## STEP 6: Set Admin User

After the website is live, you need to make yourself an admin:

### Method A: Via Firebase Console (Manual)

1. First, open your website and **Sign Up** with:
   - Name: `Jafar pulikkalakath`
   - Email: `jpulikkalakath@gmail.com`
   - Password: (any password you want)

2. Go to Firebase Console -> **Firestore Database**
3. Click **"users"** collection
4. Find your user document (it will have your UID)
5. Click the document to edit
6. Change the `role` field from `"user"` to `"admin"`
7. Click **"Save"**

### Method B: Via Firebase Console (Direct)

1. Go to Firebase Console -> **Authentication**
2. Click **"Add user"**
3. Email: `jpulikkalakath@gmail.com`
4. Password: `tZ_nmxYMR1T_c!q`
5. Click **"Add user"**
6. Go to Firestore Database -> **"users"** collection
7. Create a new document with the **UID from the user you just created**
8. Add these fields:
   - `name` (string): `Jafar pulikkalakath`
   - `email` (string): `jpulikkalakath@gmail.com`
   - `role` (string): `admin`
   - `createdAt` (string): `2026-05-19`

---

## STEP 7: Build the Website

Run these commands in your project folder:

```bash
cd /path/to/your/project
npm install
npm run build
```

This will create a `dist/` folder with the production build.

---

## STEP 8: Deploy to Firebase Hosting

### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Login to Firebase:
```bash
firebase login
```
(This will open a browser for you to sign in)

### Initialize Firebase Hosting:
```bash
firebase init hosting
```

When asked:
- **"Are you ready to proceed?"** -> Yes
- **"Which Firebase project?"** -> Select your project (`guest-web-solutions`)
- **"What do you want to use as your public directory?"** -> `dist`
- **"Configure as a single-page app?"** -> Yes
- **"Set up automatic builds and deploys?"** -> No

### Deploy:
```bash
firebase deploy --only hosting
```

After deployment, you will get a URL like:
```
https://guest-web-solutions.web.app
```

---

## STEP 9: Verify Everything Works

1. **Open your website** (the Firebase Hosting URL)
2. **Test Sign Up**: Go to /signup, create an account
3. **Test Login**: Go to /login, sign in
4. **Test Google Sign-In**: Click the Google button
5. **Test Contact Form**: Fill and submit - check Firestore for the data
6. **Test Admin Dashboard**: After setting admin role, visit /admin
7. **Test Payment Flow**: Sign in, go to Pricing, click "Get Started"

---

## STEP 10: (Optional) Custom Domain

If you want to use your own domain:

1. Firebase Console -> **Hosting**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `guestwebsolutions.com`)
4. Follow the DNS verification steps

---

## Quick Reference: Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Open Firebase Console
firebase open hosting
```

---

## Troubleshooting

### Issue: "Firebase API key not valid"
- Make sure your `.env` file has the correct API key from Firebase Console
- Restart the dev server after changing `.env`

### Issue: "Permission denied" when submitting contact form
- Check Firestore Rules are published correctly
- Make sure rules allow `create` for `contactSubmissions`

### Issue: Admin dashboard not accessible
- Check that the user document in Firestore has `role: "admin"`
- Make sure you're logged in as that user
- Refresh the page after changing the role

### Issue: Google Sign-In not working
- Go to Firebase Console -> Authentication -> Sign-in method
- Make sure Google provider is enabled
- Check that your domain is authorized in Google Cloud Console

### Issue: Deep links (GPay/PhonePe/Paytm) not opening
- This is normal on desktop browsers - they only work on mobile devices
- On mobile, the UPI app should open automatically
- If not, use the UPI ID fallback: `jafarpulikkalakath@ybl`

---

## File Structure (After Firebase Migration)

```
guest-web-solutions/
├── dist/                        # Production build (auto-generated)
├── public/
│   └── assets/                  # Images and logo
├── src/
│   ├── lib/
│   │   └── firebase.ts          # Firebase config
│   ├── hooks/
│   │   ├── useAuth.ts           # Firebase Auth hook
│   │   └── useFirestore.ts      # Firestore CRUD hook
│   ├── pages/
│   │   ├── HomePage.tsx         # Main landing page
│   │   ├── Login.tsx            # Sign in page
│   │   ├── SignUp.tsx           # Sign up page
│   │   ├── ForgotPassword.tsx   # Password reset page
│   │   └── AdminDashboard.tsx   # Admin panel
│   ├── sections/                # All website sections
│   ├── components/              # Reusable components
│   ├── App.tsx                  # Routes
│   └── main.tsx                 # Entry point
├── firebase.json                # Firebase hosting config
├── firestore.rules              # Firestore security rules
├── .env.example                 # Environment variables template
└── package.json
```

---

## Support

If you get stuck at any step:
1. Check the browser console (F12) for error messages
2. Verify your Firebase config values are correct
3. Make sure Firestore rules are published
4. Check that the user has `role: "admin"` in Firestore

---

**Good luck with your Firebase setup!**
