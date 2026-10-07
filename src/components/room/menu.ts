// The room's sections, as stickers: the menu inside the house and the shortcuts on the way in share them.

export type Focus = "" | "about" | "projects" | "experience" | "achievements" | "contact";
export type Section = Exclude<Focus, "">;

/** id, label, sticker colour, ink, tilt (degrees). */
export const MENU: [Section, string, string, string, number][] = [
  ["about", "ABOUT ME", "#F4F4F4", "#111111", -2],
  ["projects", "PROJECTS", "#FA1A1D", "#FFFFFF", 1.5],
  ["experience", "EXPERIENCE", "#74D4F0", "#111111", -1.5],
  ["achievements", "ACHIEVEMENTS", "#FFD23F", "#111111", 1],
  ["contact", "CONTACT", "#BFEA88", "#111111", -1],
];

/** Where each section is in the room (the shortcuts' tooltips). */
export const WHERE: Record<Section, string> = {
  about: "the notebook on the desk",
  projects: "the record player",
  experience: "the film strip on the monitor",
  achievements: "the card wall",
  contact: "the poster wall",
};

// (the cat asleep on the sofa isn't a section, but it has a label of its own; so does the front door, outside)
export const PET: [string, string, string, string] = ["cat", "PET THE CAT", "#E39A4A", "#111111"];
export const DOOR: [string, string, string, string] = ["door", "COME ON IN", "#FFD23F", "#111111"];

/** The loading bar's words: the house going up while the files arrive (the last one while it all warms up). */
export const STEPS = ["Pouring the foundation…", "Laying the bricks…", "Plastering upstairs…", "Putting the roof on…", "Hanging the front door…", "Painting the fence…", "Putting the kettle on…"];
