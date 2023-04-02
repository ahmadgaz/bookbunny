import { useState, useContext, useEffect } from "react";
import {
    Box,
    useMediaQuery,
    AppBar,
    Button,
    Toolbar,
    Tab,
    Tabs,
    Drawer,
    Popover,
    Dialog,
    TextField,
    IconButton,
    Snackbar,
    useScrollTrigger,
    Slide,
    Typography,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import * as yup from "yup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import TodayIcon from "@mui/icons-material/Today";
import PersonIcon from "@mui/icons-material/Person";
import SupportIcon from "@mui/icons-material/Support";
import Logo from "../../assets/Logo-01.svg";
import { CRUDFunctionsContext } from "App";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar, setLogout, setTheme, showSnackbar } from "state";
import { Global } from "@emotion/react";
import {
    DarkMode,
    Delete,
    Edit,
    LightMode,
    Link,
    Logout,
} from "@mui/icons-material";
import { tokens } from "theme";
import Container from "components/Container";

// VIEWS
const addViewSchema = yup.object().shape({
    view_name: yup.string().required("Enter a view name!"),
    view_desc: yup.string().notRequired(),
    view_color: yup.string().required("Pick a color!"),
});
const initialValuesAddView = {
    view_name: "",
    view_desc: "",
    view_color: "",
};
const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
};
const ColorPickerBtn = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const themeColors = [
        colors.neutralDark[500],
        colors.redAccent[500],
        colors.primary[500],
        colors.neutralLight[500],
        colors.secondary[500],
    ];
    const { error, selected, color, onClick } = props;

    return (
        <Button
            variant="contained"
            disabled={selected}
            style={{
                minWidth: 0,
                margin: "0 10px",
                padding: "20px 20px 20px 20px",
                border: `${
                    error
                        ? `${colors.borderSize}px solid ${colors.redAccent[500]}`
                        : ""
                }`,
                backgroundColor: `rgba(${hexToRgb(color).r}, ${
                    hexToRgb(color).g
                }, ${hexToRgb(color).b}, ${selected ? 1 : 0.5})`,
                opacity: `${selected ? 1 : 0.5}`,
            }}
            onClick={() => {
                const e = { target: { value: color, name: "view_color" } };
                onClick(e);
            }}
        ></Button>
    );
};
const AddViewDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const themeColors = [
        colors.neutralDark[500],
        colors.redAccent[500],
        colors.primary[500],
        colors.neutralLight[500],
        colors.secondary[500],
    ];
    const { setShowDialog } = props;
    const dispatch = useDispatch();
    const { createView } = useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const ColorPicker = (props) => {
        const { error, value, handleChange, helperText } = props;

        return (
            <Box>
                {themeColors.map((color, idx) => (
                    <ColorPickerBtn
                        key={idx}
                        error={error}
                        selected={color === value}
                        color={color}
                        onClick={handleChange}
                    />
                ))}
                <Typography
                    color="error"
                    variant="body1"
                    fontSize={11}
                    textAlign="left"
                    padding="10px 40px 0 40px"
                >
                    {helperText}
                </Typography>
            </Box>
        );
    };

    const handleFormSubmit = (values, onSubmitProps) => {
        createView(values.view_name, values.view_desc, values.view_color);
        setShowDialog(false);
        dispatch(showSnackbar({ snackbar: "viewAdded" }));
        onSubmitProps.resetForm();
    };

    return (
        <Dialog
            fullScreen={!isNonMobileScreens}
            open
            onClose={() => {
                setShowDialog(false);
            }}
        >
            {isNonMobileScreens ? (
                <Container
                    fullWidth
                    fullHeight
                    button={false}
                    style={{
                        padding: "30px",
                        height: "100%",
                        backgroundColor: colors.neutralLight[100],
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h1" margin="5px 0 25px 0">
                        Add View
                    </Typography>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValuesAddView}
                        validationSchema={addViewSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            resetForm,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    width="350px"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    gridTemplateRows="repeat(3, minmax(0, 1fr)"
                                >
                                    <TextField
                                        label="View Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.view_name}
                                        name="view_name"
                                        error={
                                            Boolean(touched.view_name) &&
                                            Boolean(errors.view_name)
                                        }
                                        helperText={
                                            touched.view_name &&
                                            errors.view_name
                                        }
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        label="View Description"
                                        fullWidth
                                        multiline
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.view_desc}
                                        name="view_desc"
                                        error={
                                            Boolean(touched.view_desc) &&
                                            Boolean(errors.view_desc)
                                        }
                                        helperText={
                                            touched.view_desc &&
                                            errors.view_desc
                                        }
                                        sx={{
                                            gridColumn: "span 4",
                                        }}
                                    />
                                    <Box sx={{ gridColumn: "span 4" }}>
                                        <ColorPicker
                                            error={
                                                Boolean(touched.view_color) &&
                                                Boolean(errors.view_color)
                                            }
                                            value={values.view_color}
                                            handleChange={handleChange}
                                            helperText={
                                                touched.view_color &&
                                                errors.view_color
                                            }
                                        />
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        style={{
                                            padding: "10px 30px 8px 30px",
                                            gridColumn: "span 2",
                                        }}
                                        onClick={() => {
                                            setShowDialog(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        type="submit"
                                        style={{
                                            padding: "10px 30px 8px 30px",
                                            gridColumn: "span 2",
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Container>
            ) : (
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "nowrap",
                        padding: "20px 0",
                        overflow: "auto",
                        textAlign: "center",
                        alignItems: "center",
                        width: "100vw",
                        height: "100vh",
                    }}
                >
                    <Typography variant="h1" margin="5px 0 25px 0">
                        Add View
                    </Typography>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValuesAddView}
                        validationSchema={addViewSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            resetForm,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    width="350px"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    gridTemplateRows="repeat(3, minmax(0, 1fr)"
                                >
                                    <TextField
                                        label="View Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.view_name}
                                        name="view_name"
                                        error={
                                            Boolean(touched.view_name) &&
                                            Boolean(errors.view_name)
                                        }
                                        helperText={
                                            touched.view_name &&
                                            errors.view_name
                                        }
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        label="View Description"
                                        fullWidth
                                        multiline
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.view_desc}
                                        name="view_desc"
                                        error={
                                            Boolean(touched.view_desc) &&
                                            Boolean(errors.view_desc)
                                        }
                                        helperText={
                                            touched.view_desc &&
                                            errors.view_desc
                                        }
                                        sx={{
                                            gridColumn: "span 4",
                                        }}
                                    />
                                    <Box sx={{ gridColumn: "span 4" }}>
                                        <ColorPicker
                                            error={
                                                Boolean(touched.view_color) &&
                                                Boolean(errors.view_color)
                                            }
                                            value={values.view_color}
                                            handleChange={handleChange}
                                            helperText={
                                                touched.view_color &&
                                                errors.view_color
                                            }
                                        />
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        style={{
                                            padding: "10px 30px 8px 30px",
                                            gridColumn: "span 2",
                                        }}
                                        onClick={() => {
                                            setShowDialog(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        type="submit"
                                        style={{
                                            padding: "10px 30px 8px 30px",
                                            gridColumn: "span 2",
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Paper>
            )}
        </Dialog>
    );
};

const ViewsDropdown = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const themeColors = [
        colors.neutralDark[500],
        colors.redAccent[500],
        colors.primary[500],
        colors.neutralLight[500],
        colors.secondary[500],
    ];

    const StyledButton1 = styled(Button)({
        border: "none",
        boxShadow: "none",
        top: "0",
        left: "0",
        borderBottom: `${colors.borderSize}px solid ${colors.neutralDark[500]}`,
        transition: "filter 0.1s ease",
        "&:hover": {
            top: "0",
            left: "0",
            filter: "brightness(110%)",
            boxShadow: `none`,
        },
        "&:active": {
            top: "0",
            left: "0",
            boxShadow: `none`,
        },
    });
    const StyledButton2 = styled(Button)({
        border: "none",
        boxShadow: "none",
        top: "0",
        left: "0",
        transition: "filter 0.1s ease",
        "&:hover": {
            top: "0",
            left: "0",
            filter: "brightness(110%)",
            boxShadow: `none`,
        },
        "&:active": {
            top: "0",
            left: "0",
            boxShadow: `none`,
        },
    });
    const StyledButton3 = styled(Button)({
        transition:
            "filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, top 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        "&:hover": {
            filter: "brightness(110%)",
        },
    });

    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
    let view = { ...getSelectedView() };

    const handleDialogOpen = () => {
        setShowDialog(true);
    };
    const handlePopoverOpen = (event) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const viewList = () => {
        if (user.views) {
            return (
                <Box
                    sx={{
                        border: `${colors.borderSize}px solid ${colors.neutralDark[500]}`,
                        boxShadow: `${colors.boxShadowSize}px ${colors.boxShadowSize}px 0px ${colors.neutralDark[500]}`,
                        borderRadius: `${colors.borderRadius}px`,
                        overflow: "auto",
                    }}
                >
                    <ul
                        style={{ margin: 0, padding: 0, listStyleType: "none" }}
                    >
                        {user.views.map((v, idx) => {
                            if (v._id !== view._id) {
                                return (
                                    <li key={idx}>
                                        <StyledButton1
                                            fullWidth
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedView(v);
                                                handlePopoverClose();
                                            }}
                                            style={{
                                                cursor: "pointer",
                                                padding: "10px 30px",
                                                width: "100%",
                                                borderRadius: "0",
                                                backgroundColor: v.view_color,
                                                color:
                                                    v.view_color.toLowerCase() ===
                                                        themeColors[0].toLowerCase() ||
                                                    v.view_color.toLowerCase() ===
                                                        themeColors[1].toLowerCase() ||
                                                    v.view_color.toLowerCase() ===
                                                        themeColors[4].toLowerCase()
                                                        ? colors
                                                              .neutralLight[100]
                                                        : "",
                                                "&:hover": {
                                                    // backgroundColor: `${v.view_color}F7`,
                                                },
                                            }}
                                        >
                                            {v.view_name}
                                        </StyledButton1>
                                    </li>
                                );
                            }
                            return null;
                        })}
                        <StyledButton2
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                handleDialogOpen();
                                handlePopoverClose();
                            }}
                            style={{
                                borderRadius: "0",
                                backgroundColor: "",
                            }}
                        >
                            Add view +
                        </StyledButton2>
                    </ul>
                </Box>
            );
        }
        return null;
    };

    const setSelectedView = (v) => {
        let selectedView = { ...v };
        view.view_selected = false;
        selectedView.view_selected = true;
        updateView(view);
        updateView(selectedView);
    };
    return (
        <>
            {view._id ? (
                <StyledButton3
                    key="styledbutton3"
                    variant="contained"
                    onClick={(e) => {
                        handlePopoverOpen(e);
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ m: "0 0 0 5px" }} />}
                    style={{
                        cursor: "pointer",
                        padding: "10px 30px",
                        flexGrow: 1,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        backgroundColor: view.view_color,
                        color:
                            view.view_color.toLowerCase() ===
                                themeColors[0].toLowerCase() ||
                            view.view_color.toLowerCase() ===
                                themeColors[1].toLowerCase() ||
                            view.view_color.toLowerCase() ===
                                themeColors[4].toLowerCase()
                                ? colors.neutralLight[100]
                                : "",
                    }}
                >
                    {view.view_name}
                </StyledButton3>
            ) : (
                <Button
                    variant="contained"
                    onClick={() => {
                        handleDialogOpen();
                    }}
                    style={{
                        backgroundColor: "",
                        flexGrow: 1,
                    }}
                >
                    Add View +
                </Button>
            )}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={() => {
                    handlePopoverClose();
                }}
                PaperProps={{
                    style: {
                        boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                        overflow: "visible",
                        backgroundColor: "rgba(0,0,0,0)",
                        marginTop: "10px",
                    },
                }}
            >
                {viewList()}
            </Popover>
            {showDialog && <AddViewDialog setShowDialog={setShowDialog} />}
        </>
    );
};
const MobileViewsDropdown = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const themeColors = [
        colors.neutralDark[500],
        colors.redAccent[500],
        colors.primary[500],
        colors.neutralLight[500],
        colors.secondary[500],
    ];

    const StyledButton1 = styled(Button)({
        border: "none",
        boxShadow: "none",
        top: "0",
        left: "0",
        borderBottom: `${colors.borderSize}px solid ${colors.neutralDark[500]}`,
        transition: "filter 0.1s ease",
        "&:hover": {
            top: "0",
            left: "0",
            filter: "brightness(110%)",
            boxShadow: `none`,
        },
        "&:active": {
            top: "0",
            left: "0",
            boxShadow: `none`,
        },
    });
    const StyledButton2 = styled(Button)({
        border: "none",
        boxShadow: "none",
        top: "0",
        left: "0",
        transition: "filter 0.1s ease",
        "&:hover": {
            top: "0",
            left: "0",
            filter: "brightness(110%)",
            boxShadow: `none`,
        },
        "&:active": {
            top: "0",
            left: "0",
            boxShadow: `none`,
        },
    });
    const StyledButton3 = styled(Button)({
        transition:
            "filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, top 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        "&:hover": {
            filter: "brightness(110%)",
        },
    });

    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
    let view = { ...getSelectedView() };

    const handleDialogOpen = () => {
        setShowDialog(true);
    };
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const viewList = () => {
        if (user.views) {
            return (
                <Box
                    sx={{
                        border: `${colors.borderSize}px solid ${colors.neutralDark[500]}`,
                        boxShadow: `${colors.boxShadowSize}px ${colors.boxShadowSize}px 0px ${colors.neutralDark[500]}`,
                        borderRadius: `${colors.borderRadius}px`,
                        overflow: "auto",
                    }}
                >
                    <ul
                        style={{ margin: 0, padding: 0, listStyleType: "none" }}
                    >
                        {user.views.map((v, idx) => {
                            if (v._id !== view._id) {
                                return (
                                    <li key={idx}>
                                        <StyledButton1
                                            fullWidth
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedView(v);
                                                handlePopoverClose();
                                            }}
                                            style={{
                                                cursor: "pointer",
                                                padding: "10px 30px",
                                                width: "100%",
                                                borderRadius: "0",
                                                backgroundColor: v.view_color,
                                                color:
                                                    v.view_color.toLowerCase() ===
                                                        themeColors[0].toLowerCase() ||
                                                    v.view_color.toLowerCase() ===
                                                        themeColors[1].toLowerCase() ||
                                                    v.view_color.toLowerCase() ===
                                                        themeColors[4].toLowerCase()
                                                        ? colors
                                                              .neutralLight[100]
                                                        : "",
                                                "&:hover": {
                                                    // backgroundColor: `${v.view_color}F7`,
                                                },
                                            }}
                                        >
                                            {v.view_name}
                                        </StyledButton1>
                                    </li>
                                );
                            }
                            return null;
                        })}
                        <StyledButton2
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                handleDialogOpen();
                                handlePopoverClose();
                            }}
                            style={{
                                borderRadius: "0",
                                backgroundColor: "",
                            }}
                        >
                            Add view +
                        </StyledButton2>
                    </ul>
                </Box>
            );
        }
        return null;
    };

    const setSelectedView = (v) => {
        let selectedView = { ...v };
        view.view_selected = false;
        selectedView.view_selected = true;
        updateView(view);
        updateView(selectedView);
    };
    return (
        <>
            {view._id ? (
                <StyledButton3
                    variant="contained"
                    onClick={(e) => {
                        handlePopoverOpen(e);
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ m: "0 0 0 5px" }} />}
                    style={{
                        cursor: "pointer",
                        padding: "10px 30px",
                        flexGrow: 1,
                        backgroundColor: view.view_color,
                        color:
                            view.view_color.toLowerCase() ===
                                themeColors[0].toLowerCase() ||
                            view.view_color.toLowerCase() ===
                                themeColors[1].toLowerCase() ||
                            view.view_color.toLowerCase() ===
                                themeColors[4].toLowerCase()
                                ? colors.neutralLight[100]
                                : "",
                    }}
                >
                    {view.view_name}
                </StyledButton3>
            ) : (
                <Button
                    variant="contained"
                    onClick={() => {
                        handleDialogOpen();
                    }}
                    style={{
                        backgroundColor: "",
                        flexGrow: 1,
                    }}
                >
                    Add View +
                </Button>
            )}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={() => {
                    handlePopoverClose();
                }}
                PaperProps={{
                    style: {
                        boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                        overflow: "visible",
                        backgroundColor: "rgba(0,0,0,0)",
                        marginTop: "10px",
                    },
                }}
            >
                {viewList()}
            </Popover>
            {showDialog && <AddViewDialog setShowDialog={setShowDialog} />}
        </>
    );
};

const drawerBleeding = 65;

const StyledTabs = styled(({ className, ...other }) => {
    return (
        <Tabs
            {...other}
            classes={{
                root: className,
                flexContainer: "flexContainer",
                indicator: "indicator",
            }}
            variant="fullWidth"
            TabIndicatorProps={{ children: <span /> }}
            centered
        />
    );
})({
    "& .indicator": {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        "& > span": {
            maxWidth: 25,
            width: "100%",
            backgroundColor: "black",
        },
    },
    "& .flexContainer": {
        flexDirection: "row",
        position: "relative",
        maxHeight: 65,
        minHeight: 65,
        // top: "7px",
        // width:'fit-content'
    },
});

const Navbar = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { tab, handleTabChange, emblaRef } = props;
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const trigger = useScrollTrigger({
        target: emblaRef.current ? emblaRef.current : undefined,
    });
    useEffect(() => {
        console.log(trigger);
    }, [trigger]);

    console.log(tab);
    return isNonMobileScreens ? (
        <AppBar>
            <Slide appear={false} direction="down" in={!trigger}>
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{ height: "50px", margin: "0 30px 0 0" }}
                        />
                        <Box display="flex">
                            <ViewsDropdown />
                            <Button
                                variant={tab === 0 ? "contained" : ""}
                                style={
                                    tab !== 0
                                        ? {
                                              backgroundColor:
                                                  colors.neutralLight[100],
                                              borderRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                        : {
                                              top: 0,
                                              left: 0,
                                              boxShadow: "0 0 0",
                                              borderRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                }
                                onClick={() => {
                                    handleTabChange(null, 0);
                                }}
                            >
                                Views
                            </Button>
                            <Button
                                variant={tab === 1 ? "contained" : ""}
                                style={
                                    tab !== 1
                                        ? {
                                              backgroundColor:
                                                  colors.neutralLight[100],
                                              borderRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                        : {
                                              top: 0,
                                              left: 0,
                                              boxShadow: "0 0 0",
                                              borderRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                }
                                onClick={() => {
                                    handleTabChange(null, 1);
                                }}
                            >
                                Calendar
                            </Button>
                            <Button
                                variant={tab === 2 ? "contained" : ""}
                                style={
                                    tab !== 2
                                        ? {
                                              backgroundColor:
                                                  colors.neutralLight[100],
                                              borderRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                        : {
                                              top: 0,
                                              left: 0,
                                              boxShadow: "0 0 0",
                                              borderRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                }
                                onClick={() => {
                                    handleTabChange(null, 2);
                                }}
                            >
                                Help
                            </Button>
                            <Button
                                variant={tab === 3 ? "contained" : ""}
                                style={
                                    tab !== 3
                                        ? {
                                              backgroundColor:
                                                  colors.neutralLight[100],
                                              borderTopLeftRadius: 0,
                                              borderBottomLeftRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                        : {
                                              top: 0,
                                              left: 0,
                                              boxShadow: "0 0 0",
                                              borderTopLeftRadius: 0,
                                              borderBottomLeftRadius: 0,
                                              minHeight: "42.4px",
                                          }
                                }
                                onClick={() => {
                                    handleTabChange(null, 3);
                                }}
                            >
                                Account
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                            onClick={() => {
                                dispatch(setTheme());
                            }}
                        >
                            {mode === "light" ? <DarkMode /> : <LightMode />}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                            onClick={() => {
                                dispatch(setLogout());
                            }}
                        >
                            <Logout />
                        </Button>
                    </Box>
                </Toolbar>
            </Slide>
        </AppBar>
    ) : (
        <>
            <AppBar sx={{ padding: "0px" }}>
                <Box
                    height="70px"
                    sx={{
                        position: "absolute",
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        color: colors.neutralDark[500],
                        visibility: "visible",
                        backgroundColor: `${colors.neutralLight[200]}d7`,
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 -2.5px 7.5px rgba(0, 0, 0, 0.4)",
                        right: 0,
                        left: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 30px 0 30px",
                    }}
                >
                    <IconButton
                        onClick={() => {
                            dispatch(setTheme());
                        }}
                        sx={{ marginRight: "30px" }}
                    >
                        {mode === "light" ? <DarkMode /> : <LightMode />}
                    </IconButton>

                    <Box>
                        <MobileViewsDropdown />
                    </Box>

                    <IconButton
                        onClick={() => {
                            dispatch(setLogout());
                        }}
                        sx={{ marginLeft: "30px" }}
                    >
                        <Logout />
                    </IconButton>
                </Box>
            </AppBar>
            <AppBar sx={{ top: "auto", bottom: 0, padding: "0px" }}>
                <Box
                    height={drawerBleeding}
                    sx={{
                        position: "absolute",
                        top: -drawerBleeding,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        color: colors.neutralDark[500],
                        visibility: "visible",
                        backgroundColor: `${colors.neutralLight[200]}d7`,
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 2.5px 7.5px rgba(0, 0, 0, 0.4)",
                        right: 0,
                        left: 0,
                    }}
                >
                    <StyledTabs value={tab} onChange={handleTabChange}>
                        <Tab icon={<ViewDayIcon />} />
                        <Tab icon={<TodayIcon />} />
                        <Tab icon={<SupportIcon />} />
                        <Tab icon={<PersonIcon />} />
                    </StyledTabs>
                </Box>
            </AppBar>
        </>
    );
};

export default Navbar;
