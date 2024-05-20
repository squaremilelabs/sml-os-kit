"use server"

import _queryUsers from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_queryUsers"
import { FirestoreQueryParams } from "@/~sml-os-kit/~sml-firebase/firestore/utilties/constructFirestoreQuery"
import { BaseOSUser } from "../types"
import { Role } from "@/~sml-os-kit/config/auth/types"
import getRoleById from "@/~sml-os-kit/auth/functions/getRoleById"

export default async function _queryOSUsers(params: FirestoreQueryParams) {
  const baseUsersResult = await _queryUsers<BaseOSUser>(params)
  const usersWithRoles = baseUsersResult.map((user) => {
    let role: Role | null = null
    if (user.roleId) {
      role = getRoleById(user.roleId)
    }
    return { ...user, role }
  })
  return usersWithRoles
}
