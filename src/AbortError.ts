/**
 * A signal object that allows you to communicate with a DOM request (such as a Fetch) and abort it if required via an AbortController object.
 */
export interface AbortSignalLike {
  /**
   * Returns true if this AbortSignal's AbortController has signaled to abort, and false otherwise.
   */
  readonly aborted: boolean;
  /** Returns a JavaScript value that indicates the abort reason */
  readonly reason?: unknown;

  addEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

/**
 * To be thrown when a Signal is aborted.
 *
 * Equal to Node.JS's AbortError
 *
 * @see https://github.com/nodejs/node/blob/1ed72f67f5ea82b36b8589e447619e98c004fa12/lib/internal/errors.js#L735-L741
 */
export class AbortError extends Error {
  code = "ABORT_ERR";
  name = "AbortError";
  constructor() {
    super("The operation was aborted");
  }
}

export function isAbortError(error: unknown): error is AbortError {
  return error instanceof Error && error.name === "AbortError";
}
