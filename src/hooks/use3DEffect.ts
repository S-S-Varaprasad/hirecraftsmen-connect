
import { useEffect, RefObject } from 'react';

interface Use3DEffectOptions {
  intensity?: number;
  perspective?: number;
  reverse?: boolean;
  resetOnLeave?: boolean;
}

/**
 * Hook to add a 3D tilt effect to an element
 * @param ref React ref to the element to add the effect to
 * @param options Configuration options for the effect
 */
export function use3DEffect(
  ref: RefObject<HTMLElement>,
  {
    intensity = 15,
    perspective = 1000,
    reverse = false,
    resetOnLeave = true,
  }: Use3DEffectOptions = {}
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial perspective
    element.style.transformStyle = 'preserve-3d';
    element.style.transition = 'transform 0.1s ease-out';
    element.style.perspective = `${perspective}px`;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = reverse ? (centerX - x) / intensity : (x - centerX) / intensity;
      const rotateX = reverse ? (y - centerY) / intensity : (centerY - y) / intensity;

      element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      if (resetOnLeave) {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, intensity, perspective, reverse, resetOnLeave]);
}
