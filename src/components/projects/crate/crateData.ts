import { projectsData } from "@/data/portfolio";

export type SceneKind = "messit" | "robowars" | "hackx" | "verimind" | "plant" | "bunk";
export type LabelIconKind = "burger" | "spinbot" | "laptop" | "chip" | "plant" | "bunkbed";

type Theme = {
  /** Sleeve and label colour. */
  color: string;
  /** Text printed on top of `color`. */
  ink: string;
  /** The same colour, lifted where needed so it reads on the black page. */
  textColor: string;
  scene: SceneKind;
  icon: LabelIconKind;
};

const NAVY = "#0B1550";

const THEMES: Record<string, Theme> = {
  MessIT: { color: "#D9D9D9", ink: NAVY, textColor: "#D9D9D9", scene: "messit", icon: "burger" },
  RoboWars: { color: "#E2B5F0", ink: NAVY, textColor: "#E2B5F0", scene: "robowars", icon: "spinbot" },
  HackXpertise: { color: "#FA1A1D", ink: "#FFFFFF", textColor: "#FA1A1D", scene: "hackx", icon: "laptop" },
  Verimind: { color: "#2849CB", ink: "#FFFFFF", textColor: "#6F88FF", scene: "verimind", icon: "chip" },
  "Plant Care": { color: "#74D4F0", ink: NAVY, textColor: "#74D4F0", scene: "plant", icon: "plant" },
  BunkBuddies: { color: "#FFFFFF", ink: NAVY, textColor: "#FFFFFF", scene: "bunk", icon: "bunkbed" },
};

/** Themes handed out in turn to any project added later that has no entry above. */
const FALLBACK = Object.values(THEMES);

export type CrateLink = { label: string; href: string };

export type CrateRecord = Theme & {
  name: string;
  upper: string;
  description: string;
  image: string;
  links: CrateLink[];
};

function linksFor(project: (typeof projectsData)[number]): CrateLink[] {
  const links: CrateLink[] = [];
  if (project.github) links.push({ label: "Code", href: project.github });
  if (project.href) {
    const store = project.href.includes("play.google.com");
    links.push({ label: store ? "Open app" : "Visit site", href: project.href });
  }
  return links;
}

/** The crate's records, front of the crate first, in the order of `projectsData`. */
export const CRATE_RECORDS: CrateRecord[] = projectsData.map((project, i) => ({
  ...(THEMES[project.name] ?? FALLBACK[i % FALLBACK.length]),
  name: project.name,
  upper: project.name.toUpperCase(),
  description: project.description,
  image: project.image,
  links: linksFor(project),
}));
