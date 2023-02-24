// import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

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
// const analytics = getAnalytics(app)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export const isSignedIn = (): boolean => {
  return (
    localStorage.getItem('name') !== null &&
    localStorage.getItem('email') !== null &&
    localStorage.getItem('userImg') !== null
  )
}

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      console.log(token)
      // The signed-in user info.
      const user = result.user
      // IdP data available using getAdditionalUserInfo(result)
      const name = user.displayName
      const email = user.email
      const userImg = user.photoURL

      localStorage.setItem('name', name!)
      localStorage.setItem('email', email!)
      localStorage.setItem('userImg', userImg!)

      window.location.reload()
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
      console.log(errorCode, errorMessage, email, credential)
    })
}

export const signOutOfGoogle = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      localStorage.removeItem('userImg')

      window.location.reload()
    })
    .catch((error) => {
      // An error happened.
    })
}
