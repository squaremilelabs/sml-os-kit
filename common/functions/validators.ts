export function validateEmail(value: string) {
  return Boolean(value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i))
}
