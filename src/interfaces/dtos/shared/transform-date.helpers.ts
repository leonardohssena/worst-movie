import { Transform } from 'class-transformer'

export default function TransformDate() {
  const toPlain = Transform(({ value }) => value.toISOString(), { toPlainOnly: true })

  const toClass = Transform(({ value }) => new Date(value), { toClassOnly: true })

  return function (target: unknown, key: string) {
    toPlain(target, key)
    toClass(target, key)
  }
}
