"use client";

import { useMemo, useState } from "react";
import { Playground } from "./shared/Playground";
import { Carousel, Flex } from "@/components";
import { getAttrs } from "./shared/getAttributes";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";

const SLIDES = [
  { from: "from-rose-400", to: "to-rose-600" },
  { from: "from-orange-400", to: "to-orange-600" },
  { from: "from-amber-400", to: "to-amber-600" },
  { from: "from-emerald-400", to: "to-emerald-600" },
  { from: "from-sky-400", to: "to-sky-600" },
  { from: "from-violet-400", to: "to-violet-600" },
  { from: "from-pink-400", to: "to-pink-600" },
  { from: "from-teal-400", to: "to-teal-600" },
  { from: "from-indigo-400", to: "to-indigo-600" },
];

const CAROUSEL_ATTRS = [
  "role",
  "aria-roledescription",
  "aria-label",
  "data-autoplay",
];
const BASE_ATTRS_TO_EXCLUDE = [
  "id",
  "aria-invalid",
  "aria-describedby",
  "disabled",
];

const PER_VIEW_OPTIONS = ["1", "2", "3"] as const;
const COUNT_OPTIONS = ["1", "3", "6", "9"] as const;
const GAP_OPTIONS = ["0", "8", "12", "16", "24"] as const;
const INTERVAL_OPTIONS = ["1500", "3000", "5000"] as const;
const CONTROLS_PLACEMENT_OPTIONS = ["overlay", "inline"] as const;
const INDICATORS_PLACEMENT_OPTIONS = ["below", "overlay"] as const;

type PerView = (typeof PER_VIEW_OPTIONS)[number];
type SlideCount = (typeof COUNT_OPTIONS)[number];
type Gap = (typeof GAP_OPTIONS)[number];
type Interval = (typeof INTERVAL_OPTIONS)[number];
type ControlsPlacement = (typeof CONTROLS_PLACEMENT_OPTIONS)[number];
type IndicatorsPlacement = (typeof INDICATORS_PLACEMENT_OPTIONS)[number];

// Library defaults. Props equal to these are left out of the generated code.
const DEFAULT_INTERVAL: Interval = "5000";
const DEFAULT_CONTROLS_PLACEMENT: ControlsPlacement = "overlay";
const DEFAULT_INDICATORS_PLACEMENT: IndicatorsPlacement = "below";

export function CarouselPlayground() {
  const [slidesPerView, setSlidesPerView] = useState<PerView>("1");
  const [slideCount, setSlideCount] = useState<SlideCount>("6");
  const [gap, setGap] = useState<Gap>("12");
  const [loop, setLoop] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState<Interval>("3000");
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [pauseOnFocus, setPauseOnFocus] = useState(true);
  const [controls, setControls] = useState(true);
  const [indicators, setIndicators] = useState(true);
  const [playPause, setPlayPause] = useState(true);
  const [controlsPlacement, setControlsPlacement] =
    useState<ControlsPlacement>("overlay");
  const [indicatorsPlacement, setIndicatorsPlacement] =
    useState<IndicatorsPlacement>("below");

  // Live readout only: the carousel stays uncontrolled, like the generated code.
  const [index, setIndex] = useState(0);

  const perView = Number(slidesPerView);
  const count = Number(slideCount);

  // Changing the slide window remounts the carousel (see `key` below), so the readout resets with it.
  const changePerView = (v: PerView) => {
    setSlidesPerView(v);
    setIndex(0);
  };
  const changeCount = (v: SlideCount) => {
    setSlideCount(v);
    setIndex(0);
  };

  const first = index + 1;
  const last = Math.min(index + perView, count);

  const code = useMemo(() => {
    const props = [
      perView !== 1 ? `  slidesPerView={${perView}}` : null,
      gap !== "0" ? `  gap={${gap}}` : null,
      loop ? "  loop" : null,
      autoplay ? "  autoplay" : null,
      autoplay && autoplayInterval !== DEFAULT_INTERVAL
        ? `  autoplayInterval={${autoplayInterval}}`
        : null,
      autoplay && !pauseOnHover ? "  pauseOnHover={false}" : null,
      autoplay && !pauseOnFocus ? "  pauseOnFocus={false}" : null,
      !controls ? "  controls={false}" : null,
      controls && controlsPlacement !== DEFAULT_CONTROLS_PLACEMENT
        ? `  controlsPlacement="${controlsPlacement}"`
        : null,
      !indicators ? "  indicators={false}" : null,
      indicators && indicatorsPlacement !== DEFAULT_INDICATORS_PLACEMENT
        ? `  indicatorsPlacement="${indicatorsPlacement}"`
        : null,
      !playPause ? "  playPause={false}" : null,
      '  aria-label="Featured slides"',
    ].filter(Boolean) as string[];

    const shown = Math.min(count, 3);
    const slideLines = Array.from(
      { length: shown },
      (_, i) => `  <div>Slide ${i + 1}</div>`,
    );
    if (count > shown) slideLines.push(`  {/* …${count - shown} more */}`);

    return ["<Carousel", ...props, ">", ...slideLines, "</Carousel>"].join(
      "\n",
    );
  }, [
    perView,
    count,
    gap,
    loop,
    autoplay,
    autoplayInterval,
    pauseOnHover,
    pauseOnFocus,
    controls,
    controlsPlacement,
    indicators,
    indicatorsPlacement,
    playPause,
  ]);

  return (
    <Playground
      title="Carousel"
      description="Horizontal slide viewer with index ↔ scroll sync, loop, autoplay with pause-on-hover/focus, and indicators."
      attributeSelector="[aria-roledescription='carousel']"
      getAttributes={(el) => {
        const attrs = getAttrs(el, CAROUSEL_ATTRS, BASE_ATTRS_TO_EXCLUDE);
        // `data-autoplay` is a boolean-style attribute rendered as "" when on.
        return Object.fromEntries(
          Object.entries(attrs).map(([k, v]) => [k, v === "" ? "true" : v]),
        );
      }}
      code={code}
      controls={
        <div className="grid gap-4 text-sm">
          <SegmentedControl
            label="slidesPerView"
            value={slidesPerView}
            options={[...PER_VIEW_OPTIONS]}
            onChange={changePerView}
          />
          <SegmentedControl
            label="slides (demo only)"
            value={slideCount}
            options={[...COUNT_OPTIONS]}
            onChange={changeCount}
          />
          <SegmentedControl
            label="gap (px)"
            value={gap}
            options={[...GAP_OPTIONS]}
            onChange={setGap}
          />

          <div>
            <p className="mb-2 font-mono text-[11px] text-kui-text-muted">
              behavior
            </p>
            <Flex wrap="wrap" gap="sm">
              <Chip active={loop} onClick={() => setLoop(!loop)}>
                loop
              </Chip>
              <Chip active={autoplay} onClick={() => setAutoplay(!autoplay)}>
                autoplay
              </Chip>
              <Chip
                active={pauseOnHover}
                onClick={() => setPauseOnHover(!pauseOnHover)}
                disabled={!autoplay}
              >
                pauseOnHover
              </Chip>
              <Chip
                active={pauseOnFocus}
                onClick={() => setPauseOnFocus(!pauseOnFocus)}
                disabled={!autoplay}
              >
                pauseOnFocus
              </Chip>
            </Flex>
          </div>

          {autoplay && (
            <SegmentedControl
              label="autoplayInterval (ms)"
              value={autoplayInterval}
              options={[...INTERVAL_OPTIONS]}
              onChange={setAutoplayInterval}
            />
          )}

          <div>
            <p className="mb-2 font-mono text-[11px] text-kui-text-muted">
              parts
            </p>
            <Flex wrap="wrap" gap="sm">
              <Chip active={controls} onClick={() => setControls(!controls)}>
                controls
              </Chip>
              <Chip
                active={indicators}
                onClick={() => setIndicators(!indicators)}
              >
                indicators
              </Chip>
              <Chip
                active={playPause}
                onClick={() => setPlayPause(!playPause)}
                disabled={!autoplay}
              >
                playPause
              </Chip>
            </Flex>
          </div>

          {controls && (
            <SegmentedControl
              label="controlsPlacement"
              value={controlsPlacement}
              options={[...CONTROLS_PLACEMENT_OPTIONS]}
              onChange={setControlsPlacement}
            />
          )}
          {indicators && (
            <SegmentedControl
              label="indicatorsPlacement"
              value={indicatorsPlacement}
              options={[...INDICATORS_PLACEMENT_OPTIONS]}
              onChange={setIndicatorsPlacement}
            />
          )}
        </div>
      }
      preview={
        <div className="w-full">
          <Carousel
            key={`${slidesPerView}-${slideCount}`}
            slidesPerView={perView}
            gap={Number(gap)}
            loop={loop}
            autoplay={autoplay}
            autoplayInterval={Number(autoplayInterval)}
            pauseOnHover={pauseOnHover}
            pauseOnFocus={pauseOnFocus}
            controls={controls}
            indicators={indicators}
            playPause={playPause}
            controlsPlacement={controlsPlacement}
            indicatorsPlacement={indicatorsPlacement}
            onIndexChange={setIndex}
            aria-label="Featured slides"
            className="w-full"
          >
            {SLIDES.slice(0, count).map((s, i) => (
              <div
                key={i}
                className={`flex min-h-36 items-center justify-center rounded-lg bg-linear-to-br ${s.from} ${s.to} text-lg font-medium text-white shadow-sm`}
              >
                Slide {i + 1}
              </div>
            ))}
          </Carousel>
          <p className="mt-3 font-mono text-[11px] text-kui-text-muted">
            showing {first}
            {last > first ? `–${last}` : ""} of {count}
          </p>
        </div>
      }
    />
  );
}
