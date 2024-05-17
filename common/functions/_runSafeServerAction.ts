"use server"

import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"

/**
 * Will never throw an error.
 * @param fn - the serverAction
 * @param args - the parameters of the serverAction
 */
export default async function _runSafeServerAction<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  ...args: Parameters<F>
): Promise<
  | {
      type: "success"
      result: Awaited<ReturnType<F>>
    }
  | {
      type: "error"
      result: { message: string; [additionalErrorInfoKey: string]: any }
    }
> {
  try {
    const result: Awaited<ReturnType<F>> = await fn(...args)
    return {
      type: "success",
      result,
    }
  } catch (error: any) {
    const errorResult = jsonifyError(error)
    if (!errorResult.message) {
      errorResult.message = `An error occurred with no error message`
    }
    return {
      type: "error",
      result: errorResult,
    }
  }
}
