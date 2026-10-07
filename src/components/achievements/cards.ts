import type { CARD_ICONS, CARD_SHAPES } from "./cardArt";

// The achievement cards: shared by the Achievements section and the card wall in the 3D room.
export type Card = {
  face: string;
  name: string;
  when: string;
  where: string;
  icon: keyof typeof CARD_ICONS;
  shape: keyof typeof CARD_SHAPES;
  bg: string;
  alt: string;
  text: string;
  altText: string;
  ink: string;
  tilt: number;
  body: string;
};

export const CARDS: Card[] = [
  { face: "RIVIERA'26", name: "Events Coordinator", when: "FEB 2026", where: "Riviera'26, VIT's cultural fest", icon: "note", shape: "star", bg: "#FDBBFF", alt: "#2849CB", text: "#000000", altText: "#FFFFFF", ink: "#2849CB", tilt: -1.5, body: "Coordinated cultural events and managed promotion for Riviera'26, VIT's flagship cultural fest with over 150 events." },
  { face: "1ST PRIZE", name: "1st Prize, Cluminati", when: "2023", where: "graVITas'23, VIT's tech fest", icon: "trophy", shape: "flower", bg: "#FFD23F", alt: "#FA1A1D", text: "#000000", altText: "#FFFFFF", ink: "#111111", tilt: 1, body: "Won first prize in the Cluminati event during graVITas'23, VIT's flagship Tech Fest." },
  { face: "TEACHING", name: "Outreach and Teaching", when: "2025", where: "Takshilah Global School", icon: "code", shape: "notched", bg: "#74D4F0", alt: "#2E5946", text: "#000000", altText: "#FFFFFF", ink: "#111111", tilt: -1, body: "Conducted coding and cyber security outreach sessions at Takshilah Global School to empower students." },
  { face: "CERTIFIED", name: "Certified Developer", when: "2 CERTS", where: "Flutter (Udemy), Python (Summer Camp)", icon: "seal", shape: "blob", bg: "#BFEA88", alt: "#FF7A1A", text: "#000000", altText: "#000000", ink: "#2E5946", tilt: 1.5, body: "Certifications: Complete Flutter Development Bootcamp (Udemy) and Simply Coding Python (Summer Camp)." },
  { face: "SCIENCE", name: "Science Creativity", when: "SCHOOL", where: "High school science projects", icon: "flask", shape: "star", bg: "#FFFFFF", alt: "#FF4337", text: "#000000", altText: "#FFFFFF", ink: "#FA1A1D", tilt: -0.5, body: "Awarded the Science Creativity Certificate for exceptional innovation in high school science projects." },
];
