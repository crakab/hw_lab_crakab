import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// these come from the firebase console (project settings -> your apps ->
// ArbeitRN)
const firebaseConfig = {
  apiKey: 'AIzaSyDvooaNWRxwQhLagyDcQJ_e_3wguMbK4_Y',
  authDomain: 'arbeit-67f6b.firebaseapp.com',
  projectId: 'arbeit-67f6b',
  storageBucket: 'arbeit-67f6b.firebasestorage.app',
  messagingSenderId: '567708063555',
  appId: '1:567708063555:web:e62e9a5eff3771476701f6',
};

// start firebase once for the whole app and export the firestore db so the
// tasks provider can read/write with it
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
