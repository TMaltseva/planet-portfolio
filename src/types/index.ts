export interface TourPoint {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  mobilePosition?: [number, number, number];
  cameraPosition: [number, number, number];
  color: string;
}

export interface CloudInstanceProps {
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  floatSpeed: number;
  opacity?: number;
}

export interface LocationCardProps {
  point: TourPoint;
  isActive: boolean;
  onClick: () => void;
}

export interface LocationMarkerProps {
  point: TourPoint;
  isActive: boolean;
}

export interface CameraControllerProps {
  currentPoint: TourPoint;
  onNextPoint: () => void;
}

export interface TourNavigationProps {
  tourPoints: TourPoint[];
  currentPointIndex: number;
  onPointSelect: (index: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  point: TourPoint | null;
  onClose: () => void;
}

export interface TouchSettings {
  enableTouchRotate: boolean;
  enableTouchZoom: boolean;
  touchSensitivity: number;
  minTouchTargetSize: number;
}

export interface AdaptiveTourPoint extends TourPoint {
  mobilePosition?: [number, number, number];
}
