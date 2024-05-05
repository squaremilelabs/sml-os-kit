"use server"

import _queryUsers from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_queryUsers"
import { FirestoreQueryParams } from "@/~sml-os-kit/~sml-firebase/firestore/utilties/constructFirestoreQuery"
import { BaseOSUser } from "../types"
import roles from "@/$sml-os-config/roles"

export default async function _queryOSUsers(params: FirestoreQueryParams) {
  const baseUsersResult = await _queryUsers<BaseOSUser>(params)
  const usersWithRoles = baseUsersResult.map((user) => {
    const role = roles.find((role) => role.id === user.roleId)
    return { ...user, role }
  })
  return usersWithRoles
}
