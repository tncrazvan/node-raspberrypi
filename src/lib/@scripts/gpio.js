import { execute } from '@scripts/child-process'
import { openFile } from '@scripts/openFile'

const READ = 0
const WRITE = 1

/**
 *
 * @param {import('@t/header-name').HeaderName} pin
 * @param {0|1} direction
 */
async function setup(pin, direction) {
  const { stderr: exportError } = await execute(`'${pin}' > /sys/class/gpio/export`)

  if (exportError) {
    throw new Error(`Could not export pin ${pin}.`)
  }

  const { stderr: directionError } = await execute(`'${direction > 0 ? 'out' : 'in'}' > /sys/class/gpio/gpio${pin}/direction`)

  if (directionError) {
    throw new Error(`Could not point pin ${pin} to direction "${direction}".`)
  }
}

/**
 * 

 * @param {import('@t/header-name').HeaderName} pin 
 * @param {0|1} direction 
 * @returns 
 */
async function findFile(pin, direction) {
  await setup(pin, direction)
  const key = `${pin}:${direction}`
  if (key in pointers) {
    return pointers[key]
  } else {
    const file = await openFile(`/sys/class/gpio/gpio${pin}/value`, direction > 0 ? 'a' : 'r')
    pointers[key] = file
    return file
  }
}

/** @type {Record<string,import('fs/promises').FileHandle>} */
const pointers = {}

/**
 * Close a GPIO pointer.
 * @param {import('@t/header-name').HeaderName} pin pin number
 * @param {'read'|'write'} direction direction of the pointer
 */
export function close(pin, direction) {}

/**
 * Get a function that handles reading or writing to the given pin.
 * @param {import('@t/header-name').HeaderName} pin number of the pin head.
 * @returns {{
 *  reader: function():Promise<function():Promise<'0'|'1'>>
 *  writer: function():Promise<function('0'|'1'):Promise<{bytesWritten: number,buffer: any}>>
 * }}
 * @throw Error when the pin can't be exported or opened
 */
export function open(pin) {
  return {
    /** @type {function():Promise<function():Promise<'0'|'1'>>} */
    reader: async () => {
      const file = await findFile(pin, READ)
      /** @type {function():Promise<'0'|'1'>} */
      // @ts-ignore
      const action = async () => (await file.readFile()).toString()
      return action
    },
    /** @type {function():Promise<function('0'|'1'):Promise<{bytesWritten: number,buffer: any}>>} */
    writer: async () => {
      const file = await findFile(pin, WRITE)
      /** @type {function('0'|'1'):Promise<{bytesWritten: number,buffer: any}>} */
      const action = async buffer => await file.write(buffer)
      return action
    },
  }
}
