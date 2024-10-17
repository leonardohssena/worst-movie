export default function sanitizeData(data: object): object {
  const sanitized = { ...data }
  const RESTRICT_KEYS = ['password', 'token']

  function recursiveSanitize(obj: object) {
    Object.keys(obj).forEach(key => {
      if (RESTRICT_KEYS.includes(key)) {
        obj[key] = '******'
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        recursiveSanitize(obj[key])
      }
    })
  }

  recursiveSanitize(sanitized)

  return sanitized
}
