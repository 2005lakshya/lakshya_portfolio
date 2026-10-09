// The experience flyers: shared by the Experience section's film strip and the reel on the 3D room's monitor.
export type Flyer = {
  org: string;
  role: string;
  when: string;
  take: string;
  bg: string;
  ink: string;
  accent: string;
  roleSize: number;
  tilt: number;
  logo?: string;
  stats?: { big: string; small: string }[];
  text: string;
};

export const FLYERS: Flyer[] = [
  { org: "Havells India", role: "Summer Intern", when: "MAY TO JULY 2025", take: "2025", bg: "#F4F0E6", ink: "#111111", accent: "#FA1A1D", roleSize: 50, tilt: -1.5, logo: "/havells.png", text: "Developed a Student Data Management System using ASP.NET MVC (C#) and PostgreSQL. Built secure authentication with role-based access. Completed independently with weekly mentor reviews." },
  { org: "IEEE-TEMS", role: "Secretary", when: "JANUARY 2026 TO NOW", take: "2026", bg: "#2849CB", ink: "#FFFFFF", accent: "#FFD23F", roleSize: 52, tilt: -1, logo: "/ieeetems.png", stats: [{ big: "100+", small: "MEMBERS" }, { big: "+20%", small: "ENGAGEMENT" }, { big: "250+", small: "PARTICIPANTS" }], text: "Led a 100+ member chapter, overseeing multiple technical initiatives and driving a 20% increase in engagement through a mentorship program. Coordinated cross-team efforts and helped organize CodeRush 3.0 and HackXpertise 2.0 at graVITas'25, attracting 250+ participants." },
  { org: "VinnovateIT", role: "Project Manager", when: "VIT VELLORE", take: "VIT", bg: "#BFEA88", ink: "#111111", accent: "#111111", roleSize: 44, tilt: 1, text: "Project manager at VinnovateIT, VIT's tech and innovation club: planning the club's projects and keeping the teams building them on track." },
  { org: "NTT DATA", role: "Summer Intern", when: "SUMMER 2026", take: "2026", bg: "#74D4F0", ink: "#111111", accent: "#111111", roleSize: 50, tilt: -1.5, logo: "/nttdata.png", text: "Summer intern at NTT DATA in 2026." },
];
