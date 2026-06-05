import { useEffect, useRef, useState } from 'react';
import { Platform, type View } from 'react-native';

export function useScrollReveal(threshold = 0.1, delayClass = '') {
  const ref = useRef<View>(null);
  const [visible, setVisible] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const node = ref.current as unknown as Element | null;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const base = `reveal-on-scroll ${delayClass}`.trim();
  const className = visible ? `${base} is-visible` : base;

  return { ref, visible, className };
}
