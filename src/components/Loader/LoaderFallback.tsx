import type { LoaderRepresentation, LoaderAnimation } from "./Loader.types";

export type LoaderFallbackProps = {
  representation: LoaderRepresentation;
  animation?: LoaderAnimation;
  progress?: number;
};

/** Renders the non-skeleton representations, plus the no-shape-available skeleton fallback. */
export function LoaderFallback({
  representation,
  animation = "none",
  progress,
}: LoaderFallbackProps) {
  switch (representation) {
    case "spinner":
      return (
        <span
          className={[
            "kui-spinner",
            animation !== "none" ? "kui-spinner-spin" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
          aria-label="Loading"
        />
      );

    case "progress":
      return (
        <div
          className="kui-progress-track"
          role="progressbar"
          aria-valuenow={progress ?? undefined}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="kui-progress-fill"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      );

    case "empty":
      return null;

    case "skeleton":
      return (
        <span
          className="kui-skeleton-block kui-skeleton-pulse"
          style={{
            width: "100%",
            height: "1rem",
            borderRadius: "var(--kui-radius-sm)",
          }}
        />
      );

    default:
      return null;
  }
}
