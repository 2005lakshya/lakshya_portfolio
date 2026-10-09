import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { RecordScene } from "@/components/projects/crate/RecordScenes";
import { LabelIcon } from "@/components/projects/crate/LabelIcons";
import type { LabelIconKind, SceneKind } from "@/components/projects/crate/crateData";

/**
 * The site's record art (the scene on the back of each cover, the picture on each label) as images, so the 3D
 * room can paint the very same drawings onto its records and covers. Each is rendered once to SVG markup.
 */
function toImage(node: ReactNode): Promise<HTMLImageElement | null> {
  const box = document.createElement("div");
  const root = createRoot(box);
  flushSync(() => root.render(node));
  const svg = box.innerHTML.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  root.unmount();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export const sceneImage = (kind: SceneKind) => toImage(<RecordScene kind={kind} />);
export const labelIconImage = (kind: LabelIconKind) => toImage(<LabelIcon kind={kind} size={100} />);
