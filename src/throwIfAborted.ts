import { AbortError, AbortSignalLike } from "./AbortError";

/**
 * Throws the signal's abort `reason` if the signal has been aborted;
 * otherwise it does nothing.
 */
export function throwIfAborted(signal: AbortSignalLike): void {
  if (signal.aborted) {
    throw signal.reason ?? new AbortError();
  }
}
