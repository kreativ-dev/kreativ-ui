interface ResponsiveStyleProps {
  css?: string;
}

export function ResponsiveStyle({ css }: ResponsiveStyleProps) {
  if (!css) return null;

  return <style data-kui-responsive-style>{css}</style>;
}
