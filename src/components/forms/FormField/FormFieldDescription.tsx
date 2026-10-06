import { useFormField } from "./FormField.context";

export function FormFieldDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  const { descriptionId } = useFormField();

  return (
    <p id={descriptionId} className="text-sm text-kui-text-muted">
      {children}
    </p>
  );
}
