import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// these come from the firebase console (project settings -> your apps ->
// ArbeitRN). just swap each placeholder with the real value from the snippet
const firebaseConfig = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'PASTE_PROJECT_ID.firebaseapp.com',
  projectId: 'PASTE_PROJECT_ID',
  storageBucket: 'PASTE_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'PASTE_SENDER_ID',
  appId: 'PASTE_APP_ID',
};

// start firebase once for the whole app and export the firestore db so the
// tasks provider can read/write with it
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
