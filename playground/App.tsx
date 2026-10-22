import ComponentsPlayground from "./components/ComponentsPlayground";
import { useState } from "react";
import { ThemeStudio } from "./components/ThemeStudio";
import { ThemeOverride } from "@splenddev/kreativ-core/types";
import { extendTheme } from "@/theme/extendTheme";
import { KreativUIProvider, PersistMode } from "@/provider";
import { Form } from "@/components/forms/form";
import { Button, Card, Flex, Grid } from "@/components";
import { profileSchema, profileUiSchema } from "./data/field-schema";
import { Eye, User, VerifiedIcon } from "lucide-react";
import { Text } from "@/components/typography/Text/Text";

export function App() {
  const [theme, setTheme] = useState<ThemeOverride>(() =>
    extendTheme({
      sizes: {
        xl: {
          height: "4.5rem",
          paddingX: "2.5rem",
          fontSize: "1.125rem",
          gap: "0.75rem",
          radius: "1rem",
          iconSize: "1.5rem",
        },
      },
    }),
  );

  return (
    <KreativUIProvider
      defaultMode="system"
      fallbackSize="lg"
      theme={theme}
      background="rgb(var(--kui-background, 255 255 255))"
      textColor="rgb(var(--kui-text, 0 0 0))"
    >
      <PersistMode/>
      <ThemeStudio
        theme={theme}
        onChange={(nextTheme) => {
          setTheme(extendTheme(nextTheme));
        }}
      />

      <ComponentsPlayground />
      <Form className="p-4 space-y-4" schema={profileSchema}>
        <Form.FromSchema uiSchema={profileUiSchema} />
        <Flex gap="sm">
          <Form.ResetButton>
            <Button variant="outline" color="neutral">
              Text
            </Button>
          </Form.ResetButton>
          <Form.SubmitButton>
            <Button>Submit</Button>
          </Form.SubmitButton>
        </Flex>
      </Form>
      <Grid className="p-4" columns={2}>
        <Card className="p-2.5">
          <Card.Media
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=340&fit=crop"
            alt="test"
            className="rounded h-45"
          />
          <Card.Body>
            <Card.Overlay color="rgba(0,0,0,0.4)" />
            <Card.Header className="justify-normal gap-2 text-xl font-bold mt-2">
              <span>clinton. </span>
              <VerifiedIcon color="lime" size={16} />
            </Card.Header>
            <Text clampLines={2} className="text-xs">
              I am a ui/ux designer. I use figma I am a ui/ux designer. I use
              figma I am a ui/ux designer. I use figma
            </Text>
          </Card.Body>
          <Card.Footer className="mt-2">
            <Flex className="justify-between flex-1">
              <Flex gap="md">
                {[
                  { icon: User, label: "18" },
                  { icon: Eye, label: "3.8k" },
                ].map((info) => (
                  <Flex align="center" gap="xs">
                    <info.icon size={16} />
                    {info.label}
                  </Flex>
                ))}
              </Flex>
              <Button size="sm" className="text-sm" color="black">
                Follow
              </Button>
            </Flex>
          </Card.Footer>
        </Card>
      </Grid>
    </KreativUIProvider>
  );
}
