import { useComboboxContext } from "./Combobox.context";

interface ComboboxEmptyProps {
    children?: React.ReactNode;
    className?: string;
}

export function ComboboxEmpty({ children }: ComboboxEmptyProps) {
    const ctx = useComboboxContext("ComboboxEmpty");

    const visibleCount = [...ctx.items.values()]
        .filter(item => item.visible && !item.disabled)
        .length;

    if (visibleCount > 0) return null;

    return (
        <div className="px-2 py-3 text-center text-sm text-text-muted">
            {children ?? "No results found"}
        </div>
    );
}