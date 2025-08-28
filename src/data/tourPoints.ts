import type { AdaptiveTourPoint } from "../types";

export const TOUR_POINTS: AdaptiveTourPoint[] = [
  {
    id: "about",
    title: "About me",
    description: "Frontend dev 2+ years of experience",
    position: [20, 12, 1],
    mobilePosition: [0, 0, 1],
    cameraPosition: [30, 20, 30],
    color: "#8ba5ff",
  },
  {
    id: "skills",
    title: "Skills",
    description: "React, Node.js, TypeScript, Three.js",
    position: [11, 10, 0],
    mobilePosition: [-7, -2, 0],
    cameraPosition: [-30, 20, 30],
    color: "#b8c5ff",
  },
  {
    id: "projects",
    title: "Projects",
    description: "My pet projects",
    position: [20, 10, -8],
    mobilePosition: [0, -2, -6],
    cameraPosition: [30, 20, -30],
    color: "#e6b3ff",
  },
  {
    id: "certificates",
    title: "Studies",
    description: "Proof of qualifications",
    position: [15, 9, -5],
    mobilePosition: [-5, -3, -5],
    cameraPosition: [-30, 20, -30],
    color: "#f9ca24",
  },
  {
    id: "contact",
    title: "Contacts",
    description: "Contact me",
    position: [10, 7, -8],
    mobilePosition: [-7, -3, -8],
    cameraPosition: [0, 25, 25],
    color: "#ffc0cb",
  },
];
