import { useEffect, useRef, useCallback } from 'react';

export function usePolling(fn, intervalMs, { enabled = true, onError } = {}) {
  const abortRef = useRef(null);
  const mountedRef = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled || !intervalMs) return;

    let timer;

    const run = async () => {
      if (!mountedRef.current) return;
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await fnRef.current({ signal: controller.signal });
      } catch (err) {
        if (err?.name !== 'AbortError' && mountedRef.current && onError) {
          onError(err);
        }
      } finally {
        if (mountedRef.current) {
          timer = setTimeout(run, intervalMs);
        }
      }
    };

    run();

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [intervalMs, enabled, onError]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { stop };
}

export default usePolling;
