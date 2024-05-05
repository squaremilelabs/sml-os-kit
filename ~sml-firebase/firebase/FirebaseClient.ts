import { createId } from "@paralleldrive/cuid2"
import { initializeApp } from "firebase/app"
import {
  Auth,
  UserCredential,
  getAuth,
  isSignInWithEmailLink,
  signOut as firebaseSignOut,
  signInWithEmailLink,
} from "firebase/auth"
import { FirebaseStorage, UploadResult, getStorage, ref, uploadBytes } from "firebase/storage"

export default class FirebaseClient {
  auth: {
    service: Auth
    isSignInWithEmailLink: (emailLink: string) => boolean
    signInWithEmailLink: (email: string, emailLink: string) => Promise<UserCredential>
    signOut: () => Promise<void>
  }
  storage: {
    service: FirebaseStorage
    uploadBytes: (
      fileName: string,
      bytes: Blob | Uint8Array | ArrayBuffer
    ) => Promise<{ id: string; uploadResult: UploadResult }>
  }

  constructor() {
    const config = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG as string)
    const app = initializeApp(config)
    const auth = getAuth(app)
    const storage = getStorage(app)

    // Initialize Auth Functions
    this.auth = {
      service: auth,
      isSignInWithEmailLink: (emailLink: string) => {
        return isSignInWithEmailLink(auth, emailLink)
      },
      signInWithEmailLink: async (email: string, emailLink: string) => {
        return signInWithEmailLink(auth, email, emailLink)
      },
      signOut: async () => {
        return firebaseSignOut(auth)
      },
    }

    // Initialize Storage Functions
    this.storage = {
      service: storage,
      uploadBytes: async (fileName: string, bytes: Blob | Uint8Array | ArrayBuffer) => {
        const refId = createId()
        const storageRef = ref(storage, `${refId}/${fileName}`)
        const uploadResult = await uploadBytes(storageRef, bytes)
        return { id: refId, uploadResult }
      },
    }
  }
}
