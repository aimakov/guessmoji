import { type ThemeConfig } from "@chakra-ui/react";
import localFont from "next/font/local";

export const brandColors = {
  brand: {
    light: "#FFF1EA",
    dark: "#211C1D",
    primary: "#81B3F4",
    secondary: "#7B9EE6",
    secondaryAlt: "#8FD3F4",
    darkBlue: "#1D3557",
    lavender: "#FFF5F4",
    lightGrey: "#F3F3F3",
    darkGrey: "#626873",
    red: "#F16B6F",
    yellow: "#F9CA24",
    cream: "#FFE29F",
    peach: "#FFA99F",
    lilac: "#A9C9FF",
    teal: "#00ABBB",
    mediumBlue: "#547BE6",
    chakraBorderDark: "#626873",
    chakraBorderLight: "#E2E8F0",
    selectDropdownLight: "#1A202C",
    selectDropdownDark: "#EBEBEB",
    orange: "#FBBB7E",
    lightMale: "#81B3F4",
    darkMale: "#ACD6F2",
    lightFemale: "#F8BFC6",
    darkFemale: "#FACAD5",
    lightBlue: "#81B3F4",
    pink: "#F8BFC6",
    purple: "#D397F8",
    white: "#FFFFFF",
  },
};

export const themeColors = {
  bgLight: brandColors.brand.white,
  bgDark: brandColors.brand.dark, // Default Chakra dark bg
  bgDarkSecondary: brandColors.brand.dark,
  textLight: brandColors.brand.lavender,
  textDark: brandColors.brand.darkBlue,
  accentLight: brandColors.brand.lightGrey,
  accentDark: brandColors.brand.dark,
};

type ColorMode = { colorMode: string };

export const themeConfig: Record<string, ThemeConfig> = {
  config: {
    useSystemColorMode: true,
    initialColorMode: "system",
  },
};

export const rewardsConfig = {
  decay: 0.98,
  elementCount: 50,
  elementSize: 15,
  spread: 50,
  lifetime: 600,
  zIndex: -1,
};

export const breakpoints = {
  base: "0px",
  tablet: "768px",
  laptop: "992px",
  desktop: "1200px",
};

export const themedBg = (colorMode: string) => (colorMode === "dark" ? themeColors.bgDark : themeColors.bgLight);

export const themedText = (colorMode: string) => (colorMode === "dark" ? themeColors.textLight : themeColors.textDark);

export const themedAccent = (colorMode: string) => (colorMode === "dark" ? themeColors.accentDark : themeColors.accentLight);

export const satoshi = localFont({
  src: "../public/fonts/Satoshi/Fonts/WEB/fonts/Satoshi-Variable.woff2",
  display: "fallback",
});

export const fontFamily = `${satoshi.style.fontFamily}, sans-serif`;

export const customTheme = {
  ...themeConfig,
  breakpoints,
  styles: {
    global: ({ colorMode }: ColorMode) => ({
      fontSize: "18px",
      body: {
        fontFamily,
        ...(colorMode === "dark" ? { background: themeColors.bgDark } : { background: themeColors.bgLight }),

        // scrollBehavior: "smooth",
      },
      _highlight: {
        backgroundColor: brandColors.brand.primary,
      },
      a: {
        color: "brand.primary",
        textDecoration: "underline",

        _focusVisible: {
          boxShadow: `0 0 10px ${brandColors.brand.primary}`,
          outline: "none",
        },
      },
      '[tabindex="0"]': {
        _focusVisible: {
          borderColor: brandColors.brand.primary,
          boxShadow: `0 0 10px ${brandColors.brand.primary}`,
          outline: "none",
        },
      },
      "p,h1,h2,h3,h4,h5,h6": {
        color: colorMode === "dark" ? themeColors.textLight : themeColors.textDark,
        fontFamily,
      },
      ".chakra-checkbox__control": {
        borderRadius: "50% !important",
        bg: "transparent",
        borderColor: `${brandColors.brand.darkGrey} !important`,
        width: "30px !important",
        height: "30px !important",
        transition: "all 200ms ease !important",

        _hover: {
          borderColor: `${brandColors.brand.primary} !important`,
        },
        _focus: {
          borderColor: `${brandColors.brand.primary} !important`,
        },
        _checked: {
          borderColor: `${brandColors.brand.primary} !important`,
        },
      },
      ".chakra-modal__content-container": {
        overflow: "hidden",
      },
      "::selection": {
        // backgroundColor: brandColors.brand.primary,
        // color: colorMode === "dark" ? themeColors.textLight : themeColors.textDark,
        backgroundColor: brandColors.brand.primary,
        color: "white",
      },
      ".chakra-toast__inner": {
        maxWidth: "80% !important",
      },
    }),
  },
  colors: {
    ...themeColors,
    ...brandColors,
    custom: {
      500: "#81B3F4",
      200: "#81B3F4",
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily,
      },
    },
    Badge: {
      variants: {
        highlight: ({ colorMode }: ColorMode) => ({
          bg: "none",
          fontSize: "0.9rem",
          border: `1px solid ${colorMode === "dark" ? brandColors.brand.secondaryAlt : brandColors.brand.secondary}`,
          borderRadius: "20px",
          color: colorMode === "dark" ? brandColors.brand.secondaryAlt : brandColors.brand.secondary,
          textTransform: "none",
          fontWeight: 400,
          p: "1px 10px 2px",
          mr: "10px",
          mb: "10px",
        }),
        new: {
          fontSize: "0.9rem",
          bg: "brand.secondary",
          color: themeColors.textLight,
          borderRadius: "20px",
          p: "1px 10px",
        },
        alert: {
          fontSize: "0.9rem",
          bg: "brand.red",
          color: themeColors.textLight,
          borderRadius: "20px",
          p: "1px 10px",
        },
      },
    },
    Toast: {
      variants: {
        success: {
          background: `linear-gradient(to right, ${brandColors.brand.pink} 0%, ${brandColors.brand.cream}  100%) !important`,
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "50px",
        fontWeight: 700,
        height: "unset !important",
        minHeight: "unset !important",
        transitionProperty: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, background",

        _focus: {
          outline: "none",
          boxShadow: "none",
        },

        _focusVisible: {
          boxShadow: `0 0 10px ${brandColors.brand.primary}`,
          outline: "none",
        },
      },
      variants: {
        primary: {
          //   background: `linear-gradient(to right, ${brandColors.brand.lightBlue} 0%, ${brandColors.brand.pink}  100%)`,
          background: `linear-gradient(to right, ${brandColors.brand.orange} 0%, ${brandColors.brand.purple}  100%)`,
          padding: "15px 30px !important",
          letterSpacing: "0.5px",
          boxShadow: "0px 3px 12px 5px rgba(0,0,0,0.1)",
          border: "none !important",

          _hover: {
            boxShadow: "none !important",
          },

          _focus: {
            background: `linear-gradient(to right, ${brandColors.brand.orange} 0%, ${brandColors.brand.purple}  100%)`,
            border: "none",
          },

          _disabled: {
            _hover: {
              background: `linear-gradient(to right, ${brandColors.brand.lightBlue} 0%, ${brandColors.brand.pink}  100%) !important`,
            },
          },
        },
        primaryAlt: {
          background: `linear-gradient(to right, ${brandColors.brand.pink} 0%, ${brandColors.brand.cream}  100%)`,
          padding: "15px 30px !important",
          letterSpacing: "0.5px",
          boxShadow: "0px 3px 12px 5px rgba(0,0,0,0.1)",
          border: "none !important",
          color: brandColors.brand.darkBlue,

          _hover: {
            boxShadow: "none !important",
          },

          _focus: {
            background: `linear-gradient(to right, ${brandColors.brand.cream} 0%,  ${brandColors.brand.pink}  100%)`,
            border: "none",
          },

          _disabled: {
            _hover: {
              background: `linear-gradient(to right, ${brandColors.brand.pink} 0%, ${brandColors.brand.cream}  100%) !important`,
            },
          },
        },
        secondary: {
          bg: "clear",
          padding: "15px 30px !important",
          letterSpacing: "0.5px",
          border: `2px solid ${brandColors.brand.primary}`,
          color: brandColors.brand.primary,
        },
        tertiary: {
          bg: "clear",
          padding: "15px 30px !important",
          letterSpacing: "0.5px",
          border: `2px solid ${brandColors.brand.secondary}`,
          color: brandColors.brand.secondary,
        },
        badge: {
          color: "brand.red",
          borderRadius: "50%",
          height: "25px !important",
          width: "25px !important",
          maxHeight: "25px",
          maxWidth: "25px",
          padding: "0 !important",
          minWidth: "unset !important",
          marginRight: "-5px",
        },
        link: {
          background: "clear",
          border: "none",
          padding: "none",
          color: brandColors.brand.primary,
          textDecoration: "underline",
          maxHeight: "1rem",
        },
        nav: ({ colorMode }: ColorMode) => ({
          bg: themedBg(colorMode),
          transition: "all 200ms ease",
          minHeight: "100% !important",
          height: "unset",

          _hover: {
            bg: themedBg(colorMode),
          },

          _focus: {
            background: themedBg(colorMode),
            outline: "none",
            boxShadow: "none",
          },

          _active: {
            background: themedBg(colorMode),
            outline: "none",
          },
        }),
        cancel: ({ colorMode }: ColorMode) => ({
          bg: "transparent",
          border: `2px solid ${brandColors.brand.red}`,
          color: brandColors.brand.red,

          _hover: {
            bg: colorMode === "dark" ? themeColors.accentDark : themeColors.accentLight,
          },
        }),
      },
    },
    FormErrorMessage: {
      baseStyle: {
        fontSize: "1rem !important",
      },
    },
    Input: {
      variants: {
        rounded: {
          borderRadius: "50px",
          focusBorderColor: brandColors.brand.primary,
          bg: "transparent",
          borderColor: "red !important",
        },
      },
    },
    MenuButton: {
      baseStyle: {
        height: "unset !important",
        minHeight: "unset !important",
      },
    },
    Select: {
      sizes: {
        lg: {
          width: "30px",
          height: "30px",
        },
      },
    },
    Tabs: {
      variants: {
        "soft-rounded": ({ colorMode }: ColorMode) => ({
          tab: {
            flexDirection: { base: "column", tablet: "row" },
            bg: themedBg(colorMode),
            color: brandColors.brand.secondary,
            // border: { base: "none", tablet: "1px solid" },
            // borderTop: { base: "1px solid" },
            borderColor: brandColors.brand.secondary,
            transition: "all 200ms ease",
            fontSize: { base: "1rem", tablet: "1.2rem" },
            mx: { base: 0, tablet: "10px" },
            px: { base: "10px", tablet: "30px" },
            fontWeight: 500,
            position: "relative",
            width: { base: "calc(100% / 3)", tablet: "unset" },
            flexGrow: 1,
            borderRadius: { base: 0, tablet: "50px" },
            lineHeight: { base: "1.2", tablet: "1.5" },

            p: {
              ml: { base: 0, tablet: "10px" },
            },

            svg: {
              mb: { base: "5px", tablet: 0 },
            },

            // "&.tab__first": {
            //   borderRight: `1px solid ${brandColors.brand.secondary}`,
            // },

            // "&.tab__last": {
            //   borderLeft: `1px solid ${brandColors.brand.secondary}`,
            // },

            _hover: {
              color: brandColors.brand.primary,
              borderColor: brandColors.brand.primary,
            },

            _selected: {
              // background: `linear-gradient(to right, ${brandColors.brand.teal} 0%, ${brandColors.brand.mediumBlue}  100%)`,
              background: "transparent",
              borderColor: {
                base: brandColors.brand.secondary,
                tablet: colorMode === "dark" ? "black" : "transparent",
              },
              boxShadow: {
                base: "none",
                tablet: "0px 3px 12px 5px rgba(0,0,0,0.14)",
              },

              "&.tab__first": {
                borderColor: {
                  base: brandColors.brand.secondary,
                  tablet: colorMode === "dark" ? "black" : "transparent",
                },
              },

              "&.tab__last": {
                borderColor: {
                  base: brandColors.brand.secondary,
                  tablet: colorMode === "dark" ? "black" : "transparent",
                },
              },

              p: {
                color: "white",
              },

              svg: {
                path: {
                  stroke: "white",
                },
              },

              _hover: {
                color: brandColors.brand.darkBlue,
                borderColor: {
                  base: brandColors.brand.primary,
                  tablet: colorMode === "dark" ? "black" : "transparent",
                },
              },
            },
          },
        }),
      },
    },
  },
};
