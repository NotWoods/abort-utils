/**
 * Returns a new AbortSignal which will be aborted in `delay` milliseconds.
 * @param delay The number of milliseconds to wait before triggering the AbortSignal.
 */
export function timeout(delay: number) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), delay);
  return controller.signal;
}
