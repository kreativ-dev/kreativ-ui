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

const PER_VIEW_OPTIONS = ["1", "1.5", "2", "2.5", "3"] as const;

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

const INDICATOR_VARIANT_OPTIONS = [
  "dots",
  "pill",
  "bars",
  "numbers",
  "fraction",
] as const;
type IndicatorVariant = (typeof INDICATOR_VARIANT_OPTIONS)[number];
const DEFAULT_INDICATOR_VARIANT: IndicatorVariant = "dots";

const DEFAULT_INTERVAL: Interval = "5000";
const DEFAULT_CONTROLS_PLACEMENT: ControlsPlacement = "overlay";
const DEFAULT_INDICATORS_PLACEMENT: IndicatorsPlacement = "below";
const VISIBILITY_PRESETS: Record<string, number[] | undefined> = {
  off: undefined,
  "[1, 0.5]": [1, 0.5],
  "[0.3, 1, 0.3]": [0.3, 1, 0.3],
  "[0.15, 1, 0.15]": [0.15, 1, 0.15],
  "[0.2, 1, 1, 0.2]": [0.2, 1, 1, 0.2],
};

export function CarouselPlayground() {
  const [slidesPerView, setSlidesPerView] = useState<PerView>("1");
  const VISIBILITY_OPTIONS = Object.keys(VISIBILITY_PRESETS);

  const [visibilityKey, setVisibilityKey] = useState("off");
  const visibility = VISIBILITY_PRESETS[visibilityKey];

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
  const [indicatorVariant, setIndicatorVariant] =
    useState<IndicatorVariant>("dots");

  // Live readout only: the carousel stays uncontrolled, like the generated code.
  const [index, setIndex] = useState(0);

  const perView = Number(slidesPerView);
  const count = Number(slideCount);
  const wholeSlides = visibility
    ? visibility.filter((v) => v >= 1).length
    : perView;

  // Changing the slide window remounts the carousel (see `key` below), so the readout resets with it.
  const changePerView = (v: PerView) => {
    setSlidesPerView(v);
    setIndex(0);
  };
  const changeCount = (v: SlideCount) => {
    setSlideCount(v);
    setIndex(0);
  };

  const start = visibility
    ? index
    : Math.max(Math.min(index, count - perView), 0);
  const first = Math.floor(start) + 1;
  const last = Math.min(
    visibility ? index + wholeSlides : Math.ceil(start + perView),
    count,
  );

  const code = useMemo(() => {
    const rootProps = [
      perView !== 1 ? `slidesPerView={${perView}}` : null,
      gap !== "0" ? `gap={${gap}}` : null,
      loop ? "loop" : null,
      autoplay ? "autoplay" : null,
      autoplay && autoplayInterval !== DEFAULT_INTERVAL
        ? `autoplayInterval={${autoplayInterval}}`
        : null,
      autoplay && !pauseOnHover ? "pauseOnHover={false}" : null,
      autoplay && !pauseOnFocus ? "pauseOnFocus={false}" : null,
      'aria-label="Featured slides"',
    ].filter(Boolean) as string[];

    const controlsAttr =
      controlsPlacement !== DEFAULT_CONTROLS_PLACEMENT
        ? ` placement="${controlsPlacement}"`
        : "";
    const indicatorAttrs = [
      indicatorVariant !== DEFAULT_INDICATOR_VARIANT
        ? `variant="${indicatorVariant}"`
        : null,
      indicatorsPlacement !== DEFAULT_INDICATORS_PLACEMENT
        ? `placement="${indicatorsPlacement}"`
        : null,
    ].filter(Boolean);
    const indicatorsAttr = indicatorAttrs.length
      ? ` ${indicatorAttrs.join(" ")}`
      : "";

    const shown = Math.min(count, 3);
    const slideLines = Array.from(
      { length: shown },
      (_, i) => `    <Carousel.Slide>Slide ${i + 1}</Carousel.Slide>`,
    );
    if (count > shown) slideLines.push(`    {/* …${count - shown} more */}`);

    return [
      "<Carousel.Root",
      ...rootProps.map((p) => `  ${p}`),
      ">",
      "  <Carousel.Viewport>",
      ...slideLines,
      "  </Carousel.Viewport>",
      controls ? `  <Carousel.Previous${controlsAttr} />` : null,
      controls ? `  <Carousel.Next${controlsAttr} />` : null,
      autoplay && playPause ? `  <Carousel.PlayPause${controlsAttr} />` : null,
      indicators ? `  <Carousel.Indicators${indicatorsAttr} />` : null,
      "</Carousel.Root>",
    ]
      .filter((l): l is string => l !== null)
      .join("\n");
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
                Previous / Next
              </Chip>
              <Chip
                active={indicators}
                onClick={() => setIndicators(!indicators)}
              >
                Indicators
              </Chip>
              <Chip
                active={playPause}
                onClick={() => setPlayPause(!playPause)}
                disabled={!autoplay}
              >
                PlayPause
              </Chip>
            </Flex>
          </div>
          <SegmentedControl
            label="slideVisibility"
            value={visibilityKey}
            options={VISIBILITY_OPTIONS}
            onChange={(v) => {
              setVisibilityKey(v);
              setIndex(0);
            }}
          />
          {(controls || (autoplay && playPause)) && (
            <SegmentedControl
              label="controls placement"
              value={controlsPlacement}
              options={[...CONTROLS_PLACEMENT_OPTIONS]}
              onChange={setControlsPlacement}
            />
          )}
          {indicators && (
            <>
              <SegmentedControl
                label="indicators placement"
                value={indicatorsPlacement}
                options={[...INDICATORS_PLACEMENT_OPTIONS]}
                onChange={setIndicatorsPlacement}
              />
              <SegmentedControl
                label="indicators variant"
                value={indicatorVariant}
                options={[...INDICATOR_VARIANT_OPTIONS]}
                onChange={setIndicatorVariant}
              />
            </>
          )}
        </div>
      }
      preview={
        <div className="w-full">
          <Carousel.Root
            key={`${slidesPerView}-${slideCount}`}
            slidesPerView={perView}
            gap={Number(gap)}
            loop={loop}
            autoplay={autoplay}
            autoplayInterval={Number(autoplayInterval)}
            pauseOnHover={pauseOnHover}
            pauseOnFocus={pauseOnFocus}
            onIndexChange={setIndex}
            aria-label="Featured slides"
            className="w-full"
            slideVisibility={visibility}
          >
            <Carousel.Viewport>
              {SLIDES.slice(0, count).map((s, i) => (
                <Carousel.Slide
                  key={i}
                  className={`flex min-h-36 items-center justify-center rounded-lg bg-linear-to-br ${s.from} ${s.to} text-lg font-medium text-white shadow-sm`}
                >
                  Slide {i + 1}
                </Carousel.Slide>
              ))}
            </Carousel.Viewport>

            {controls && (
              <>
                <Carousel.Previous placement={controlsPlacement} />
                <Carousel.Next placement={controlsPlacement} />
              </>
            )}
            {playPause && <Carousel.PlayPause placement={controlsPlacement} />}
            {indicators && (
              <Carousel.Indicators
                variant={indicatorVariant}
                placement={indicatorsPlacement}
              />
            )}
          </Carousel.Root>

          <p className="mt-3 font-mono text-[11px] text-kui-text-muted">
            showing {first}
            {last > first ? `–${last}` : ""} of {count}
          </p>
        </div>
      }
    />
  );
}
