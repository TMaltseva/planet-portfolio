import type { TourPoint } from "../types";

export const TOUR_POINTS: TourPoint[] = [
  {
    id: "about",
    title: "About me",
    description: "Frontend dev 2+ years of experience",
    position: [20, 12, 1],
    cameraPosition: [30, 20, 30],
    color: "#8ba5ff",
  },
  {
    id: "skills",
    title: "Skills",
    description: "React, Node.js, TypeScript, Three.js",
    position: [11, 10, 0],
    cameraPosition: [-30, 20, 30],
    color: "#b8c5ff",
  },
  {
    id: "projects",
    title: "Projects",
    description: "My pet projects",
    position: [20, 10, -8],
    cameraPosition: [30, 20, -30],
    color: "#e6b3ff",
  },
  {
    id: "certificates",
    title: "Certificates",
    description: "Proof of qualifications",
    position: [15, 9, -5],
    cameraPosition: [-30, 20, -30],
    color: "#f9ca24",
  },
  {
    id: "contact",
    title: "Contacts",
    description: "Contact me",
    position: [10, 7, -8],
    cameraPosition: [0, 25, 25],
    color: "#ffc0cb",
  },
];
