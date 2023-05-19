import { promisify } from 'util'
import childProcess from 'child_process'

/**
 *  Execute a command.
 * @param {string} command
 */
export function execute(command) {
  return promisify(childProcess.exec)(command)
}
