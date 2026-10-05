
export const defaultTransition = {
  type: "rotate",
  duration: 300,
  delay: 0,
  easing: "easeInOut",
} as const ;

export const getIconVariants = (type: string) => {
  switch (type) {
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

    case "slide":
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
      };

    case "scale":
      return {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.5 },
      };

    case "rotate":
      return {
        initial: {
          opacity: 0,
          rotate: -90,
          scale: 0.8,
        },
        animate: {
          opacity: 1,
          rotate: 0,
          scale: 1,
        },
        exit: {
          opacity: 0,
          rotate: 90,
          scale: 0.8,
        },
      };

    case "none":
    default:
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      };
  }
};

