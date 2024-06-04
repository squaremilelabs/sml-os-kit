import dotenv from "dotenv"
import { BaseOSUser } from "@/~sml-os-kit/auth/types"
import _updateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_updateUser"
import _createUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_createUser"
import _queryOSUsers from "@/~sml-os-kit/auth/functions/_queryOSUsers"

dotenv.config()

async function main() {
  /* 
    Create E & David as users
  */

  await _createUser<BaseOSUser>({
    displayName: "E",
    email: "e@squaremilelabs.com",
    roleId: "admin",
    isSML: true,
  })
  console.log("CREATED E")

  await _createUser<BaseOSUser>({
    displayName: "David",
    email: "david@squaremilelabs.com",
    roleId: "admin",
    isSML: true,
  })
  console.log("CREATED DAVID")

  /* 
    Invoke the users query in `Manage Users` (which should result in an error),
    so that Firebase prompts the creation of the index.
  */

  /* ROLE FILTER */
  try {
    await _queryOSUsers({
      where: [["roleId", "in", ["admin"]]],
      orderBy: [["displayName", "asc"]],
    })
  } catch (error) {
    console.log("---- ROLE FILTER ----")
    console.log(error)
  }

  /* DEACTIVATED FILTER */
  try {
    await _queryOSUsers({
      where: [["isDeactivated", "==", false]],
      orderBy: [["displayName", "asc"]],
    })
  } catch (error) {
    console.log("---- DEACTIVATED FILTER ----")
    console.log(error)
  }

  /* COMBINED FILTER */
  try {
    await _queryOSUsers({
      where: [
        ["roleId", "in", ["admin"]],
        ["isDeactivated", "==", false],
      ],
      orderBy: [["displayName", "asc"]],
    })
  } catch (error) {
    console.log("---- COMBINED FILTER ----")
    console.log(error)
  }
}

main()
  .then(() => console.log("INIT SCRIPT COMPLETE"))
  .catch(console.error)
