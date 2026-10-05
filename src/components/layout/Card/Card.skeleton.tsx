// src/components/Card/Card.skeleton.ts
//
// Lives inside the Card component folder, next to Card.tsx/Card.types.ts.
// Imports FROM Loader — Loader never imports FROM Card. Keeps Loader a
// leaf dependency, same direction as recipe registration.

import {
  defineSkeleton,
  registerSkeleton,
  tagKuiComponent,
} from "@/components/Loader";
import { Card } from "./Card";
import type { CardProps } from "./Card.types";

tagKuiComponent(Card, {
  name: "Card",
  usesSizeScale: true,
  slots: ["avatar", "text"],
});

export const cardSkeleton = defineSkeleton<CardProps>(
  (props) => ({
    avatar: props.hasImage ? { size: "md", shape: "square" } : false,
    rows: props.variant === "compact" ? 1 : 3,
    width: props.fullWidth ? "100%" : props.size === "sm" ? 200 : 320,
  }),
  { defaults: { rows: 2, avatar: false, width: 280 } },
);

registerSkeleton(Card, cardSkeleton);
