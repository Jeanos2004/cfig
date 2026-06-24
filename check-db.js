require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const querySnapshot = await getDocs(collection(db, "formations"));
  let formations = [];
  querySnapshot.forEach((doc) => {
    formations.push({ id: doc.id, ...doc.data() });
  });
  
  for (const cat of formations) {
    for (const mod of cat.modules || []) {
      if (mod.sessions && mod.sessions.length > 0) {
        console.log("Found session in:", mod.titre, mod.sessions);
      }
    }
  }
  console.log("Done checking db");
}

check();
