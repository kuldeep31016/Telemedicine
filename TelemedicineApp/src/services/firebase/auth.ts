import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
}

export const authService = {
  // Sign up with email/password
  signUp: async (email: string, password: string, name: string, phone: string) => {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    
    // Store additional data in Firestore
    await firestore().collection('users').doc(userCredential.user.uid).set({
      name,
      email,
      phone,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return userCredential.user;
  },

  // Sign in with email/password
  signIn: async (email: string, password: string) => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  },

  // Sign out
  signOut: async () => {
    await auth().signOut();
  },

  // Get current user
  getCurrentUser: (): FirebaseAuthTypes.User | null => {
    return auth().currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: FirebaseAuthTypes.User | null) => void) => {
    return auth().onAuthStateChanged(callback);
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string) => {
    const doc = await firestore().collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  },
};
