import { useResponsive } from '../../hooks/useResponsive';
import CameraController from './CameraController';
import MobileCameraController from './MobileCameraController';
import type { TourPoint } from '../../types';

interface CameraControllerAdaptiveProps {
  currentPoint: TourPoint;
  onIntroComplete?: (complete: boolean) => void;
  onOrbitControlsReady?: (ready: boolean) => void;
}

export default function CameraControllerAdaptive(props: CameraControllerAdaptiveProps) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <MobileCameraController {...props} isMobile={true} />;
  }

  return <CameraController {...props} />;
}
