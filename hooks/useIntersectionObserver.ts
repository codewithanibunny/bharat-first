"use client";

import { useState, useEffect, useRef, MutableRefObject } from 'react';

interface ObserverOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: ObserverOptions = { threshold: 0.1, triggerOnce: true }
): [MutableRefObject<HTMLDivElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce && ref.current) observer.unobserve(ref.current);
      } else if (!options.triggerOnce) {
        setIsIntersecting(false);
      }
    }, { threshold: options.threshold });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => { 
      if (currentRef) observer.unobserve(currentRef); 
    };
  }, [options.triggerOnce, options.threshold]);

  return [ref, isIntersecting];
};
