import { OrderByDirection, Query, WhereFilterOp } from "firebase-admin/firestore"

export interface FirestoreQueryParams {
  where?: Array<[string, WhereFilterOp, any]>
  orderBy?: Array<[string, OrderByDirection]>
  limit?: number
}

export default function constructFirestoreQuery(
  collection: Query,
  queryParams: FirestoreQueryParams
): Query {
  let query = collection

  if (queryParams.where?.length) {
    queryParams.where.forEach((param) => {
      const [fieldPath, operation, value] = param
      query = query.where(fieldPath, operation, value)
    })
  }

  if (queryParams.orderBy?.length) {
    queryParams.orderBy.forEach((param) => {
      const [fieldPath, direction] = param
      query = query.orderBy(fieldPath, direction)
    })
  }

  if (typeof queryParams.limit === "number") {
    query = query.limit(queryParams.limit)
  }

  return query
}
