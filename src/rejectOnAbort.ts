import { AbortError, AbortSignalLike } from "./AbortError";

/**
 * Rejects once an abort signal is aborted.
 */
export function rejectOnAbort(signal: AbortSignalLike): Promise<void> {
  return new Promise((_, reject) => {
    const handleAbort = () => reject(signal.reason ?? new AbortError());

    if (signal.aborted) {
      handleAbort();
    } else {
      signal.addEventListener("abort", handleAbort, { once: true });
    }
  });
}
