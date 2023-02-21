import {
    Box,
    Button,
    Checkbox,
    Dialog,
    FormControlLabel,
    IconButton,
    Popover,
    Snackbar,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useContext, useState } from "react";
import { CRUDFunctionsContext } from "App";
import Schedule from "components/Schedule/Schedule";
import * as yup from "yup";
import { Formik } from "formik";
import Container from "components/Container";
import { useRef } from "react";
import { CheckBox, ChevronLeft, Delete, Edit, Link } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { tokens } from "theme";

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
                style={{}}
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
                            style={{}}
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
                            style={{}}
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
                            style={{}}
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
                            style={{}}
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
const EventTypes = () => {
    const { getSelectedView } = useContext(CRUDFunctionsContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);
    const [showDeletedSnackbar, setShowDeletedSnackbar] = useState(false);
    const [showEditedSnackbar, setShowEditedSnackbar] = useState(false);
    const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
    const view = { ...getSelectedView() };

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
            <>
                <ul
                    style={{
                        margin: "20px 0",
                        padding: 0,
                        listStyleType: "none",
                    }}
                >
                    {view.event_types &&
                        view.event_types.map((et, idx) => {
                            return (
                                <li key={idx}>
                                    <Box
                                        width="100%"
                                        style={{
                                            display: "flex",
                                            flexWrap: "nowrap",
                                            marginBottom: "20px",
                                            width: "100%",
                                        }}
                                    >
                                        <Box width="100%">
                                            <Box
                                                display="flex"
                                                width="100%"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="body1"
                                                    fontSize={16}
                                                    color="grey"
                                                >
                                                    {et.event_type_name}
                                                </Typography>
                                                <Box>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleEditDialogOpen(
                                                                et
                                                            );
                                                            handlePopoverClose();
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleDeleteDialogOpen(
                                                                et
                                                            );
                                                            handlePopoverClose();
                                                        }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                "test"
                                                            );
                                                            navigator.clipboard.writeText(
                                                                `${eventTypeURL}/${et._id}`
                                                            );
                                                            setShowCopiedSnackbar(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Link />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                fontSize={16}
                                                color="grey"
                                                textAlign="left"
                                            >
                                                {et.event_type_duration}
                                                {et.event_type_location && (
                                                    <hr />
                                                )}
                                                {et.event_type_location &&
                                                    et.event_type_location}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </li>
                            );
                        })}
                </ul>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        handleAddDialogOpen();
                        handlePopoverClose();
                    }}
                    style={{
                        backgroundColor: "",
                    }}
                >
                    Add Event Type +
                </Button>
            </>
        );
    };

    return (
        <>
            {eventTypeList()}
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

const DeleteViewDialog = (props) => {
    const { view, setShowDialog, setShowSnackbar } = props;
    const { deleteView } = useContext(CRUDFunctionsContext);

    const handleOnDelete = () => {
        deleteView(view);
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
            Are you sure you want to delete {view.view_name}?
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
const addViewSchema = yup.object().shape({
    view_name: yup.string().required("Enter a view name!"),
    view_desc: yup.string().notRequired(),
    view_color: yup.string().required("Pick a color!"),
});
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
const EditViewDialog = (props) => {
    const { view, setShowDialog, setShowSnackbar } = props;
    const { updateView } = useContext(CRUDFunctionsContext);

    const initialValuesAddView = {
        view_name: view.view_name,
        view_desc: view.view_desc,
        view_color: view.view_color,
    };

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
        let v = { ...view };
        v.view_name = values.view_name;
        v.view_desc = values.view_desc;
        v.view_color = values.view_color;
        updateView(v);
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
                        Edit View
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

const Abcdefg = () => {
    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(null);
    const [showDeletedSnackbar, setShowDeletedSnackbar] = useState(false);
    const [showEditedSnackbar, setShowEditedSnackbar] = useState(false);
    const view = { ...getSelectedView() };

    const handleDeleteDialogOpen = (v) => {
        setShowDeleteDialog(v);
    };
    const handleEditDialogOpen = (v) => {
        setShowEditDialog(v);
    };

    return (
        <Box
            display="flex"
            flexDirection={isNonMobileScreens ? "column" : "row"}
            flexWrap="nowrap"
            flexGrow="1"
            width="100%"
        >
            <Button
                onClick={() => {
                    handleEditDialogOpen(view);
                }}
            >
                Edit
            </Button>
            <br />
            <Box height="260px" width="100%">
                <Schedule
                    direction="horizontal"
                    type="write"
                    pxSize="750"
                    views={getSelectedView() ? [getSelectedView()] : []}
                    updateView={updateView}
                />
            </Box>
            <br />
            <Button
                onClick={() => {
                    handleDeleteDialogOpen(view);
                }}
            >
                Delete
            </Button>
            <br />
            <br />
            All views
            <Box height="260px" width="100%">
                <Schedule
                    direction="horizontal"
                    type="read"
                    pxSize="750"
                    views={
                        user.views
                            ? user.views.length > 0
                                ? user.views
                                : getSelectedView()
                                ? [getSelectedView()]
                                : []
                            : []
                    }
                />
            </Box>
            <Box height="260px" width="100%"></Box>
            {showDeleteDialog && (
                <DeleteViewDialog
                    view={showDeleteDialog}
                    setShowDialog={setShowDeleteDialog}
                    setShowSnackbar={setShowDeletedSnackbar}
                />
            )}
            {showEditDialog && (
                <EditViewDialog
                    view={showEditDialog}
                    setShowDialog={setShowEditDialog}
                    setShowSnackbar={setShowEditedSnackbar}
                />
            )}
            <Snackbar
                open={showDeletedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowDeletedSnackbar(false);
                }}
                message="View deleted!"
                // action={} undo
            />
            <Snackbar
                open={showEditedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowEditedSnackbar(false);
                }}
                message="View saved!"
                // action={} undo
            />
        </Box>
    );
};

const Views = (props) => {
    const { setShownViews } = props;
    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    let view = { ...getSelectedView() };

    const viewList = () => {
        if (user.views) {
            return (
                <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                    {user.views.map((v, idx) => {
                        return (
                            <li key={idx}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked
                                            onClick={(e) => {
                                                if (e.target.checked) {
                                                    setShownViews((prev) => {
                                                        return [...prev, v];
                                                    });
                                                } else {
                                                    setShownViews((prev) => {
                                                        console.log(
                                                            prev.filter(
                                                                (view) =>
                                                                    view._id !==
                                                                    v._id
                                                            )
                                                        );
                                                        return prev.filter(
                                                            (view) =>
                                                                view._id !==
                                                                v._id
                                                        );
                                                    });
                                                }
                                            }}
                                            sx={{
                                                color: v.view_color,
                                                "&.Mui-checked": {
                                                    color: v.view_color,
                                                },
                                            }}
                                        />
                                    }
                                    label={v.view_name}
                                />
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return null;
    };
    return <Box>{viewList()}</Box>;
};

const View = () => {
    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(null);
    const [showDeletedSnackbar, setShowDeletedSnackbar] = useState(false);
    const [showEditedSnackbar, setShowEditedSnackbar] = useState(false);
    const colors = tokens("light");
    const [leftArrowHovered, setLeftArrowHovered] = useState(false);
    const [rightArrowHovered, setRightArrowHovered] = useState(false);
    const [shownViews, setShownViews] = useState(
        user.views
            ? user.views.length > 0
                ? user.views
                : getSelectedView()
                ? [getSelectedView()]
                : []
            : []
    );
    const view = { ...getSelectedView() };

    const handleDeleteDialogOpen = (v) => {
        setShowDeleteDialog(v);
    };
    const handleEditDialogOpen = (v) => {
        setShowEditDialog(v);
    };

    return (
        <Box
            display="grid"
            p="20px"
            gridTemplateColumns="10vw 10vw 10vw 10vw 10vw 10vw 10vw"
            gridTemplateRows=" 60px 100px 100px 100px 100px 100px 100px"
            columnGap="20px"
            rowGap="20px"
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",

                    gridColumnStart: 1,
                    gridColumnEnd: 3,
                    gridRowStart: 1,
                    gridRowEnd: 5,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                    {" "}
                    <Typography variant="h2" margin="5px 0 10px 0">
                        Event Types
                    </Typography>
                    <EventTypes />
                </Container>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    gridColumnStart: 3,
                    gridColumnEnd: 6,
                    gridRowStart: 1,
                    gridRowEnd: 2,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    alignItems: "end",
                }}
            >
                {view._id ? (
                    <Box
                        display="flex"
                        paddingLeft="20px"
                        width="100%"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <div
                            onMouseOver={() => setLeftArrowHovered(true)}
                            onMouseLeave={() => setLeftArrowHovered(false)}
                            style={{
                                width: "30px",
                                cursor: "pointer",
                                height: "43.2px",
                            }}
                        >
                            <Box
                                backgroundColor={colors.neutralDark[500]}
                                sx={{
                                    position: "relative",
                                    width: "5px",
                                    height: "55%",
                                    rotate: "45deg",
                                    border: leftArrowHovered
                                        ? ` 4px solid ${colors.neutralDark[500]}`
                                        : ` 0px solid ${colors.neutralDark[500]}`,
                                    transition: "border 0.1s ease",
                                }}
                            ></Box>
                            <Box
                                backgroundColor={colors.neutralDark[500]}
                                sx={{
                                    position: "relative",
                                    top: leftArrowHovered ? "-12px" : "-10px",
                                    width: "5px",
                                    height: "55%",
                                    rotate: "-45deg",
                                    border: leftArrowHovered
                                        ? ` 4px solid ${colors.neutralDark[500]}`
                                        : ` 0px solid ${colors.neutralDark[500]}`,
                                    transition:
                                        "border 0.1s ease, top 0.1s ease",
                                }}
                            ></Box>
                        </div>
                        <Box flexGrow="1" paddingLeft="20px">
                            <Typography variant="h2">
                                {view.view_name}
                            </Typography>
                            <Typography
                                variant="body1"
                                fontSize={16}
                                color="grey"
                            >
                                {view.view_desc}
                            </Typography>
                        </Box>
                        <div
                            onMouseOver={() => setRightArrowHovered(true)}
                            onMouseLeave={() => setRightArrowHovered(false)}
                            style={{
                                width: "30px",
                                cursor: "pointer",
                                paddingRight: "25px",
                                height: "43.2px",
                            }}
                        >
                            <Box
                                backgroundColor={colors.neutralDark[500]}
                                sx={{
                                    position: "relative",
                                    width: "5px",
                                    height: "55%",
                                    rotate: "-45deg",
                                    border: rightArrowHovered
                                        ? ` 4px solid ${colors.neutralDark[500]}`
                                        : ` 0px solid ${colors.neutralDark[500]}`,
                                    transition: "border 0.1s ease",
                                }}
                            ></Box>
                            <Box
                                backgroundColor={colors.neutralDark[500]}
                                sx={{
                                    position: "relative",
                                    top: rightArrowHovered ? "-12px" : "-10px",
                                    width: "5px",
                                    height: "55%",
                                    rotate: "45deg",
                                    border: rightArrowHovered
                                        ? ` 4px solid ${colors.neutralDark[500]}`
                                        : ` 0px solid ${colors.neutralDark[500]}`,
                                    transition:
                                        "border 0.1s ease, top 0.1s ease",
                                }}
                            ></Box>
                        </div>
                    </Box>
                ) : (
                    <Typography variant="h2">No Views</Typography>
                )}
            </Box>
            <Button
                fullWidth
                variant="contained"
                onClick={() => {
                    handleEditDialogOpen(view);
                }}
                sx={{
                    gridColumnStart: 6,
                    gridColumnEnd: 7,
                    gridRowStart: 1,
                    gridRowEnd: 2,
                }}
            >
                Edit View
            </Button>
            <Button
                fullWidth
                onClick={() => {
                    handleDeleteDialogOpen(view);
                }}
                sx={{
                    backgroundColor: "white",
                    gridColumnStart: 7,
                    gridColumnEnd: 8,
                    gridRowStart: 1,
                    gridRowEnd: 2,
                }}
            >
                Delete View
            </Button>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    gridColumnStart: 3,
                    gridColumnEnd: 8,
                    gridRowStart: 2,
                    gridRowEnd: 5,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Container
                    fullWidth
                    fullHeight
                    button={false}
                    style={{
                        display: "flex",
                        padding: "30px",
                        height: "100%",
                        backgroundColor: "#fff",
                        textAlign: "center",
                    }}
                >
                    <Box height="260px" width="fit-content">
                        <Schedule
                            direction="horizontal"
                            type="write"
                            pxSize="650"
                            views={getSelectedView() ? [getSelectedView()] : []}
                            updateView={updateView}
                        />
                    </Box>
                </Container>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    gridColumnStart: 1,
                    gridColumnEnd: 3,
                    gridRowStart: 5,
                    gridRowEnd: 8,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                    <Typography variant="h2" margin="5px 0 10px 0">
                        All Views
                    </Typography>
                    <Views setShownViews={setShownViews} />
                </Container>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    gridColumnStart: 3,
                    gridColumnEnd: 8,
                    gridRowStart: 5,
                    gridRowEnd: 8,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                    <Box height="260px" width="fit-content">
                        <Schedule
                            direction="horizontal"
                            type="read"
                            pxSize="650"
                            views={shownViews}
                        />
                    </Box>
                </Container>
            </Box>
            {showDeleteDialog && (
                <DeleteViewDialog
                    view={showDeleteDialog}
                    setShowDialog={setShowDeleteDialog}
                    setShowSnackbar={setShowDeletedSnackbar}
                />
            )}
            {showEditDialog && (
                <EditViewDialog
                    view={showEditDialog}
                    setShowDialog={setShowEditDialog}
                    setShowSnackbar={setShowEditedSnackbar}
                />
            )}
            <Snackbar
                open={showDeletedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowDeletedSnackbar(false);
                }}
                message="View deleted!"
                // action={} undo
            />
            <Snackbar
                open={showEditedSnackbar}
                autoHideDuration={4000}
                onClose={() => {
                    setShowEditedSnackbar(false);
                }}
                message="View saved!"
                // action={} undo
            />
        </Box>
    );
};

export default View;
