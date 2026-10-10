"use client";

import * as React from "react";

import { createComponent } from "@splenddev/kreativ-core";

import { FormContext, FormErrors, FormValues } from "./Form.context";
import { FormFieldError } from "../FormField/FormField.types";

export interface SchemaLike {
  safeParse: (values: FormValues) =>
    | { success: true; data: FormValues }
    | {
        success: false;
        error: {
          issues: Array<{ path: PropertyKey[]; message: string }>;
        };
      };
}

export type ManualValidator = (
  values: FormValues,
) => FormErrors | undefined | Promise<FormErrors | undefined>;

export interface FormRootProps {
  schema?: SchemaLike;
  validate?: ManualValidator;

  defaultValues?: FormValues;

  onSubmit?: (values: FormValues) => void | Promise<void>;
  onSubmitCapture?: (event: React.FormEvent<HTMLFormElement>) => void;
  scrollToFirstOnError?: boolean;

  className?: string;

  children: React.ReactNode;
}

export const FormRoot = createComponent<FormRootProps, HTMLFormElement>({
  displayName: "Form",
  __kui: {
    role: "formControl",
    formControl: "compound",
    skeleton: "preserve",
    video: {
      id: "form",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: (
    {
      schema,
      validate,
      defaultValues,
      onSubmit,
      onSubmitCapture,
      children,
      className,
      scrollToFirstOnError = true,
    },
    ref,
  ) => {
    const [values, setValues] = React.useState<FormValues>(defaultValues ?? {});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDirty, setIsDirty] = React.useState(false);

    const [schemaErrors, setSchemaErrors] = React.useState<FormErrors>({});
    const [liveErrors, setLiveErrors] = React.useState<FormErrors>({});
    const fieldElements = React.useRef<Map<string, HTMLElement>>(new Map());

    const registerField = React.useCallback(
      (name: string, element: HTMLElement | null) => {
        if (element) {
          fieldElements.current.set(name, element);
        } else {
          fieldElements.current.delete(name);
        }
      },
      [],
    );

    const errors = React.useMemo(
      () => ({ ...schemaErrors, ...liveErrors }),
      [schemaErrors, liveErrors],
    );

    const errorList = React.useMemo<FormFieldError[]>(
      () =>
        Object.entries(errors).map(([name, message]) => ({ name, message })),
      [errors],
    );

    const setValue = React.useCallback(
      (name: string, value: unknown) => {
        setValues((prev) => {
          const next = { ...prev, [name]: value };

          if (schema && schemaErrors[name] !== undefined) {
            const result = schema.safeParse(next);
            const issue = !result.success
              ? result.error.issues.find((i) => i.path.join(".") === name)
              : undefined;

            setSchemaErrors((prevErrors) => {
              if (issue) {
                if (prevErrors[name] === issue.message) return prevErrors;
                return { ...prevErrors, [name]: issue.message };
              }
              if (prevErrors[name] === undefined) return prevErrors;
              const { [name]: _, ...rest } = prevErrors;
              return rest;
            });
          }

          return next;
        });
        setIsDirty(true);
      },
      [schema, schemaErrors],
    );

    const getValue = React.useCallback(
      (name: string) => values[name],
      [values],
    );

    const setFieldError = React.useCallback(
      (name: string, message: React.ReactNode | undefined) => {
        setLiveErrors((prev) => {
          if (prev[name] === message) return prev;
          const next = { ...prev };
          if (message === undefined) {
            delete next[name];
          } else {
            next[name] = message;
          }
          return next;
        });
      },
      [],
    );

    const runValidation = React.useCallback(
      async (currentValues: FormValues): Promise<FormErrors> => {
        let collected: FormErrors = {};

        if (schema) {
          const result = schema.safeParse(currentValues);
          if (!result.success) {
            for (const issue of result.error.issues) {
              const key = issue.path.join(".");
              if (key && !collected[key]) {
                collected[key] = issue.message;
              }
            }
          }
        }

        if (validate) {
          const manualErrors = await validate(currentValues);
          if (manualErrors) {
            collected = { ...collected, ...manualErrors };
          }
        }

        return collected;
      },
      [schema, validate],
    );

    const submit = React.useCallback(() => {
      void (async () => {
        setIsSubmitting(true);
        try {
          const validationErrors = await runValidation(values);
          setSchemaErrors(validationErrors);

          const mergedErrors = { ...validationErrors, ...liveErrors };
          const stillInvalid = Object.keys(mergedErrors).length > 0;

          if (!stillInvalid) {
            await onSubmit?.(values);
          } else if (scrollToFirstOnError) {
            const firstErrorName = Object.keys(mergedErrors)[0];
            if (firstErrorName) {
              const el = fieldElements.current.get(firstErrorName);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        } finally {
          setIsSubmitting(false);
        }
      })();
    }, [runValidation, values, onSubmit, liveErrors]);

    const reset = React.useCallback(() => {
      setValues(defaultValues ?? {});
      setSchemaErrors({});
      setLiveErrors({});
      setIsDirty(false);
    }, [defaultValues]);

    const handleSubmit = React.useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        onSubmitCapture?.(event);
        event.preventDefault();
        submit();
      },
      [onSubmitCapture, submit],
    );

    const handleReset = React.useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        reset();
      },
      [reset],
    );

    const contextValue = React.useMemo(
      () => ({
        values,
        errors,
        isSubmitting,
        isDirty,
        setValue,
        getValue,
        setFieldError,
        submit,
        reset,
        schema,
        errorList,
        registerField,
      }),
      [
        values,
        errors,
        isSubmitting,
        isDirty,
        setValue,
        getValue,
        setFieldError,
        submit,
        reset,
        schema,
        errorList,
        registerField,
      ],
    );

    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          onReset={handleReset}
          noValidate
          className={className}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
});
