import { useCallback, useRef } from 'react';

/**
 * Returns a callback ref (not a plain ref).
 * The IntersectionObserver is created only when the DOM node is actually
 * attached — this handles conditionally-rendered sections (e.g. categories
 * that only render after an async fetch completes).
 *
 * Usage:  const ref = useScrollReveal();
 *         <section ref={ref}>...</section>
 */
const useScrollReveal = (threshold = 0.12, once = true) => {
  const observerRef = useRef(null);

  const callbackRef = useCallback(
    (node) => {
      // Clean up any previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.querySelectorAll(selectors).forEach((el) =>
              el.classList.add('visible')
            );
            if (once) {
              observer.unobserve(node);
              observerRef.current = null;
            }
          }
        },
        { threshold }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, once]
  );

  return callbackRef;
};

export default useScrollReveal;
