"use client";

import { useId, useState } from "react";
import { cn } from "@/utils/cn";
import { SelectGroupContext } from "./Select.context";
import type { SelectGroupProps } from "./Select.types";

export function SelectGroup({ children, className }: SelectGroupProps) {
    const fallbackId = useId();
    const [labelId, setLabelId] = useState<string | undefined>(undefined);

    return (
        <SelectGroupContext.Provider value={{ labelId: labelId ?? fallbackId, setHasLabel: setLabelId }}>
            <div role="group" aria-labelledby={labelId} className={cn("py-1", className)}>
                {children}
            </div>
        </SelectGroupContext.Provider>
    );
}