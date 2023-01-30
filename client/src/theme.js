// Light mode for all colors

import { createTheme } from "@mui/material";

// Dark mode for all colors
export const tokens = (mode) => ({
    ...(mode === "light"
        ? {
              primary: {
                  100: "#ffeed5",
                  200: "#ffdcac",
                  300: "#fecb82",
                  400: "#feb959",
                  500: "#fea82f",
                  600: "#cb8626",
                  700: "#98651c",
                  800: "#664313",
                  900: "#332209",
              },
              secondary: {
                  100: "#dddaf4",
                  200: "#bbb6e9",
                  300: "#9891de",
                  400: "#766dd3",
                  500: "#5448c8",
                  600: "#433aa0",
                  700: "#322b78",
                  800: "#221d50",
                  900: "#110e28",
              },

              neutralDark: {
                  100: "#d9d8d8",
                  200: "#b3b2b1",
                  300: "#8e8b89",
                  400: "#686562",
                  500: "#423e3b",
                  600: "#35322f",
                  700: "#282523",
                  800: "#1a1918",
                  900: "#0d0c0c",
              },
              neutralLight: {
                  100: "#fffff5",
                  200: "#ffffea",
                  300: "#fffee0",
                  400: "#fffed5",
                  500: "#fffecb",
                  600: "#cccba2",
                  700: "#99987a",
                  800: "#666651",
                  900: "#333329",
              },
              redAccent: {
                  100: "#ffd5cc",
                  200: "#ffab99",
                  300: "#ff8266",
                  400: "#ff5833",
                  500: "#ff2e00",
                  600: "#cc2500",
                  700: "#991c00",
                  800: "#661200",
                  900: "#330900",
              },
              borderSize: "2.5px",
              borderRadius: "3px",
          }
        : {
              primary: {
                  100: "#ffeed5",
                  200: "#ffdcac",
                  300: "#fecb82",
                  400: "#feb959",
                  500: "#fea82f",
                  600: "#cb8626",
                  700: "#98651c",
                  800: "#664313",
                  900: "#332209",
              },
              secondary: {
                  100: "#dddaf4",
                  200: "#bbb6e9",
                  300: "#9891de",
                  400: "#766dd3",
                  500: "#5448c8",
                  600: "#433aa0",
                  700: "#322b78",
                  800: "#221d50",
                  900: "#110e28",
              },

              neutralDark: {
                  100: "#d9d8d8",
                  200: "#b3b2b1",
                  300: "#8e8b89",
                  400: "#686562",
                  500: "#423e3b",
                  600: "#35322f",
                  700: "#282523",
                  800: "#1a1918",
                  900: "#0d0c0c",
              },
              neutralLight: {
                  100: "#fffff5",
                  200: "#ffffea",
                  300: "#fffee0",
                  400: "#fffed5",
                  500: "#fffecb",
                  600: "#cccba2",
                  700: "#99987a",
                  800: "#666651",
                  900: "#333329",
              },
              redAccent: {
                  100: "#ffd5cc",
                  200: "#ffab99",
                  300: "#ff8266",
                  400: "#ff5833",
                  500: "#ff2e00",
                  600: "#cc2500",
                  700: "#991c00",
                  800: "#661200",
                  900: "#330900",
              },
              borderSize: "2.5px",
              borderRadius: "3px",
          }),
});

export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === "light"
                ? {
                      primary: {
                          dark: colors.primary[700],
                          main: colors.primary[500],
                          light: colors.primary[100],
                      },
                      secondary: {
                          dark: colors.secondary[700],
                          main: colors.secondary[500],
                          light: colors.secondary[100],
                      },
                      error: {
                          dark: colors.redAccent[600],
                          main: colors.redAccent[500],
                          light: colors.redAccent[400],
                      },
                      neutral: {
                          dark: colors.neutralDark[700],
                          main: colors.neutralDark[500],
                          light: colors.neutralDark[100],
                      },
                      background: {
                          default: colors.neutralLight[500],
                      },
                  }
                : {
                      primary: {
                          dark: colors.primary[700],
                          main: colors.primary[500],
                          light: colors.primary[100],
                      },
                      secondary: {
                          dark: colors.secondary[700],
                          main: colors.secondary[500],
                          light: colors.secondary[100],
                      },
                      error: {
                          dark: colors.redAccent[600],
                          main: colors.redAccent[500],
                          light: colors.redAccent[400],
                      },
                      neutral: {
                          dark: colors.neutralDark[700],
                          main: colors.neutralDark[500],
                          light: colors.neutralDark[100],
                      },
                      background: {
                          default: colors.neutralLight[500],
                      },
                  }),
        },
        typography: {
            fontFamily: ["ProspectusProL", "sans-serif"].join(","),
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: 12,
            color: colors.neutralDark[500],
            hero: {
                fontFamily: ["ProspectusProXL", "sans-serif"].join(","),
                fontStyle: "italic",
                fontSize: 100,
                lineHeight: 1.1,
                color: colors.neutralDark[500],
            },
            h1: {
                fontFamily: ["ProspectusProL", "sans-serif"].join(","),
                fontWeight: "bolder",
                fontStyle: "normal",
                fontSize: 60,
                color: colors.neutralDark[500],
            },
            h2: {
                fontFamily: ["ProspectusProL", "sans-serif"].join(","),
                fontWeight: "bolder",
                fontStyle: "normal",
                fontSize: 48,
                color: colors.neutralDark[500],
            },
            h3: {
                fontFamily: ["ProspectusProL", "sans-serif"].join(","),
                fontWeight: "bold",
                fontStyle: "normal",
                fontSize: 36,
                color: colors.neutralDark[500],
            },
            h4: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontWeight: "bolder",
                fontStyle: "normal",
                fontSize: 30,
                color: colors.neutralDark[500],
            },
            h5: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontWeight: "bolder",
                fontStyle: "normal",
                fontSize: 24,
                color: colors.neutralDark[500],
            },
            h6: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontWeight: "bold",
                fontStyle: "normal",
                fontSize: 18,
                color: colors.neutralDark[500],
            },
            subtitle1: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontWeight: "lighter",
                fontStyle: "normal",
                color: colors.neutralDark[500],
            },
            subtitle2: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontWeight: "lighter",
                fontStyle: "italic",
                color: colors.neutralDark[500],
            },
            body1: {
                fontFamily: ["ProspectusProS", "sans-serif"].join(","),
                fontWeight: "normal",
                fontStyle: "normal",
                color: colors.neutralDark[500],
            },
            body2: {
                fontFamily: ["ProspectusProS", "sans-serif"].join(","),
                fontWeight: "normal",
                fontStyle: "italic",
                color: colors.neutralDark[500],
            },
            button: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontWeight: "bold",
                fontStyle: "normal",
                fontSize: 14,
                color: colors.neutralDark[500],
            },
            caption: {
                fontFamily: ["ProspectusProS", "sans-serif"].join(","),
                fontWeight: "normal",
                fontStyle: "normal",
                color: colors.neutralDark[500],
            },
        },
        components: {
            MuiAppBar: {
                defaultProps: {},
                styleOverrides: {
                    root: {
                        width: "100%",
                        minWidth: "400px",
                        backgroundColor: "rgba(0,0,0,0)",
                        boxShadow: "none",
                        left: "50%",
                        transform: "translateX(-50%)",
                        right: "",
                        padding: "10px 10px",
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "@media (min-width: 0px)": {
                            minHeight: 0,
                        },
                        "@media (min-width: 600px)": {
                            minHeight: 0,
                        },
                    },
                },
            },
        },
    };
};

const theme = createTheme({
    components: {
        MuiAppBar: {
            defaultProps: {},
            styleOverrides: {
                root: {
                    maxWidth: "500px",
                    backgroundColor: tokens("light").neutralLight[100],
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: "0",
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
                disableRipple: true, // edit .Mui-focusVisible class
            },
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "#ffffff",
                    },
                },
            },
        },
    },
});
