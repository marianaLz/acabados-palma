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

export const getQuotes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'quotes'));
    const quotes = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    return quotes;
  } catch (error) {
    return { response: 'error', msg: 'Error al obtener la colección' };
  }
};

export const createQuote = async (quote) => {
  try {
    const docSnap = await addDoc(collection(db, 'quotes'), quote);
    return getQuote(docSnap.id);
  } catch (e) {
    console.log(e);
    return { response: 'error', msg: 'Error al crear el documento' };
  }
};

export const getQuote = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, 'quotes', id));
    return { ...docSnap.data(), id: docSnap.id };
  } catch (error) {
    return { response: 'error', msg: 'Error al obtener el documento' };
  }
};

export const updateQuote = async (quote, id) => {
  try {
    await updateDoc(doc(db, 'quotes', id), quote);
    return getQuote(id);
  } catch (error) {
    return { response: 'error', msg: 'Error al actualizar el documento' };
  }
};

export const deleteQuote = async (id) => {
  try {
    await deleteDoc(doc(db, 'quotes', id));
  } catch (error) {
    return { response: 'error', msg: 'Error al actualizar el documento' };
  }
};
