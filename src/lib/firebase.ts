import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBQPySpHC-d01WUWhj9F5JKLUJI3Z6CAng',
  authDomain: 'thywordletest.firebaseapp.com',
  projectId: 'thywordletest',
  storageBucket: 'thywordletest.appspot.com',
  messagingSenderId: '695062518324',
  appId: '1:695062518324:web:c29754a802338fd970c861',
  measurementId: 'G-R5SRVHHTGS',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
        photoUrl: user.photoURL,
      })
    }
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

export const logout = () => {
  signOut(auth)
}
