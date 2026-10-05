import { ColorMode } from "@/types";
import { Sun, Moon, Monitor } from "lucide-react";
import { ReactNode } from "react";

export interface ModeIcon {
  key: ColorMode;
  label: string;
  icon: ReactNode;
}

export const getModeIcons = (allowSystem: boolean, labels: any, icons: any) => {
  const modes: ModeIcon[] = [
    {
      key: "light",
      label: labels?.light ?? "Light",
      icon: icons?.light ?? <Sun />,
    },
    {
      key: "dark",
      label: labels?.dark ?? "Dark",
      icon: icons?.dark ?? <Moon />,
    },
  ];
  if (allowSystem) {
    modes.push({
      key: "system",
      label: labels?.system ?? "System",
      icon: icons?.system ?? <Monitor />,
    });
  }
  return modes;
};
