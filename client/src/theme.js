import { createTheme } from "@mui/material";

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
              borderSize: 1.5,
              borderRadius: 8,
              boxShadowSize: 3,
              boxShadowHovered: 1.5,
              boxShadowPressed: 0,
          }
        : {
              primary: {
                  100: "#ffeed5",
                  900: "#ffdcac",
                  800: "#fecb82",
                  700: "#feb959",
                  600: "#fea82f",
                  500: "#cb8626",
                  400: "#98651c",
                  300: "#664313",
                  200: "#332209",
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
                  100: "#666651",
                  200: "#99987a",
                  300: "#99987a",
                  400: "#cccba2",
                  500: "#fffecb",
                  600: "#fffed5",
                  700: "#fffee0",
                  800: "#ffffea",
                  900: "#fffff5",
              },
              neutralLight: {
                  800: "#d9d8d8",
                  900: "#b3b2b1",
                  400: "#8e8b89",
                  200: "#686562",
                  300: "#423e3b",
                  100: "#35322f",
                  500: "#282523",
                  600: "#1a1918",
                  700: "#0d0c0c",
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
              borderSize: 1.5,
              borderRadius: 8,
              boxShadowSize: 3,
              boxShadowHovered: 1.5,
              boxShadowPressed: 0,
          }),
});

export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            common: {
                black: colors.neutralDark[500],
                white: colors.neutralLight[500],
            },
            text: {
                primary: colors.neutralDark[500],
                secondary: colors.neutralDark[300],
                disabled: colors.neutralDark[100],
            },
            action: {
                active: colors.primary[500],
                hover: colors.neutralDark[500],
                selected: colors.neutralDark[300],
                disabled: colors.neutralDark[200],
                disabledBackground: colors.neutralDark[100],
                focus: colors.neutralDark[100],
            },
            primary: {
                dark: colors.primary[400],
                main: colors.primary[500],
                light: colors.primary[600],
            },
            secondary: {
                dark: colors.secondary[400],
                main: colors.secondary[500],
                light: colors.secondary[600],
            },
            error: {
                dark: colors.redAccent[400],
                main: colors.redAccent[500],
                light: colors.redAccent[600],
            },
            neutral: {
                dark: colors.neutralDark[400],
                main: colors.neutralDark[500],
                light: colors.neutralDark[600],
            },
            background: {
                default: colors.neutralLight[500],
            },
        },
        typography: {
            fontFamily: ["ProspectusProL", "sans-serif"].join(","),
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: 12,
            color: colors.neutralDark[500],
            hero: {
                fontFamily: ["ProspectusProXL", "sans-serif"].join(","),
                fontSize: 60,
                lineHeight: 1.1,
                color: colors.neutralDark[500],
            },
            h1: {
                fontFamily: ["ProspectusProL", "sans-serif"].join(","),
                fontSize: 48,
                color: colors.neutralDark[500],
            },
            h2: {
                fontFamily: ["ProspectusProL", "sans-serif"].join(","),
                fontSize: 36,
                color: colors.neutralDark[500],
            },
            h3: {
                fontFamily: ["ProspectusProL", "sans-serif"].join(","),
                fontSize: 30,
                color: colors.neutralDark[500],
            },
            h4: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontSize: 24,
                color: colors.neutralDark[500],
            },
            h5: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontSize: 21,
                color: colors.neutralDark[500],
            },
            h6: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontSize: 18,
                color: colors.neutralDark[500],
            },
            subtitle1: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontSize: 12,
                fontStyle: "italic",
                color: colors.neutralDark[200],
            },
            subtitle2: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                color: colors.neutralDark[500],
            },
            body1: {
                fontFamily: ["ProspectusProS", "sans-serif"].join(","),
                fontSize: 16,
                color: colors.neutralDark[500],
            },
            body2: {
                fontFamily: ["ProspectusProS", "sans-serif"].join(","),
                color: colors.neutralDark[500],
            },
            button: {
                fontFamily: ["ProspectusProM", "sans-serif"].join(","),
                fontSize: 14,
                fontWeight: "bold",
                color: colors.neutralDark[500],
            },
            caption: {
                fontFamily: ["ProspectusProS", "sans-serif"].join(","),
                color: colors.neutralDark[500],
            },
        },
        components: {
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backgroundColor: `${colors.neutralLight[500]}7F`,
                    },
                    invisible: {
                        backgroundColor: `rgba(0,0,0,0)`,
                    },
                },
            },
            MuiAppBar: {
                defaultProps: {},
                styleOverrides: {
                    root: {
                        width: "100%",
                        minWidth: "400px",
                        background: `rgba(0,0,0,0)`,
                        boxShadow: "none",
                        left: "50%",
                        transform: "translateX(-50%)",
                        right: "",
                        padding: "10px 10px 20px 10px",
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
            MuiPaper: {
                defaultProps: {
                    elevation: 0,
                },
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                        backgroundColor: colors.neutralLight[100],
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
                        padding: "10px 20px 8px 20px",
                        textTransform: "none",
                        lineHeight: "1.1rem",
                        border: `${colors.borderSize}px solid ${colors.neutralDark[500]}`,
                        borderRadius: `${colors.borderRadius}px`,
                        transition:
                            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, top 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        top: `${colors.boxShadowSize * -1}px`,
                        left: `${colors.boxShadowSize * -1}px`,
                        boxShadow: `${colors.boxShadowSize}px ${colors.boxShadowSize}px 0px ${colors.neutralDark[500]}`,
                        "&:hover": {
                            top: `${colors.boxShadowHovered * -1}px`,
                            left: `${colors.boxShadowHovered * -1}px`,
                            boxShadow: `${colors.boxShadowHovered}px ${colors.boxShadowHovered}px 0px ${colors.neutralDark[500]}`,
                        },
                        "&:active": {
                            top: `${colors.boxShadowPressed * -1}px`,
                            left: `${colors.boxShadowPressed * -1}px`,
                            boxShadow: `${colors.boxShadowPressed}px ${colors.boxShadowPressed}px 0px ${colors.neutralDark[500]}`,
                        },
                    },
                    contained: {
                        color: colors.neutralDark[500],
                    },
                    outlined: {
                        "&:hover": {
                            border: `${colors.borderSize}px solid ${colors.primary[500]}`,
                            top: `${colors.boxShadowHovered * -1}px`,
                            left: `${colors.boxShadowHovered * -1}px`,
                            boxShadow: `${colors.boxShadowHovered}px ${colors.boxShadowHovered}px 0px ${colors.primary[500]}`,
                        },
                        "&:active": {
                            top: `${colors.boxShadowPressed * -1}px`,
                            left: `${colors.boxShadowPressed * -1}px`,
                            boxShadow: `${colors.boxShadowPressed}px ${colors.boxShadowPressed}px 0px ${colors.neutralDark[500]}`,
                        },
                    },
                    text: {
                        "&:hover": {
                            backgroundColor: `${colors.neutralLight[200]}`,
                        },
                    },
                },
            },
            MuiTab: {
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                },
                styleOverrides: {
                    root: {
                        width: "100px",
                        textTransform: "none",
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        minWidth: "0",
                        maxWidth: "0",
                        minHeight: "0",
                        maxHeight: "0",
                    },
                },
            },
            MuiDialog: {
                defaultProps: {
                    PaperProps: {
                        sx: {
                            boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                            overflow: "visible",
                            backgroundColor: "rgba(0,0,0,0)",
                        },
                    },
                },
            },
        },
    };
};
