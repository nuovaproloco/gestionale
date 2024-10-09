import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvT9m0LLW4LTTA9L2Rt11L4i1vW7zgKPk",
  authDomain: "gestionale-134b4.firebaseapp.com",
  projectId: "gestionale-134b4",
  storageBucket: "gestionale-134b4.appspot.com",
  messagingSenderId: "420292103516",
  appId: "1:420292103516:web:c17c51fad62e5ed7ad4599",
};

export const FirebaseApp = initializeApp(firebaseConfig);

export const FireStoreDb = getFirestore(FirebaseApp);
