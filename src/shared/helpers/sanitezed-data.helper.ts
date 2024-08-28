export default function sanitizeData(data: { [key: string]: unknown }): { [key: string]: unknown } {
  const sanitized = { ...data }

  if (sanitized.password) {
    sanitized.password = '******'
  }

  if (sanitized.token) {
    sanitized.token = '******'
  }

  return sanitized
}
