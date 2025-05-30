import { useState, useEffect } from "react";

interface ScrollState {
  scrollY: number;
  scrollDirection: "up" | "down";
  isScrolled: boolean;
}

interface UseScrollOptions {
  threshold?: number;
  debounce?: number;
}

export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { threshold = 100, debounce = 10 } = options;
  
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: "down",
    isScrolled: false,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollY ? "down" : "up";
      const isScrolled = scrollY > threshold;

      setScrollState({
        scrollY,
        scrollDirection,
        isScrolled,
      });

      lastScrollY = scrollY;
    };

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(updateScrollState, debounce);
    };

    // Set initial state
    updateScrollState();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, debounce]);

  return scrollState;
}

// Hook for detecting when an element enters the viewport
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}

// Hook for smooth scrolling to elements
export function useSmoothScroll() {
  const scrollToElement = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return { scrollToElement, scrollToTop };
}

// Hook for scroll-triggered animations
export function useScrollAnimation(
  elementRef: React.RefObject<HTMLElement>,
  animationClass: string = "animate-slide-up"
) {
  const { isIntersecting } = useIntersectionObserver(elementRef);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (isIntersecting) {
      element.classList.add(animationClass);
    }
  }, [isIntersecting, animationClass, elementRef]);

  return isIntersecting;
}
