import { initializeApp } from '@react-native-firebase/app';

// Firebase credentials
const firebaseConfig = {
  apiKey: 'AIzaSyA7PuNXKInMUC89_znuoxMRj7iI0m9dD5g',
  authDomain: 'telemedicine-dcfa2.firebaseapp.com',
  projectId: 'telemedicine-dcfa2',
  storageBucket: 'telemedicine-dcfa2.firebasestorage.app',
  messagingSenderId: '555237969310',
  appId: '1:555237969310:web:56411f498f242f305fda8f',
};

let app: any = null;

export const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};
