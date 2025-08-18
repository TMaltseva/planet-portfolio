import type { TourPoint } from "../types";

export const TOUR_POINTS: TourPoint[] = [
  {
    id: "about",
    title: "About me",
    description: "Frontend dev 2+ years of experience",
    position: [20, 9, 1],
    cameraPosition: [30, 20, 30],
    color: "#ff6b6b",
  },
  {
    id: "skills",
    title: "Skills",
    description: "React, Node.js, TypeScript, Three.js",
    position: [11, 9, 0],
    cameraPosition: [-30, 20, 30],
    color: "#4ecdc4",
  },
  {
    id: "projects",
    title: "Projects",
    description: "My pet projects",
    position: [20, 10, -8],
    cameraPosition: [30, 20, -30],
    color: "#45b7d1",
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
    color: "#f0932b",
  },
];
