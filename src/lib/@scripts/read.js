import { readFile } from 'fs'
import { promisify } from 'util'

/**
 * Read contents of a file.
 * @param {string} fileName
 */
export function read(fileName) {
  return promisify(readFile)(fileName, 'utf8')
}
