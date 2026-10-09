"use client";

import * as React from "react";

import {
  createComponent,
  hasKuiMeta,
  composeRefs,
  ReportedValidity,
} from "@splenddev/kreativ-core";

import { useFormField } from "./FormField.context";
import { useFormContext } from "../form/Form.context";
import { isDev } from "@/utils/env";
import { FormControlProps } from "../form/Form.types";

export interface FormFieldControlProps {
  children: React.ReactElement;
}

function readNativeValidity(
  el: HTMLElement,
): ReportedValidity | null | undefined {
  const validatable = el as HTMLElement & {
    validity?: ValidityState;
    checkValidity?: () => boolean;
    validationMessage?: string;
  };

  if (!validatable.checkValidity || !validatable.validity) return undefined;

  return validatable.validity.valid
    ? null
    : { invalid: true, message: validatable.validationMessage };
}

function sameValidity(
  prev: ReportedValidity | null | undefined,
  next: ReportedValidity | null,
) {
  return (
    (prev === null && next === null) ||
    (prev?.invalid === next?.invalid && prev?.message === next?.message)
  );
}

export const FormFieldControl = createComponent<FormFieldControlProps, unknown>(
  {
    displayName: "FormField.Control",

    __kui: {
      role: "layout",
      groupSlot: "FormField",
      skeleton: "preserve",
    },

    render({ children }, forwardedRef) {
      const ctx = useFormField("FormField.Control");
      const form = useFormContext();
      const controlRef = React.useRef<HTMLElement | null>(null);
      const [node, setNode] = React.useState<HTMLElement | null>(null);
      const lastReportedRef = React.useRef<ReportedValidity | null | undefined>(
        undefined,
      );

      if (!React.isValidElement(children)) {
        throw new Error(
          "[kreativ-ui/FormField.Control]: requires exactly one React element child.",
        );
      }

      const child = children as React.ReactElement<Record<string, unknown>>;
      const childType = child.type;

      if (isDev() && !hasKuiMeta(childType)) {
        console.warn(
          "[kreativ-ui/FormField.Control]: child component doesn't carry Kreativ UI's __kui metadata. " +
            "Make sure it forwards both the injected form-control props (id, aria-invalid, " +
            "aria-required, aria-describedby, disabled) AND its ref to its own actual interactive " +
            "element, or it may not wire up to the field correctly.",
        );
      }

      const existingDescribedBy = child.props["aria-describedby"] as
        | string
        | undefined;

      const mergedDescribedBy =
        [existingDescribedBy, ctx.describedBy].filter(Boolean).join(" ") ||
        undefined;

      const shouldValidateOnChange =
        ctx.validateOn === "change" || ctx.validateOn === "both";

      const existingOnChange = child.props.onChange as
        | ((e: React.ChangeEvent<HTMLInputElement>) => void)
        | undefined;

      const reportIfChanged = React.useCallback(
        (next: ReportedValidity | null, defer: boolean) => {
          if (sameValidity(lastReportedRef.current, next)) return;

          lastReportedRef.current = next;

          if (defer) {
            queueMicrotask(() => ctx.reportValidity(next));
          } else {
            ctx.reportValidity(next);
          }
        },
        [ctx.reportValidity],
      );

      const injectedProps: FormControlProps & {
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      } = {
        id: ctx.id,
        "aria-invalid": ctx.invalid || undefined,
        "aria-required": ctx.required || undefined,
        "aria-describedby": mergedDescribedBy,
        disabled: Boolean(ctx.disabled),
        ...(shouldValidateOnChange && {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            existingOnChange?.(e);
            const next = readNativeValidity(e.target);
            if (next === undefined) return;
            reportIfChanged(next, false);
          },
        }),
      };

      const formValueProps: Record<string, unknown> = {};

      if (ctx.name && form) {
        const convention = ctx.valuePropConvention ?? "value";

        if (convention === "checked") {
          const existingOnCheckedChange = child.props.onCheckedChange as
            | ((checked: boolean) => void)
            | undefined;

          formValueProps.checked =
            (child.props.checked as boolean | undefined) ??
            form.getValue(ctx.name);

          formValueProps.onCheckedChange = (checked: boolean) => {
            existingOnCheckedChange?.(checked);
            form.setValue(ctx.name!, checked);
          };
        } else {
          const existingOnValueChange = child.props.onValueChange as
            | ((value: unknown) => void)
            | undefined;

          formValueProps.value = child.props.value ?? form.getValue(ctx.name);

          formValueProps.onValueChange = (value: unknown) => {
            existingOnValueChange?.(value);
            form.setValue(ctx.name!, value);
          };
        }
      }

      const nodeRef = React.useCallback((n: HTMLElement | null) => {
        controlRef.current = n;
        setNode((prev) => (prev === n ? prev : n));
      }, []);

      React.useEffect(() => {
        if (!node) return;
        if (readNativeValidity(node) === undefined) return;

        const handle = () => {
          const next = readNativeValidity(node);
          if (next === undefined) return;
          reportIfChanged(next, true);
        };

        node.addEventListener("invalid", handle);

        if (ctx.validateOn === "blur" || ctx.validateOn === "both") {
          node.addEventListener("blur", handle);
        }

        return () => {
          node.removeEventListener("invalid", handle);
          node.removeEventListener("blur", handle);
        };
      }, [node, ctx.validateOn, reportIfChanged]);

      const childRef = (child as unknown as { ref?: React.Ref<unknown> }).ref;

      const composedRef = React.useMemo(
        () => composeRefs(childRef, forwardedRef, nodeRef),
        [childRef, forwardedRef, nodeRef],
      );

      return React.cloneElement(child, {
        ...formValueProps,
        ...injectedProps,
        ref: composedRef,
      });
    },
  },
);
