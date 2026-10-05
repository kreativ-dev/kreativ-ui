import { createContext, useContext } from "react";
import type { LoaderAnimation, LoaderRepresentation } from "./Loader.types";

export type LoaderContextValue = {
  loading: boolean;
  representation: LoaderRepresentation;
  animation: LoaderAnimation;
};

const defaultValue: LoaderContextValue = {
  loading: false,
  representation: "skeleton",
  animation: "pulse",
};

export const LoaderContext = createContext<LoaderContextValue>(defaultValue);

export function useLoaderContext(): LoaderContextValue {
  return useContext(LoaderContext);
}
