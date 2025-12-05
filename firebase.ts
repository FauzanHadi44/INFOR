import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeAuth,
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  DocumentData,
  CollectionReference
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1fYBB5YeDJAG0n0YXuCyI2hIfgkyGmmQ", 
  authDomain: "chatapp-2761b.firebaseapp.com",      
  projectId: "chatapp-2761b",                       
  storageBucket: "chatapp-2761b.firebasestorage.app", 
  messagingSenderId: "48535733408",              
  appId: "1:48535733408:ios:e7c478d262ab0ab7f1b5c5" 
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  const { getReactNativePersistence } = require("firebase/auth");
  
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

const firebaseConfigured = firebaseConfig.apiKey !== "ISI_DENGAN_API_KEY_ANDA";

export {
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  ref,
  uploadBytes,
  getDownloadURL,
  firebaseConfigured,
  firebaseConfig
};
export type { User, DocumentData, CollectionReference };
