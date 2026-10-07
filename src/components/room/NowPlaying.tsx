import "@/components/projects/crate/recordCrate.css";
import type { CrateRecord } from "@/components/projects/crate/crateData";

const IMPACT = "Impact, Anton, 'Bebas Neue', sans-serif";
const MONO = "'Space Mono', monospace";
const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  record: CrateRecord;
  index: number;
  count: number;
  stopped: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  /** On a phone held upright the turntable and the crate are two views; this switches between them. */
  views?: { labels: string[]; at: number; go: (i: number) => void };
};

/**
 * What's on the record player, as the site's Projects section shows it: the equaliser and "Now playing", the
 * project's name in its colour, its links, and what it is. Plus the deck's controls, so you can change records
 * without digging through the crate. Compact on a phone, where the room needs the screen.
 */
export default function NowPlaying({ record, index, count, stopped, onPrev, onNext, onToggle, views }: Props) {
  const round = "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#333] bg-[#161616] text-[18px] text-[#F4F4F4] transition-colors hover:border-[#F4F4F4] md:h-11 md:w-11 md:text-[20px] short:h-9 short:w-9";
  const at = (step: number) => ({ animation: `rc-info-in 600ms cubic-bezier(0.16,1,0.3,1) ${200 + step * 70}ms backwards` });
  const long = record.upper.length > 10;
  return (
    <div data-safe="bottom" className="rc-root room-up absolute inset-x-3 bottom-3 z-30 mx-auto flex max-h-[36svh] max-w-[1080px] flex-col rounded-[18px] border border-[#262626] bg-[#0b0b0c]/90 p-4 pb-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-sm md:bottom-5 md:max-h-none md:flex-row md:gap-7 md:p-6 short:bottom-2 short:max-h-[44svh] short:gap-5 short:p-3.5">
      <span className="sr-only" aria-live="polite">{stopped ? "Paused" : "Now playing"}: {record.name}</span>
      <div key={`head-${index}`} className="flex shrink-0 flex-col gap-2 md:w-[340px] md:gap-2.5 short:w-[290px] short:gap-1.5">
        <div className="flex min-h-8 items-center justify-between gap-3" style={at(0)}>
          <div className="flex items-end gap-2.5">
            <div className={`flex h-4 items-end gap-[3px]${stopped ? " rc-paused" : ""}`} aria-hidden="true">
              {[0, 1, 2, 3].map((b) => (
                <span key={b} className="rc-eq-bar" style={{ width: 4, height: 16, background: record.textColor }} />
              ))}
            </div>
            <span className="whitespace-nowrap text-[14px] font-semibold text-[#9A9A9A]">{stopped ? "Paused" : "Now playing"}</span>
          </div>
          {views && (
            <div role="group" aria-label="Look at" className="flex rounded-full border border-[#262626] bg-[#161616] p-[3px]">
              {views.labels.map((l, i) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={views.at === i}
                  onClick={() => views.go(i)}
                  className={`h-[30px] rounded-full px-2.5 text-[10.5px] font-bold tracking-[1.2px] transition-colors ${views.at === i ? "bg-[#F4F4F4] text-[#111]" : "text-[#9A9A9A]"}`}
                  style={{ fontFamily: MONO }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-3" style={at(1)}>
          <div className={long ? "text-[30px] md:text-[38px] short:text-[28px]" : "text-[38px] md:text-[48px] short:text-[34px]"} style={{ fontFamily: IMPACT, lineHeight: 1, color: record.textColor }}>{record.upper}</div>
          <span className="text-[12px] font-bold tracking-[2px] text-[#6F6F6F] md:hidden" style={{ fontFamily: MONO }}>
            {pad(index + 1)} / {pad(count)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-2.5" style={at(2)}>
          {record.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="rc-pill flex h-9 items-center rounded-full border-[1.5px] border-[#F4F4F4] px-3.5 text-[13px] font-semibold text-[#F4F4F4] no-underline md:h-11 md:px-[18px] md:text-[14px] short:h-9 short:px-3.5 short:text-[13px]">
              {l.label}
            </a>
          ))}
          {/* the deck's controls: beside the links on a phone, a row of their own on a wide screen */}
          <div className="flex items-center gap-2 md:mt-1 md:w-full md:gap-2.5 short:mt-0">
            <button type="button" onClick={onPrev} aria-label="Previous record" className={round}>‹</button>
            <button type="button" onClick={onToggle} aria-pressed={stopped} className="rc-stop h-9 min-w-[64px] rounded-[10px] border-none bg-[#222] px-3 text-[13px] font-bold text-[#F4F4F4] md:h-11 md:min-w-[76px] md:px-3.5 short:h-9">
              {stopped ? "Play" : "Stop"}
            </button>
            <button type="button" onClick={onNext} aria-label="Next record" className={round}>›</button>
          </div>
        </div>
      </div>
      <div className="hidden w-px shrink-0 bg-[#262626] md:block" aria-hidden="true" />
      {/* on a phone the card stays small and this part scrolls, fading out where there's more */}
      <div key={`desc-${index}`} className="mt-3 flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto pb-5 [mask-image:linear-gradient(to_bottom,#000_calc(100%-22px),transparent)] md:mt-0 md:overflow-visible md:pb-0 md:[mask-image:none] short:overflow-y-auto short:pb-3 short:[mask-image:linear-gradient(to_bottom,#000_calc(100%-18px),transparent)]" style={at(4)}>
        <span className="hidden text-[12px] font-bold tracking-[2px] text-[#6F6F6F] md:block" style={{ fontFamily: MONO }}>
          RECORD {pad(index + 1)} / {pad(count)} · PICK ANOTHER FROM THE CRATE
        </span>
        <p className="m-0 text-[14px] leading-[1.55] text-[#D9D9D9] md:text-[15.5px] md:leading-[1.6] short:text-[13.5px] short:leading-[1.5]">{record.description}</p>
      </div>
    </div>
  );
}
