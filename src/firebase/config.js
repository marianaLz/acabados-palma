import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCIkvKvMCWgCAJHnI-DE74i4QuxGvRbJfs',
  authDomain: 'acabados-palma.firebaseapp.com',
  projectId: 'acabados-palma',
  storageBucket: 'acabados-palma.appspot.com',
  messagingSenderId: '947295777937',
  appId: '1:947295777937:web:2af50c40e6d94c20f43b30',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
