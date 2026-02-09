/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { getFirebaseApp } from './src/services/firebase/config';

// Initialize Firebase before App
getFirebaseApp();

AppRegistry.registerComponent(appName, () => App);
