import fs from 'fs'

import { Logger } from '@nestjs/common'
import { parse } from 'csv-parse'

export default function parseCsvToJson(filePath: string): Promise<object[]> {
  return new Promise((resolve, reject) => {
    const result: object[] = []
    const stream = fs.createReadStream(filePath)

    stream.on('error', err => {
      Logger.log('Failed to read csv file on', filePath, 'with error', err.message)
      reject(err)
    })

    stream
      .pipe(
        parse({
          columns: true,
          trim: true,
          skip_empty_lines: true,
          delimiter: ';',
        }),
      )
      .on('data', data => {
        result.push(data)
      })
      .on('end', () => {
        resolve(result)
      })
      .on('error', err => {
        reject(err)
      })
  })
}
