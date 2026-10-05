import type { SkeletonShape, LoaderAnimation } from "./Loader.types";
import { useLoaderContext } from "./Loader.context";

export type LoaderSkeletonProps = SkeletonShape & {
  animation?: LoaderAnimation;
  className?: string;
};

const animationClass: Record<LoaderAnimation, string> = {
  none: "",
  pulse: "animate-pulse",
  shimmer: "kui-skeleton-shimmer", // custom keyframe, not a Tailwind core utility
};

const avatarSizeClass: Record<"xs" | "sm" | "md", string> = {
  xs: "size-5",
  sm: "size-8",
  md: "size-10",
};

/**
 * The only thing in the system that turns a SkeletonShape into markup +
 * animation. Every skeleton (explicit, registered, or generated) routes
 * through here.
 */
export function LoaderSkeleton({
  rows,
  avatar,
  width,
  height,
  radius,
  gap,
  animation: animationProp,
  className,
}: LoaderSkeletonProps) {
  const ctx = useLoaderContext();
  const animation = animationProp ?? ctx.animation;
  const animClass = animationClass[animation];

  const avatarConfig =
    avatar === true
      ? { size: "sm" as const, shape: "circle" as const }
      : avatar || null;

  const avatarSize = avatarConfig?.size ?? "sm";
  const avatarShape = avatarConfig?.shape ?? "circle";

  return (
    <div
      className={[
        "flex items-center kui-skeleton-root",
        rows ? "items-start" : "items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ gap: gap ?? "var(--kui-space-sm)" }}
      role="status"
      aria-label="Loading"
    >
      {avatarConfig && (
        <span
          className={[
            "kui-skeleton-block shrink-0 bg-surface-sunken",
            avatarSizeClass[avatarSize],
            avatarShape === "circle"
              ? "rounded-full"
              : "rounded-(--kui-radii-md)",
            animClass,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}

      <div className="flex flex-1 flex-col gap-(--kui-spacing-xs)">
        {rows && rows > 0 ? (
          Array.from({ length: rows }).map((_, i) => (
            <span
              key={i}
              className={[
                "kui-skeleton-block bg-(--kui-surface-sunken)",
                animClass,
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                width: i === (rows ?? 1) - 1 ? "70%" : (width ?? "100%"),
                height: height ?? "0.875rem",
                borderRadius: radius ?? "var(--kui-radii-sm)",
              }}
            />
          ))
        ) : (
          <span
            className={[
              "kui-skeleton-block bg-(--kui-surface-sunken)",
              animClass,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              width: width ?? "100%",
              height: height ?? "1rem",
              borderRadius: radius ?? "var(--kui-radius-sm)",
            }}
          />
        )}
      </div>
    </div>
  );
}
