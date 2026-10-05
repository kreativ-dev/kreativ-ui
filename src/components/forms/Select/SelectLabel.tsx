"use client";

import { useContext, useEffect, useId } from "react";
import { cn } from "@/utils/cn";
import { SelectGroupContext } from "./Select.context";
import type { SelectLabelProps } from "./Select.types";

export function SelectLabel({ children, className }: SelectLabelProps) {
    const id = useId();
    const group = useContext(SelectGroupContext);

    useEffect(() => {
        group?.setHasLabel(id);
    }, [group, id]);

    return (
        <div id={id} className={cn("px-2.5 py-1.5 font-mono text-[11px] text-text-muted", className)}>
            {children}
        </div>
    );
}