export default function jsonifyError(error: Error & object) {
  const stringifiedError = JSON.stringify(error, Object.getOwnPropertyNames(error))
  const jsonError = JSON.parse(stringifiedError)
  return jsonError
}
