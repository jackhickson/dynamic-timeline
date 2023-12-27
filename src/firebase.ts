import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './firebaseConfig'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);

export const db = getFirestore(app);