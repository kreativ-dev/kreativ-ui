<<<<<<< HEAD
import { Typography } from "@/types";

export const defaultTypography: Typography = {
  body: {
    fontFamily: "{fonts.body}",
    fontSize: "{fontSizes.md}",
=======
import { defineTypography } from "../typography";

export const defaultTypography = defineTypography({
  body: {
    fontFamily: "{fonts.body}",
>>>>>>> refactoring
    fontWeight: "{fontWeights.normal}",
    lineHeight: "{lineHeights.normal}",
  },

  bodySmall: {
    fontFamily: "{fonts.body}",
<<<<<<< HEAD
    fontSize: "{fontSizes.sm}",
=======
>>>>>>> refactoring
    fontWeight: "{fontWeights.normal}",
    lineHeight: "{lineHeights.normal}",
  },

  heading: {
    fontFamily: "{fonts.heading}",
    fontSize: "{fontSizes.2xl}",
    fontWeight: "{fontWeights.bold}",
    lineHeight: "{lineHeights.tight}",
  },

  headingSmall: {
    fontFamily: "{fonts.heading}",
    fontSize: "{fontSizes.xl}",
    fontWeight: "{fontWeights.semibold}",
    lineHeight: "{lineHeights.tight}",
  },

<<<<<<< HEAD
=======
  label: {
    fontFamily: "{fonts.body}",
    fontWeight: "{fontWeights.medium}",
    lineHeight: "{lineHeights.normal}",
  },

>>>>>>> refactoring
  caption: {
    fontFamily: "{fonts.body}",
    fontSize: "{fontSizes.xs}",
    fontWeight: "{fontWeights.normal}",
    lineHeight: "{lineHeights.normal}",
  },

  mono: {
    fontFamily: "{fonts.mono}",
    fontSize: "{fontSizes.xs}",
    fontWeight: "{fontWeights.normal}",
    lineHeight: "{lineHeights.normal}",
  },
<<<<<<< HEAD
};
=======
});
>>>>>>> refactoring
