const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAvAOyYvP1ZDh3GO72Ts4rnshUuBJR1kk8",
  authDomain: "cfig-guinee.firebaseapp.com",
  projectId: "cfig-guinee",
  storageBucket: "cfig-guinee.firebasestorage.app",
  messagingSenderId: "106387285538",
  appId: "1:106387285538:web:021c1ec87c76cd707e8c7b",
  measurementId: "G-C73DNEJ8MM"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function run() {
  try {
    console.log("Fetching students from Firestore...");
    const snapshot = await getDocs(collection(firestore, "students"));
    console.log("Total student documents found:", snapshot.size);
    snapshot.forEach((d) => {
      console.log(`Document ID: ${d.id}`, d.data());
    });
  } catch (err) {
    console.error("Error running query:", err);
  }
}

run();
