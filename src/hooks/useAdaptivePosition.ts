import type { AdaptiveTourPoint } from "../types";

export const useAdaptivePosition = (
  point: AdaptiveTourPoint,
  isMobile: boolean
): [number, number, number] => {
  return isMobile && point.mobilePosition
    ? point.mobilePosition
    : point.position;
};
