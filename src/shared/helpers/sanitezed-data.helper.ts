export default function sanitizeData(data: { [key: string]: unknown }): { [key: string]: unknown } {
  const sanitized = { ...data }
  const RESTRICT_KEYS = ['password', 'token']

  function recursiveSanitize(obj: { [key: string]: unknown }) {
    Object.keys(obj).forEach(key => {
      if (RESTRICT_KEYS.includes(key)) {
        obj[key] = '******'
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        recursiveSanitize(obj[key] as { [key: string]: unknown })
      }
    })
  }

  recursiveSanitize(sanitized)

  return sanitized
}
