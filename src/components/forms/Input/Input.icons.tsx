import {
  Mail,
  Phone,
  Link2,
  Search,
  Hash,
  Lock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import type { InputKind } from "./Input.types";

export const inputKindIcons: Partial<
  Record<InputKind, React.ComponentType<{}>>
> = {
  email: Mail,
  tel: Phone,
  url: Link2,
  search: Search,
  numeric: Hash,
  "password-current": Lock,
  "password-new": Lock,
};

export function Spinner({ size = 14 }: { size?: number | string }) {
  return (
    <span
      className="animate-kui-spin rounded-full border-2 border-inherit border-t-transparent shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export { Eye, EyeOff, X as ClearIcon };
