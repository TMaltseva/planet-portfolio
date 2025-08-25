import { useState } from "react";
import type { TourPoint } from "../types";

export const useTour = (tourPoints: TourPoint[]) => {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<TourPoint | null>(null);

  const handleNextPoint = () => {
    setCurrentPointIndex((prev) => (prev + 1) % tourPoints.length);
  };

  const handlePointClick = (point: TourPoint) => {
    setSelectedPoint(point);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPoint(null);
  };

  const selectPoint = (index: number) => {
    setCurrentPointIndex(index);
  };

  return {
    currentPointIndex,
    currentPoint: tourPoints[currentPointIndex],
    showModal,
    selectedPoint,
    handleNextPoint,
    handlePointClick,
    closeModal,
    selectPoint,
  };
};
