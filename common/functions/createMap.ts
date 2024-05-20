export default function createMap<K extends string, V>(object: Record<K, V>): Map<K, V> {
  const entries = Object.entries<V>(object)
  const mappedEntries = entries.map(([key, value]) => [key as K, value] as [K, V])
  return new Map(mappedEntries)
}
