// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { getRedirectResult as firebaseGetRedirectResult } from 'firebase/auth';
import { getAdditionalUserInfo as firebaseGetAdditionalUserInfo } from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATUG0rgEf5txiUHUlqqxoys4j7Y5wJqao",
  authDomain: "crw-clothing-db-9abd5.firebaseapp.com",
  projectId: "crw-clothing-db-9abd5",
  storageBucket: "crw-clothing-db-9abd5.appspot.com",
  messagingSenderId: "11795878302",
  appId: "1:11795878302:web:5eec41ae0b11b33e91868f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account' 
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const onAuthStateChangedListener = (callback) => 
  onAuthStateChanged(auth, callback);
export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth, 
  additionalInformation = {}
) => {
  if(!userAuth) return;
  const userDocRef = doc(db, 'users', userAuth.uid);

  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot);
  console.log(userSnapshot.exists());

  // if user data does not exist in the database, create it

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    const finalDisplayName = displayName ?? additionalInformation.displayName;

    try {
      await setDoc(userDocRef, {
        displayName: finalDisplayName,
        email,
        createdAt,
        ...additionalInformation
      });
    } catch (error) {
      console.log('Error creating user', error.message);
    }
  }
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  try {
    if(!email || !password) {
      throw new Error('Email and password are required');
    }
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log('Error creating user', error.message);
    throw error;
  }
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  try {
    //if(!email || !password) {
    //  throw new Error('Email and password are required');
    //}
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log('Error signing in user', error.message);
    throw error;
  }
}

export const signOutUser = async () => {
  try {
    return await auth.signOut();
  } catch (error) {
    console.log('Error signing out user', error.message);
    throw error;
  }
}

export const getRedirectResult = async () => {
  try {
    console.log('Getting redirect result...');
    const result = await firebaseGetRedirectResult(auth);
    console.log('Redirect result:', result);
    const details = firebaseGetAdditionalUserInfo(result)
    console.log(details) // details.isNewUser to determine if a new or returning user
    return result;
  } catch (error) {
    console.error('Error getting redirect result:', error);
    throw error;
  }
};

// Combine redirect result check with auth state
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (userAuth) => {
        unsubscribe();
        try {
          const redirectResult = await firebaseGetRedirectResult(auth);
          resolve({ userAuth, redirectResult });
        } catch (error) {
          reject(error);
        }
      },
      reject
    );
  });
};