import FirebaseClient from "@/~sml-os-kit/~sml-firebase/firebase/FirebaseClient"

export default async function signOut() {
  const { auth } = new FirebaseClient()
  return auth.signOut()
}
