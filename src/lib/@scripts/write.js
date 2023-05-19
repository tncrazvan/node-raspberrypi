import { promisify } from 'util'
import { writeFile } from 'fs'

/**
 * Write contents to a file.
 * @param {string} fileName
 * @param {string} contents
 * @returns
 */
export function write(fileName, contents) {
  return promisify(writeFile)(fileName, contents)
}
