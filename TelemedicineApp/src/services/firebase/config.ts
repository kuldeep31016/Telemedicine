import firebase, { FirebaseApp } from '@react-native-firebase/app';

// Firebase credentials from old app
const firebaseConfig = {
  apiKey: 'AIzaSyA7PuNXKInMUC89_znuoxMRj7iI0m9dD5g',
  authDomain: 'telemedicine-dcfa2.firebaseapp.com',
  projectId: 'telemedicine-dcfa2',
  storageBucket: 'telemedicine-dcfa2.firebasestorage.app',
  messagingSenderId: '555237969310',
  appId: '1:555237969310:web:56411f498f242f305fda8f',
  measurementId: 'G-6BJL51SS41',
  databaseURL: 'https://telemedicine-dcfa2-default-rtdb.firebaseio.com',
};

let app: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (firebase.apps.length > 0) {
    app = firebase.app();
  } else {
    app = firebase.initializeApp(firebaseConfig);
  }
  return app;
};
