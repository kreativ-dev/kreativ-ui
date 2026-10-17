import { useState } from "react";
import { Card } from "@/components/layout/Card";
import { Select } from "@/components/forms/Select";
import { Switch } from "@/components/forms/Switch";
import type {
  CardVariant,
  CardSize,
  // CardLayout,
  CardMediaFit,
  CardMediaBlend,
  // CardOverlayDirection,
} from "@/components/layout/Card/Card.types";
import { Playground } from "./shared/Playground";
import { getAttrs } from "./shared/getAttributes";
import { Button, Flex, Grid } from "@/components";
import {
  CheckIcon,
  CopyCheck,
  PlusIcon,
  UserIcon,
  Verified,
} from "lucide-react";
import { cn } from "@/utils";

const variants: CardVariant[] = [
  "solid",
  "outline",
  "ghost",
  "elevated",
  "compact",
];
const sizes: CardSize[] = ["sm", "md", "lg"];
const mediaFits: CardMediaFit[] = ["cover", "contain", "fill", "none"];
const mediaBlends: CardMediaBlend[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
];
const features = [
  "Unlimited users",
  "Unlimited gros Objects",
  "10TB Storage",
  "2TB Video / Audio Traffic",
  "AI - TBD",
];

// Image 5 — "Top": avatar + name sit on the upper portion of a full-bleed
// photo, bookmark icon pinned top-right. The whole card IS the media —
// Card.Media is the sole child, everything else stacks inside it.
export function ProfileCardTop() {
  return (
    <Card variant="elevated" className="max-w-sm">
      <Card.Media src="/mountains.jpg" alt="" aspectRatio={4 / 3}>
        <Card.Overlay gradient="bottom" color="black" opacity={0.3} />

        <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90">
          🔖
        </button>

        <div className="absolute left-4 top-4 flex items-center gap-3">
          <img
            src="/avatar.jpg"
            alt=""
            className="h-10 w-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="font-medium text-white">Aiwanfo Faith</p>
            <p className="text-xs text-white/80">
              Designing for clarity &amp; usability
            </p>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-white/90">
            <span>⭐ 4.6 rating</span>
            <span>7 days duration</span>
            <span>$44/hr rate</span>
          </div>
          <button className="rounded-full bg-kui-ink px-4 py-1.5 text-xs font-medium text-white">
            Get in touch
          </button>
        </div>
      </Card.Media>
    </Card>
  );
}

// Image 5 — "Bottom": same photo, but the gradient fades from white at
// top-left (where the avatar/name sit, on a near-solid background) toward
// the photo becoming visible lower-right — the inverse direction scrim.
export function ProfileCardBottom() {
  return (
    <Card variant="elevated" className="max-w-sm">
      <Card.Media
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&fit=crop"
        alt=""
        aspectRatio={4 / 3}
      >
        <Card.Overlay
          style={{
            backgroundImage:
              "linear-gradient(135deg, white 0%, white 35%, transparent 75%)",
          }}
        />

        <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90">
          🔖
        </button>

        <div className="absolute left-4 top-4 flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=340&fit=crop"
            alt=""
            className="h-10 w-10 rounded-full border-2 border-kui-border"
          />
          <div>
            <p className="font-medium">Aiwanfo Faith</p>
            <p className="text-xs text-muted">
              Designing for clarity &amp; usability
            </p>
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>⭐ 4.6 rating</span>
            <span>7 days duration</span>
            <span>$44/hr rate</span>
          </div>
          <button className="rounded-full bg-white px-4 py-1.5 text-xs font-medium shadow">
            Get in touch
          </button>
        </div>
      </Card.Media>
      <Card.Footer></Card.Footer>
    </Card>
  );
}

export function PricingCardFlat() {
  return (
    <Card variant="elevated" className="max-w-xs">
      <Card.Header>
        <span className="text-sm text-muted">Legendary</span>
      </Card.Header>

      <Card.Body>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold">$399</span>
          <span className="text-sm text-muted">.99/monthly</span>
        </div>
        <p className="mt-2 text-sm text-muted">
          Best for large multiple teams that need maximum capabilities.
        </p>
        <button className="mt-4 w-full rounded-full bg-kui-ink py-2 text-sm font-medium text-white">
          Start Free
        </button>
      </Card.Body>

      <Card.Footer className="flex-col items-start gap-2">
        <FeatureRow label="Unlimited users" />
        <FeatureRow label="Unlimited gros Objects" />
        <FeatureRow label="10TB Storage" />
        <FeatureRow label="2TB Video / Audio Traffic" />
        <FeatureRow label="AI - TBD" />
      </Card.Footer>
    </Card>
  );
}

function PricingCardGradientHeader() {
  return (
    <Card variant="elevated" className="max-w-xs p-2 mt-4">
      <Card.Header className="flex-col items-start rounded-2xl overflow-hidden relative border border-kui-border">
        <Card.Overlay gradient="right" color="oklch(0.75 0.15 350)" />
        <div className="relative">
          <span className="text-sm text-muted">Legendary</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold">$399</span>
            <span className="text-sm text-muted">.99/monthly</span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Best for large multiple teams that need maximum capabilities.
          </p>
          <Button className="mt-4" fullWidth size="" >
            Start Free
          </Button>
        </div>
      </Card.Header>

      <Card.Footer className="flex-col items-start gap-2">
        <FeatureRow label="Unlimited users" />
        <FeatureRow label="Unlimited gros Objects" />
        <FeatureRow label="10TB Storage" />
        <FeatureRow label="2TB Video / Audio Traffic" />
        <FeatureRow label="AI - TBD" />
      </Card.Footer>
    </Card>
  );
}

function FeatureRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>✓</span>
      <span>{label}</span>
    </div>
  );
}

export function CardPlayground() {
  return (
    <>
      <ProfileCardTop />
      <ProfileCardBottom />
      <PricingCardFlat />
      <PricingCardGradientHeader />
    </>
  );
}
