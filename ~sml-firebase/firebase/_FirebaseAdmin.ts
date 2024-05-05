import { App, cert, getApp, initializeApp } from "firebase-admin/app"
import { getAuth, Auth } from "firebase-admin/auth"
import { getStorage, getDownloadURL } from "firebase-admin/storage"
import { Bucket } from "@google-cloud/storage"
import { getFirestore, Firestore } from "firebase-admin/firestore"

export default class _FirebaseAdmin {
  auth: Auth
  storage: {
    bucket: Bucket
    getDownloadUrl: (filePath: string) => Promise<string>
  }
  sysFirestore: Firestore
  appFirestore: Firestore

  constructor() {
    const clientConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG as string)
    const adminConfig = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG as string)
    const credential = cert({
      privateKey: adminConfig.private_key,
      clientEmail: adminConfig.client_email,
      projectId: adminConfig.project_id,
    })
    let app: App
    try {
      app = initializeApp({ credential })
    } catch (error) {
      app = getApp()
    }
    this.auth = getAuth(app)
    const bucket = getStorage(app).bucket(clientConfig.storageBucket)
    this.storage = {
      bucket,
      getDownloadUrl: async (filePath: string) => {
        const fileRef = bucket.file(filePath)
        return getDownloadURL(fileRef)
      },
    }
    this.sysFirestore = getFirestore(app)
    this.appFirestore = getFirestore(app, process.env.FIRESTORE_DATABASE_ID as string)
  }
}
