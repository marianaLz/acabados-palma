import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { db } from './config.js';

export const getDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    return documents;
  } catch (error) {
    return { response: 'error', msg: 'Error al obtener la colección' };
  }
};

export const createDocument = async (collectionName, document) => {
  try {
    const docSnap = await addDoc(collection(db, collectionName), document);
    return getDocument(collectionName, docSnap.id);
  } catch (e) {
    return { response: 'error', msg: 'Error al crear el documento' };
  }
};

export const getDocument = async (collectionName, id) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    return { ...docSnap.data(), id: docSnap.id };
  } catch (error) {
    return { response: 'error', msg: 'Error al obtener el documento' };
  }
};

export const updateDocument = async (collectionName, document, id) => {
  try {
    await updateDoc(doc(db, collectionName, id), document);
    return getDocument(collectionName, id);
  } catch (error) {
    return { response: 'error', msg: 'Error al actualizar el documento' };
  }
};

export const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    return { response: 'error', msg: 'Error al actualizar el documento' };
  }
};
