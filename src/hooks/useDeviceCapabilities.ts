import { useState, useEffect } from "react";

interface DeviceCapabilities {
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  deviceMemory: number;
  hardwareConcurrency: number;
  maxTextureSize: number;
  isLowEndDevice: boolean;
  shouldReduceAnimations: boolean;
  prefersReducedMotion: boolean;
}

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
  };
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    supportsWebGL: false,
    supportsWebGL2: false,
    deviceMemory: 4,
    hardwareConcurrency: 4,
    maxTextureSize: 1024,
    isLowEndDevice: false,
    shouldReduceAnimations: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
      const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext | null;

      let maxTextureSize = 1024;
      if (gl) {
        maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      }

      const extendedNavigator = navigator as ExtendedNavigator;
      const deviceMemory = extendedNavigator.deviceMemory ?? 4;
      const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const isLowEndDevice =
        deviceMemory <= 2 ||
        hardwareConcurrency <= 2 ||
        maxTextureSize < 2048 ||
        !gl ||
        /Android 4|iPhone [1-6]/i.test(navigator.userAgent);

      const shouldReduceAnimations = isLowEndDevice || prefersReducedMotion;

      setCapabilities({
        supportsWebGL: !!gl,
        supportsWebGL2: !!gl2,
        deviceMemory,
        hardwareConcurrency,
        maxTextureSize,
        isLowEndDevice,
        shouldReduceAnimations,
        prefersReducedMotion,
      });

      canvas.remove();
    };

    checkCapabilities();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setCapabilities((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
        shouldReduceAnimations: prev.isLowEndDevice || e.matches,
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return capabilities;
}
