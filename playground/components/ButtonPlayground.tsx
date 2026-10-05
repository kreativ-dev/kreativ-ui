import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { MailIcon, PlusIcon, SearchIcon } from "lucide-react";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { Playground } from "./shared/Playground";
import type { ResponsiveValue } from "@/types";
import { ButtonColor, ButtonVariant } from "@/components/Button/Button.types";
import { getAttrs } from "./shared/getAttributes";
import { buttonColors, buttonVariants } from "@/theme/defaults/recipes/button";
import { useSizes } from "@/hooks";

type Size = string;

const VARIANTS = Object.keys(buttonVariants) as ButtonVariant[];
const COLORS = Object.keys(buttonColors) as ButtonColor[];

export function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>("solid");
  const [color, setColor] = useState<ButtonColor>("brand");

  const [responsive, setResponsive] = useState(false);

  const [size, setSize] = useState<Size>("md");
  const [baseSize, setBaseSize] = useState<Size>("sm");
  const [mdSize, setMdSize] = useState<Size>("md");
  const [lgSize, setLgSize] = useState<Size>("lg");

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [leftIcon, setLeftIcon] = useState(false);
  const [rightIcon, setRightIcon] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);
  const [useRender, setUseRender] = useState(false);


  const availableSizes = useSizes();

  const responsiveSize: ResponsiveValue<Size> = {
    base: baseSize,
    md: mdSize,
    lg: lgSize,
  };

  const resolvedSize: ResponsiveValue<Size> = responsive
    ? responsiveSize
    : size;

  const controls = (
    <>
      <SegmentedControl
        label="variant"
        value={variant}
        options={VARIANTS}
        onChange={setVariant}
      />

      <SegmentedControl
        label="color"
        value={color}
        options={COLORS}
        onChange={setColor}
      />

      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">size</p>

        <div className="mb-2 flex gap-2">
          <Chip active={!responsive} onClick={() => setResponsive(false)}>
            fixed
          </Chip>

          <Chip active={responsive} onClick={() => setResponsive(true)}>
            responsive
          </Chip>
        </div>

        {!responsive ? (
          <SegmentedControl
            label=""
            value={size}
            options={availableSizes}
            onChange={setSize}
          />
        ) : (
          <div className="space-y-3">
            <SegmentedControl
              label="base"
              value={baseSize}
              options={availableSizes}
              onChange={setBaseSize}
            />

            <SegmentedControl
              label="md"
              value={mdSize}
              options={availableSizes}
              onChange={setMdSize}
            />

            <SegmentedControl
              label="lg"
              value={lgSize}
              options={availableSizes}
              onChange={setLgSize}
            />
          </div>
        )}
      </div>

      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">flags</p>

        <div className="flex flex-wrap gap-1.5">
          <Chip active={isLoading} onClick={() => setIsLoading((v) => !v)}>
            isLoading
          </Chip>

          <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
            disabled
          </Chip>

          <Chip active={fullWidth} onClick={() => setFullWidth((v) => !v)}>
            fullWidth
          </Chip>

          <Chip active={leftIcon} onClick={() => setLeftIcon((v) => !v)}>
            leftIcon
          </Chip>

          <Chip active={rightIcon} onClick={() => setRightIcon((v) => !v)}>
            rightIcon
          </Chip>

          <Chip active={iconOnly} onClick={() => setIconOnly((v) => !v)}>
            iconOnly
          </Chip>

          <Chip active={useRender} onClick={() => setUseRender((v) => !v)}>
            custom render
          </Chip>
        </div>
      </div>
    </>
  );

  const buttonProps = {
    variant,
    size: resolvedSize,
    isLoading,
    disabled,
    color,
    fullWidth,
    leftIcon: leftIcon ? <SearchIcon className="h-4 w-4" /> : undefined,
    rightIcon: rightIcon ? <MailIcon className="h-4 w-4" /> : undefined,
    iconOnly,
  };

  const preview = (
    <Button
      {...buttonProps}
      render={
        useRender
          ? (props) => (
              <a {...props} href="#" onClick={(e) => e.preventDefault()} />
            )
          : undefined
      }
    >
      {iconOnly ? <PlusIcon className="h-4 w-4" /> : "Button"}
    </Button>
  );

  const sizeCode = responsiveSize
    ? `size={${JSON.stringify(responsiveSize)}}`
    : size !== "md"
      ? `size="${size}"`
      : undefined;

  const attrLines = [
    variant !== "solid" && `variant="${variant}"`,
    color !== "brand" && `color="${color}"`,
    sizeCode,
    isLoading && "isLoading",
    disabled && "disabled",
    fullWidth && "fullWidth",
    leftIcon && "leftIcon={<SearchIcon />}",
    rightIcon && "rightIcon={<MailIcon />}",
    iconOnly && "iconOnly",
    useRender && `render={(props) => <a {...props} href="/docs" />}`,
  ].filter(Boolean) as string[];

  const code = [
    `<Button`,
    attrLines.length ? `  ${attrLines.join("\n  ")}` : "",
    `>`,
    iconOnly ? `  <PlusIcon />` : `  Button`,
    `</Button>`,
  ]
    .filter(Boolean)
    .join("\n");

  const extraAttributes = [
    "tag",
    "aria-disabled",
    "aria-busy",
    "aria-pressed",
    "type",
  ];

  const excludeAttributes = ["aria-invalid", "aria-describedby"];

  return (
    <Playground
      title="Button"
      description="Live props against the real component — the readout at the bottom reflects the actual DOM attributes they produced, not a simulation."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={(el) => getAttrs(el, extraAttributes, excludeAttributes)}
    />
  );
}
