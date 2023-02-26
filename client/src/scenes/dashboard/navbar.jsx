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
import { useDispatch } from "react-redux";
import { setLogout } from "state";
import { Global } from "@emotion/react";
import { Delete, Edit, Link } from "@mui/icons-material";
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
const colors = ["#423E3B", "#FF2E00", "#FEA82F", "#FFFECB", "#5448C8"];
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
    const { error, selected, color, onClick } = props;

    return (
        <Button
            variant="contained"
            disabled={selected}
            style={{
                minWidth: 0,
                margin: "0 10px",
                padding: "20px 20px 20px 20px",
                border: `${error ? "1px solid red" : ""}`,
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
    const { setShowDialog, setShowSnackbar } = props;
    const { createView } = useContext(CRUDFunctionsContext);

    const ColorPicker = (props) => {
        const { error, value, handleChange, helperText } = props;

        return (
            <>
                {colors.map((color, idx) => (
                    <ColorPickerBtn
                        key={idx}
                        error={error}
                        selected={color === value}
                        color={color}
                        onClick={handleChange}
                    />
                ))}
                {helperText}
            </>
        );
    };

    const handleFormSubmit = (values, onSubmitProps) => {
        createView(values.view_name, values.view_desc, values.view_color);
        setShowDialog(false);
        setShowSnackbar(true);
        onSubmitProps.resetForm();
    };

    return (
        <Dialog
            open
            onClose={() => {
                setShowDialog(false);
            }}
        >
            <Container
                fullWidth
                fullHeight
                button={false}
                style={{
                    padding: "30px",
                    height: "100%",
                    backgroundColor: "#fff",
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
                                        touched.view_name && errors.view_name
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
                                        touched.view_desc && errors.view_desc
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
        </Dialog>
    );
};
const themeColors = tokens("light");
const StyledButton1 = styled(Button)({
    border: "none",
    boxShadow: "none",
    borderBottom: `${themeColors.borderSize} solid ${themeColors.neutralDark[500]}`,
    transition: "filter 0.1s ease",
    "&:hover": {
        filter: "brightness(110%)",
        boxShadow: `none`,
    },
    "&:active": {
        boxShadow: `none`,
    },
});
const StyledButton2 = styled(Button)({
    border: "none",
    boxShadow: "none",
    transition: "filter 0.1s ease",
    "&:hover": {
        filter: "brightness(110%)",
        boxShadow: `none`,
    },
    "&:active": {
        boxShadow: `none`,
    },
});
const StyledButton3 = styled(Button)({
    transition: "filter 0.1s ease",
    "&:hover": {
        filter: "brightness(110%)",
    },
});

const ViewsDropdown = () => {
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
                        border: `${themeColors.borderSize} solid ${themeColors.neutralDark[500]}`,
                        boxShadow: `1.5px 1.5px 0px ${themeColors.neutralDark[500]}`,
                        borderRadius: 1.5,
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
                                                    v.view_color ===
                                                        colors[0] ||
                                                    v.view_color ===
                                                        colors[1] ||
                                                    v.view_color === colors[4]
                                                        ? "white"
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
                        width: "100%",
                        backgroundColor: view.view_color,
                        color:
                            view.view_color === colors[0] ||
                            view.view_color === colors[1] ||
                            view.view_color === colors[4]
                                ? "white"
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
            {showDialog && (
                <AddViewDialog
                    setShowDialog={setShowDialog}
                    setShowSnackbar={setShowAddedSnackbar}
                />
            )}
            <Snackbar
                open={showAddedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowAddedSnackbar(false);
                }}
                message="View added!"
            />
        </>
    );
};

const drawerBleeding = 65;

const Puller = (props) => {
    const { setOpen } = props;
    const [direction, setDirection] = useState("up");

    return (
        <Box
            sx={{
                width: 36,
                height: 36,
                position: "absolute",
                backgroundColor: "white",
                top: -12,
                boxShadow: "0 0px 10px rgba(0, 0, 0, 0.4)",
                borderRadius: "18px",
                left: "calc(50% - 15px)",
                cursor: "pointer",
            }}
            onClick={() => {
                setOpen();
                setDirection(direction === "up" ? "down" : "up");
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: direction === "up" ? "42%" : "47%",
                    left: 9,
                    width: "12px",
                    height: "4px",
                    borderRadius: 3,
                    backgroundColor: "#808080",
                    transform:
                        direction === "up" ? "rotate(-45deg)" : "rotate(45deg)",
                    transition: "0.4s ease-in-out ",
                }}
            ></Box>
            <Box
                sx={{
                    position: "absolute",
                    top: direction === "up" ? "42%" : "47%",
                    right: 9,
                    width: "12px",
                    height: "4px",
                    borderRadius: 3,
                    backgroundColor: "#808080",
                    transform:
                        direction === "up" ? "rotate(45deg)" : "rotate(-45deg)",
                    transition: "0.4s ease-in-out ",
                }}
            ></Box>
        </Box>
    );
};

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

const HideOnScroll = (props) => {
    const { children } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger();
    useEffect(() => {
        console.log(trigger);
    }, [trigger]);

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const StyledAppBar = styled(AppBar)({
    background: `linear-gradient(${themeColors.neutralLight[500]} 85%, ${themeColors.neutralLight[500]}00);`,
});

const Navbar = (props) => {
    const { tab, handleTabChange } = props;
    const { user } = useContext(CRUDFunctionsContext);
    // const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => {
        setOpen(newOpen);
    };
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <StyledAppBar>
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
                    <Box>
                        <ViewsDropdown />
                    </Box>
                </Box>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <Tab label="View" />
                    <Tab label="Calendar" />
                    <Tab label="Help" />
                    <Tab label="Account" />
                </Tabs>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        dispatch(setLogout());
                    }}
                    sx={{ marginLeft: "30px" }}
                >
                    Log out
                </Button>
            </Toolbar>
        </StyledAppBar>
    );
};

export default Navbar;
