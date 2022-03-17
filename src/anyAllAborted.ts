import { AbortError, AbortSignalLike } from "./AbortError";

/**
 * Returns AbortSignal that fires after any given abort signal fires
 */
export function anyAborted(signals: readonly AbortSignalLike[]): AbortSignal {
  if (signals.length === 0) {
    throw new TypeError("No signals provided to anyAborted");
  } else if (signals.length === 1) {
    return signals[0] as AbortSignal;
  }

  const controller = new AbortController();

  function handleAbort(this: AbortSignalLike) {
    controller.abort(this.reason);

    // Clean up event listeners
    for (const signal of signals) {
      signal.removeEventListener("abort", handleAbort);
    }
  }

  for (const signal of signals) {
    if (signal.aborted) {
      handleAbort.call(signal);
      break;
    } else {
      signal.addEventListener("abort", handleAbort, {
        once: true,
        signal: controller.signal,
      });
    }
  }

  return controller.signal;
}

/**
 * Returns AbortSignal that fires after every single given abort signal fires
 */
export function allAborted(signals: readonly AbortSignalLike[]): AbortSignal {
  if (signals.length === 1) {
    return signals[0] as AbortSignal;
  }

  const controller = new AbortController();
  function abort() {
    controller.abort(
      new AggregateError(
        signals.map((signal) => signal.reason ?? new AbortError())
      )
    );
  }

  const notAborted = signals.filter((signal) => !signal.aborted);
  if (notAborted.length === 0) {
    abort();
  } else {
    const aborted = new Set<AbortSignalLike>();
    function handleAbort(this: AbortSignalLike) {
      aborted.add(this);

      if (aborted.size === notAborted.length) {
        controller.abort();
        // Clean up event listeners
        for (const signal of notAborted) {
          signal.removeEventListener("abort", handleAbort);
        }
      }
    }

    for (const signal of notAborted) {
      signal.addEventListener("abort", handleAbort, {
        once: true,
        signal: controller.signal,
      });
    }
  }

  return controller.signal;
}
