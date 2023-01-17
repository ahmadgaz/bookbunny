import { useState, useContext } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import * as yup from "yup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import TodayIcon from "@mui/icons-material/Today";
import PersonIcon from "@mui/icons-material/Person";
import SupportIcon from "@mui/icons-material/Support";
import { CRUDFunctionsContext } from ".";
import { useDispatch } from "react-redux";
import { setLogout } from "state";
import { Global } from "@emotion/react";

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
    const { setShowDialog } = props;
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
        onSubmitProps.resetForm();
    };

    return (
        <Dialog
            open
            onClose={() => {
                setShowDialog(false);
            }}
        >
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
                        Add View
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
                            helperText={touched.view_name && errors.view_name}
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
                            helperText={touched.view_desc && errors.view_desc}
                        />
                        <ColorPicker
                            error={
                                Boolean(touched.view_color) &&
                                Boolean(errors.view_color)
                            }
                            value={values.view_color}
                            handleChange={handleChange}
                            helperText={touched.view_color && errors.view_color}
                        />
                        <Button
                            variant="outlined"
                            color="inherit"
                            style={{
                                padding: "10px 30px 8px 30px",
                            }}
                            onClick={() => {
                                setShowDialog(false);
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
                            }}
                        >
                            Create
                        </Button>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

const Dropdown = () => {
    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDialog, setShowDialog] = useState(null);
    let view = { ...getSelectedView() };

    const handleDialogOpen = () => {
        setShowDialog(true);
    };
    const handleDialogClose = () => {
        setShowDialog(false);
    };

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const viewList = () => {
        return (
            <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                {user.views.map((v, idx) => {
                    if (v._id !== view._id) {
                        return (
                            <li key={idx}>
                                <Button
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
                                    }}
                                >
                                    {v.view_name}
                                </Button>
                            </li>
                        );
                    }
                    return null;
                })}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        handleDialogOpen();
                        handlePopoverClose();
                    }}
                    style={{
                        backgroundColor: "",
                        padding: "10px 30px 8px 30px",
                    }}
                >
                    Add view +
                </Button>
            </ul>
        );
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
            <Button
                variant="contained"
                onClick={(e) => {
                    if (view._id) {
                        handlePopoverOpen(e);
                    } else {
                        handleDialogOpen();
                    }
                }}
                style={{
                    backgroundColor: view._id ? view.view_color : "",
                    padding: "10px 30px 8px 30px",
                }}
            >
                {view.view_name}
                {view._id && <ArrowDropDownIcon sx={{ m: "0 2px" }} />}
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={() => {
                    if (view._id) {
                        handlePopoverClose();
                    } else {
                        handleDialogClose();
                    }
                }}
                PaperProps={{
                    style: {
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
                boxShadow: "0 0px 5px rgba(0, 0, 0, 0.5)",
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

// const Puller = styled(Box)(({ theme }) => ({
//     // width: 30,
//     // height: 6,
//     // backgroundColor: "#808080",
//     borderRadius: 3,
//     // position: "absolute",
//     boxShadow: "1px 1px 5px white",
//     // top: 10,
//     // left: "calc(50% - 15px)",
//     transform: "rotate(-45deg)",
// }));

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
    const { tab, handleTabChange } = props;
    const { user } = useContext(CRUDFunctionsContext);
    // const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => {
        setOpen(newOpen);
    };
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return isNonMobileScreens ? (
        <AppBar>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                LOGO
                <Dropdown />
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                >
                    <Tab label="View" />
                    <Tab label="Calendar" />
                    <Tab label={`${user.first_name}'s Account`} />
                    <Tab label="Help" />
                </Tabs>
                <Dropdown />
                <Button
                    color="inherit"
                    onClick={() => {
                        dispatch(setLogout());
                    }}
                >
                    Log out
                </Button>
            </Toolbar>
        </AppBar>
    ) : (
        <>
            <Global
                styles={{
                    ".MuiDrawer-root > .MuiDrawer-paperAnchorBottom": {
                        height: `calc(50% - ${drawerBleeding}px)`,
                        overflow: "visible",
                    },
                }}
            />

            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => {
                    toggleDrawer(false);
                }}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={
                    {
                        // "& .MuiDrawer-root": {
                        //     position: "absolute",
                        // },
                        // "& .MuiPaper-root .MuiPaper-elevation .MuiPaper-elevation16 .MuiDrawer-paper .MuiDrawer-paperAnchorBottom":
                        //     {
                        //         visibility: "visible !important",
                        //     },
                    }
                }
            >
                <Box
                    height={drawerBleeding}
                    sx={{
                        position: "absolute",
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        boxShadow: "0 -2.5px 5px rgba(0, 0, 0, 0.2)",
                        color: "black",
                        visibility: "visible",
                        // overflow: "hidden",
                        backgroundColor: "#ffffff",
                        right: 0,
                        left: 0,
                    }}
                >
                    <StyledTabs value={tab} onChange={handleTabChange}>
                        <Tab icon={<ViewDayIcon />} />
                        <Tab icon={<TodayIcon />} />
                        <Tab icon={<PersonIcon />} />
                        <Tab icon={<SupportIcon />} />
                    </StyledTabs>
                    <Puller
                        setOpen={() => {
                            toggleDrawer(!open);
                        }}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    flexWrap="nowrap"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                >
                    <Dropdown />
                    <Dropdown />
                    <Button
                        color="inherit"
                        variant="contained"
                        onClick={() => {
                            dispatch(setLogout());
                        }}
                    >
                        Log out
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
