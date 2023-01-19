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
    IconButton,
    Snackbar,
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
import { Delete, Edit, Link } from "@mui/icons-material";

const DeleteEventTypeDialog = (props) => {
    const { eventType, setShowDialog, setShowSnackbar } = props;
    const { getSelectedView, deleteEventType } =
        useContext(CRUDFunctionsContext);
    let view = { ...getSelectedView() };

    const handleOnDelete = () => {
        deleteEventType(view, eventType);
        setShowDialog(null);
        setShowSnackbar(true);
    };

    return (
        <Dialog
            open
            onClose={() => {
                setShowDialog(null);
            }}
        >
            Are you sure you want to delete {eventType.event_type_name}?
            <Button
                variant="outlined"
                color="inherit"
                style={{
                    padding: "10px 30px 8px 30px",
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
                onClick={handleOnDelete}
                style={{
                    padding: "10px 30px 8px 30px",
                    backgroundColor: "red",
                }}
            >
                Delete
            </Button>
        </Dialog>
    );
};

const eventTypeFormValidationSchema = yup.object().shape({
    event_type_name: yup.string().required("Enter a name for your event type!"),
    event_type_duration: yup
        .string()
        .required("Enter a duration for your event type!")
        .matches(/^([0-9]?[0-9]):[0-5][0-9]$/, "Wrong format. Use HH:MM"),
    event_type_location: yup.string().notRequired(),
});

const EditEventTypeDialog = (props) => {
    const { eventType, setShowDialog, setShowSnackbar } = props;
    const { getSelectedView, updateEventType } =
        useContext(CRUDFunctionsContext);
    let view = { ...getSelectedView() };

    const initialValuesEditEventType = {
        event_type_name: eventType.event_type_name,
        event_type_duration: eventType.event_type_duration,
        event_type_location: eventType.event_type_location,
    };

    const handleFormSubmit = (values, onSubmitProps) => {
        let et = { ...eventType };
        et.event_type_name = values.event_type_name;
        et.event_type_duration = values.event_type_duration;
        et.event_type_location = values.event_type_location;
        updateEventType(view, et);
        setShowDialog(null);
        setShowSnackbar(true);
        onSubmitProps.resetForm();
    };

    return (
        <Dialog
            open
            onClose={() => {
                setShowDialog(null);
            }}
        >
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValuesEditEventType}
                validationSchema={eventTypeFormValidationSchema}
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
                        Edit Event Type
                        <TextField
                            label="Event Type Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.event_type_name}
                            name="event_type_name"
                            error={
                                Boolean(touched.event_type_name) &&
                                Boolean(errors.event_type_name)
                            }
                            helperText={
                                touched.event_type_name &&
                                errors.event_type_name
                            }
                        />
                        <TextField
                            label="Event Type Duration"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: "00:00",
                                max: "23:59",
                            }}
                            value={values.event_type_duration}
                            name="event_type_duration"
                            error={
                                Boolean(touched.event_type_duration) &&
                                Boolean(errors.event_type_duration)
                            }
                            helperText={
                                touched.event_type_duration &&
                                errors.event_type_duration
                            }
                        />
                        <TextField
                            label="Event Type Location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.event_type_location}
                            name="event_type_location"
                            error={
                                Boolean(touched.event_type_location) &&
                                Boolean(errors.event_type_location)
                            }
                            helperText={
                                touched.event_type_location &&
                                errors.event_type_location
                            }
                        />
                        <Button
                            variant="outlined"
                            color="inherit"
                            style={{
                                padding: "10px 30px 8px 30px",
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
                            }}
                        >
                            Save
                        </Button>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

const initialValuesAddEventType = {
    event_type_name: "",
    event_type_duration: "",
    event_type_location: "",
};

const AddEventTypeDialog = (props) => {
    const { setShowDialog, setShowSnackbar } = props;
    const { getSelectedView, createEventType } =
        useContext(CRUDFunctionsContext);
    let view = { ...getSelectedView() };

    const handleFormSubmit = (values, onSubmitProps) => {
        createEventType(
            view,
            values.event_type_name,
            values.event_type_duration,
            values.event_type_location
        );
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
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValuesAddEventType}
                validationSchema={eventTypeFormValidationSchema}
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
                        Add Event Type
                        <TextField
                            label="Event Type Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.event_type_name}
                            name="event_type_name"
                            error={
                                Boolean(touched.event_type_name) &&
                                Boolean(errors.event_type_name)
                            }
                            helperText={
                                touched.event_type_name &&
                                errors.event_type_name
                            }
                        />
                        <TextField
                            label="Event Type Duration"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                placeholder: "HH:MM",
                            }}
                            value={values.event_type_duration}
                            name="event_type_duration"
                            error={
                                Boolean(touched.event_type_duration) &&
                                Boolean(errors.event_type_duration)
                            }
                            helperText={
                                touched.event_type_duration &&
                                errors.event_type_duration
                            }
                        />
                        <TextField
                            label="Event Type Location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.event_type_location}
                            name="event_type_location"
                            error={
                                Boolean(touched.event_type_location) &&
                                Boolean(errors.event_type_location)
                            }
                            helperText={
                                touched.event_type_location &&
                                errors.event_type_location
                            }
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

const eventTypeURL = `${process.env.REACT_APP_CLIENT_BASE_URL}/newEvent`;

const EventTypesDropdown = () => {
    const { getSelectedView } = useContext(CRUDFunctionsContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);
    const [showDeletedSnackbar, setShowDeletedSnackbar] = useState(false);
    const [showEditedSnackbar, setShowEditedSnackbar] = useState(false);
    const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
    let view = { ...getSelectedView() };

    const handleDeleteDialogOpen = (et) => {
        setShowDeleteDialog(et);
    };
    const handleEditDialogOpen = (et) => {
        setShowEditDialog(et);
    };
    const handleAddDialogOpen = () => {
        setShowAddDialog(true);
    };
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const eventTypeList = () => {
        return (
            <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                {view.event_types &&
                    view.event_types.map((et, idx) => {
                        return (
                            <li key={idx}>
                                <Box
                                    width="100%"
                                    style={{
                                        display: "flex",
                                        flexWrap: "nowrap",
                                        padding: "10px 30px",
                                        width: "100%",
                                        borderBottom: "2px solid red",
                                        backgroundColor: view.view_color,
                                    }}
                                >
                                    <Box>
                                        {et.event_type_name}
                                        <IconButton
                                            onClick={() => {
                                                handleEditDialogOpen(et);
                                                handlePopoverClose();
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                handleDeleteDialogOpen(et);
                                                handlePopoverClose();
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${eventTypeURL}/${et._id}`
                                                );
                                                setShowCopiedSnackbar(true);
                                            }}
                                        >
                                            <Link />
                                        </IconButton>
                                        <br />
                                        {et.event_type_duration}
                                        {et.event_type_location && <hr />}
                                        {et.event_type_location &&
                                            et.event_type_location}
                                    </Box>
                                </Box>
                            </li>
                        );
                    })}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        handleAddDialogOpen();
                        handlePopoverClose();
                    }}
                    style={{
                        backgroundColor: "",
                        padding: "10px 30px 8px 30px",
                    }}
                >
                    Add Event Type +
                </Button>
            </ul>
        );
    };

    return (
        <>
            <Button
                disabled={view._id ? false : true}
                variant="contained"
                onClick={(e) => {
                    handlePopoverOpen(e);
                }}
                style={{
                    backgroundColor: view._id ? view.view_color : "",
                    padding: "10px 30px 8px 30px",
                }}
            >
                Event Types
                <ArrowDropDownIcon sx={{ m: "0 2px" }} />
            </Button>
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
                        marginTop: "10px",
                    },
                }}
            >
                {eventTypeList()}
            </Popover>
            {showDeleteDialog && (
                <DeleteEventTypeDialog
                    eventType={showDeleteDialog}
                    setShowDialog={setShowDeleteDialog}
                    setShowSnackbar={setShowDeletedSnackbar}
                />
            )}
            {showEditDialog && (
                <EditEventTypeDialog
                    eventType={showEditDialog}
                    setShowDialog={setShowEditDialog}
                    setShowSnackbar={setShowEditedSnackbar}
                />
            )}
            {showAddDialog && (
                <AddEventTypeDialog
                    setShowDialog={setShowAddDialog}
                    setShowSnackbar={setShowAddedSnackbar}
                />
            )}
            <Snackbar
                open={showCopiedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowCopiedSnackbar(false);
                }}
                message="Link copied!"
            />
            <Snackbar
                open={showDeletedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowDeletedSnackbar(false);
                }}
                message="Event type deleted!"
                // action={} undo
            />
            <Snackbar
                open={showEditedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowEditedSnackbar(false);
                }}
                message="Event type saved!"
                // action={} undo
            />
            <Snackbar
                open={showAddedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowAddedSnackbar(false);
                }}
                message="Event type added!"
            />
        </>
    );
};

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
            {view._id ? (
                <Button
                    variant="contained"
                    onClick={(e) => {
                        handlePopoverOpen(e);
                    }}
                    style={{
                        backgroundColor: view.view_color,
                        padding: "10px 30px 8px 30px",
                    }}
                >
                    {view.view_name}
                    <ArrowDropDownIcon sx={{ m: "0 2px" }} />
                </Button>
            ) : (
                <Button
                    variant="contained"
                    onClick={() => {
                        handleDialogOpen();
                    }}
                    style={{
                        backgroundColor: "",
                        padding: "10px 30px 8px 30px",
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
                <ViewsDropdown />
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
                <EventTypesDropdown />
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
                        boxShadow: "0 0px 10px rgba(0, 0, 0, 0.4)",
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
                    <ViewsDropdown />
                    <EventTypesDropdown />
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
