import { open } from 'fs/promises'

/**
 *
 * @param {string} fileName
 * @param {import('fs').Mode} flags
 * @returns
 */
export function openFile(fileName, flags) {
  return open(fileName, flags)
}
