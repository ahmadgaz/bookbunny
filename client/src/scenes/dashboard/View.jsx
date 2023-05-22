import {
    Box,
    Button,
    Checkbox,
    Dialog,
    FormControlLabel,
    IconButton,
    Paper,
    Popover,
    Snackbar,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useContext, useState } from "react";
import { showSnackbar, hideSnackbar } from "state";
import { CRUDFunctionsContext } from "App";
import Schedule from "components/Schedule/Schedule";
import * as yup from "yup";
import { Formik } from "formik";
import Container from "components/Container";
import { useRef } from "react";
import { CheckBox, ChevronLeft, Delete, Edit, Link } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { tokens } from "theme";
import { useDispatch, useSelector } from "react-redux";

const DeleteEventTypeDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { eventType, setShowDialog } = props;
    const { getSelectedView, deleteEventType } =
        useContext(CRUDFunctionsContext);
    let view = { ...getSelectedView() };
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const dispatch = useDispatch();

    const handleOnDelete = () => {
        deleteEventType(view, eventType);
        setShowDialog(null);
        dispatch(showSnackbar({ snackbar: "eventTypeDeleted" }));
    };

    return (
        <Dialog
            fullScreen={!isNonMobileScreens}
            open
            onClose={() => {
                setShowDialog(null);
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
                        width: "max-content",
                        backgroundColor: colors.neutralLight[100],
                        textAlign: "center",
                    }}
                >
                    <Box
                        display="grid"
                        width="350px"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                        <Typography
                            variant="body1"
                            color={colors.neutralDark[300]}
                            sx={{ gridColumn: "span 4" }}
                        >
                            Are you sure you want to delete{" "}
                            {eventType.event_type_name}?
                        </Typography>
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
                            onClick={handleOnDelete}
                            style={{
                                padding: "10px 30px 8px 30px",
                                gridColumn: "span 2",
                                backgroundColor: colors.redAccent[500],
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
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
                    <Box
                        display="grid"
                        width="350px"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                        <Typography variant="h3" sx={{ gridColumn: "span 4" }}>
                            Are you sure you want to delete{" "}
                            {eventType.event_type_name}?
                        </Typography>
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
                            onClick={handleOnDelete}
                            style={{
                                padding: "10px 30px 8px 30px",
                                gridColumn: "span 2",
                                backgroundColor: colors.redAccent[500],
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Paper>
            )}
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
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { eventType, setShowDialog } = props;
    const { getSelectedView, updateEventType } =
        useContext(CRUDFunctionsContext);
    let view = { ...getSelectedView() };
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

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
        dispatch(showSnackbar({ snackbar: "eventTypeEdited" }));
        onSubmitProps.resetForm();
    };

    return (
        <Dialog
            fullScreen={!isNonMobileScreens}
            open
            onClose={() => {
                setShowDialog(null);
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
                    <Typography variant="h3" margin="5px 0 25px 0">
                        Edit Event Type
                    </Typography>
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
                                <Box
                                    display="grid"
                                    width="350px"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    gridTemplateRows="repeat(3, minmax(0, 1fr)"
                                >
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
                                        sx={{ gridColumn: "span 2" }}
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
                                            Boolean(
                                                touched.event_type_duration
                                            ) &&
                                            Boolean(errors.event_type_duration)
                                        }
                                        helperText={
                                            touched.event_type_duration &&
                                            errors.event_type_duration
                                        }
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Event Type Location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.event_type_location}
                                        name="event_type_location"
                                        error={
                                            Boolean(
                                                touched.event_type_location
                                            ) &&
                                            Boolean(errors.event_type_location)
                                        }
                                        helperText={
                                            touched.event_type_location &&
                                            errors.event_type_location
                                        }
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        style={{}}
                                        onClick={() => {
                                            setShowDialog(null);
                                        }}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        type="submit"
                                        style={{}}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        Save
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
                        Edit Event Type
                    </Typography>
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
                                <Box
                                    display="grid"
                                    width="350px"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    gridTemplateRows="repeat(3, minmax(0, 1fr)"
                                >
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
                                        sx={{ gridColumn: "span 2" }}
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
                                            Boolean(
                                                touched.event_type_duration
                                            ) &&
                                            Boolean(errors.event_type_duration)
                                        }
                                        helperText={
                                            touched.event_type_duration &&
                                            errors.event_type_duration
                                        }
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Event Type Location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.event_type_location}
                                        name="event_type_location"
                                        error={
                                            Boolean(
                                                touched.event_type_location
                                            ) &&
                                            Boolean(errors.event_type_location)
                                        }
                                        helperText={
                                            touched.event_type_location &&
                                            errors.event_type_location
                                        }
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        style={{}}
                                        onClick={() => {
                                            setShowDialog(null);
                                        }}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        type="submit"
                                        style={{}}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        Save
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
const initialValuesAddEventType = {
    event_type_name: "",
    event_type_duration: "",
    event_type_location: "",
};
const AddEventTypeDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { setShowDialog } = props;
    const { getSelectedView, createEventType } =
        useContext(CRUDFunctionsContext);
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    let view = { ...getSelectedView() };

    const handleFormSubmit = (values, onSubmitProps) => {
        createEventType(
            view,
            values.event_type_name,
            values.event_type_duration,
            values.event_type_location
        );
        setShowDialog(false);
        dispatch(showSnackbar({ snackbar: "eventTypeAdded" }));
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
                    <Typography variant="h3" margin="5px 0 25px 0">
                        Add Event Type
                    </Typography>
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
                                <Box
                                    display="grid"
                                    width="350px"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    gridTemplateRows="repeat(3, minmax(0, 1fr)"
                                >
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
                                        sx={{ gridColumn: "span 2" }}
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
                                            Boolean(
                                                touched.event_type_duration
                                            ) &&
                                            Boolean(errors.event_type_duration)
                                        }
                                        helperText={
                                            touched.event_type_duration &&
                                            errors.event_type_duration
                                        }
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Event Type Location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.event_type_location}
                                        name="event_type_location"
                                        error={
                                            Boolean(
                                                touched.event_type_location
                                            ) &&
                                            Boolean(errors.event_type_location)
                                        }
                                        helperText={
                                            touched.event_type_location &&
                                            errors.event_type_location
                                        }
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        style={{}}
                                        onClick={() => {
                                            setShowDialog(false);
                                        }}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        type="submit"
                                        style={{}}
                                        sx={{ gridColumn: "span 2" }}
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
                        Add Event Type
                    </Typography>
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
                                <Box
                                    display="grid"
                                    width="350px"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    gridTemplateRows="repeat(3, minmax(0, 1fr)"
                                >
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
                                        sx={{ gridColumn: "span 2" }}
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
                                            Boolean(
                                                touched.event_type_duration
                                            ) &&
                                            Boolean(errors.event_type_duration)
                                        }
                                        helperText={
                                            touched.event_type_duration &&
                                            errors.event_type_duration
                                        }
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Event Type Location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.event_type_location}
                                        name="event_type_location"
                                        error={
                                            Boolean(
                                                touched.event_type_location
                                            ) &&
                                            Boolean(errors.event_type_location)
                                        }
                                        helperText={
                                            touched.event_type_location &&
                                            errors.event_type_location
                                        }
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        style={{}}
                                        onClick={() => {
                                            setShowDialog(false);
                                        }}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        type="submit"
                                        style={{}}
                                        sx={{ gridColumn: "span 2" }}
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
const eventTypeURL = `${process.env.REACT_APP_CLIENT_BASE_URL}/newEvent`;
const EventTypes = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const { getSelectedView } = useContext(CRUDFunctionsContext);
    const dispatch = useDispatch();
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
                                            <Typography
                                                variant="body1"
                                                textAlign="left"
                                            >
                                                {et.event_type_name}
                                            </Typography>
                                            <Box
                                                display="flex"
                                                width="100%"
                                                justifyContent="left"
                                                alignItems="center"
                                            >
                                                {et.event_type_location ? (
                                                    <Typography
                                                        variant="subtitle1"
                                                        color={
                                                            colors
                                                                .neutralDark[300]
                                                        }
                                                        textAlign="left"
                                                    >
                                                        <b>Duration: </b>
                                                        {et.event_type_duration}
                                                        &ensp;|&ensp;
                                                        <b>Location: </b>
                                                        {et.event_type_location}
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        variant="subtitle1"
                                                        color={
                                                            colors
                                                                .neutralDark[300]
                                                        }
                                                        textAlign="left"
                                                    >
                                                        <b>Duration: </b>
                                                        {et.event_type_duration}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <hr
                                                style={{ marginBottom: "2px" }}
                                            />
                                            <Box
                                                display="flex"
                                                width="100%"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <IconButton
                                                    onClick={() => {
                                                        handleEditDialogOpen(
                                                            et
                                                        );
                                                        handlePopoverClose();
                                                    }}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <Edit
                                                        sx={{
                                                            transform:
                                                                "scale(0.8)",
                                                        }}
                                                    />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => {
                                                        handleDeleteDialogOpen(
                                                            et
                                                        );
                                                        handlePopoverClose();
                                                    }}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <Delete
                                                        sx={{
                                                            transform:
                                                                "scale(0.8)",
                                                        }}
                                                    />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            "test"
                                                        );
                                                        navigator.clipboard.writeText(
                                                            `${eventTypeURL}/${et._id}`
                                                        );
                                                        dispatch(
                                                            showSnackbar({
                                                                snackbar:
                                                                    "eventTypeCopied",
                                                            })
                                                        );
                                                    }}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <Link
                                                        sx={{
                                                            transform:
                                                                "scale(0.8)",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </li>
                            );
                        })}
                </ul>
                <Button
                    disabled={!view._id}
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
                />
            )}
            {showEditDialog && (
                <EditEventTypeDialog
                    eventType={showEditDialog}
                    setShowDialog={setShowEditDialog}
                />
            )}
            {showAddDialog && (
                <AddEventTypeDialog setShowDialog={setShowAddDialog} />
            )}
        </>
    );
};

const DeleteViewDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const themeColors = [
        colors.neutralDark[500],
        colors.redAccent[500],
        colors.primary[500],
        colors.neutralLight[500],
        colors.secondary[500],
    ];
    const { view, setShowDialog } = props;
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { deleteView } = useContext(CRUDFunctionsContext);
    const dispatch = useDispatch();

    const handleOnDelete = () => {
        deleteView(view);
        setShowDialog(null);
        dispatch(showSnackbar({ snackbar: "viewDeleted" }));
    };

    return (
        <Dialog
            fullScreen={!isNonMobileScreens}
            open
            onClose={() => {
                setShowDialog(null);
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
                        width: "max-content",
                        backgroundColor: colors.neutralLight[100],
                        textAlign: "center",
                    }}
                >
                    <Box
                        display="grid"
                        width="350px"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                        <Typography
                            variant="body1"
                            color={colors.neutralDark[300]}
                            sx={{ gridColumn: "span 4" }}
                        >
                            Are you sure you want to delete {view.view_name}?
                        </Typography>
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
                            onClick={handleOnDelete}
                            style={{
                                padding: "10px 30px 8px 30px",
                                gridColumn: "span 2",
                                backgroundColor: colors.redAccent[500],
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
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
                    <Box
                        display="grid"
                        width="350px"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                        <Typography variant="h3" sx={{ gridColumn: "span 4" }}>
                            Are you sure you want to delete {view.view_name}?
                        </Typography>
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
                            onClick={handleOnDelete}
                            style={{
                                padding: "10px 30px 8px 30px",
                                gridColumn: "span 2",
                                backgroundColor: colors.redAccent[500],
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Paper>
            )}
        </Dialog>
    );
};
const addViewSchema = yup.object().shape({
    view_name: yup.string().required("Enter a view name!"),
    view_desc: yup.string().notRequired(),
    view_color: yup.string().required("Pick a color!"),
});
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
const EditViewDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    const themeColors = [
        colors.neutralDark[500],
        colors.redAccent[500],
        colors.primary[500],
        colors.neutralLight[500],
        colors.secondary[500],
    ];

    const { view, setShowDialog } = props;
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { updateView } = useContext(CRUDFunctionsContext);
    const dispatch = useDispatch();

    const initialValuesAddView = {
        view_name: view.view_name,
        view_desc: view.view_desc,
        view_color: view.view_color,
    };

    const ColorPicker = (props) => {
        const { error, value, handleChange, helperText } = props;

        return (
            <>
                {themeColors.map((color, idx) => (
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
        dispatch(showSnackbar({ snackbar: "viewEdited" }));
        onSubmitProps.resetForm();
    };

    return (
        <Dialog
            fullScreen={!isNonMobileScreens}
            open
            onClose={() => {
                setShowDialog(null);
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
                    <Typography variant="h3" margin="5px 0 25px 0">
                        Edit View
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
                                        Save
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
                        alignItems: "center",
                        width: "100vw",
                        height: "100vh",
                    }}
                >
                    <Typography variant="h1" margin="5px 0 25px 0">
                        Edit View
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
                                        Save
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

const Views = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { setShownViews } = props;
    const { user } = useContext(CRUDFunctionsContext);

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
                                                        return [...prev, v._id];
                                                    });
                                                } else {
                                                    setShownViews((prev) => {
                                                        return prev.filter(
                                                            (viewid) =>
                                                                viewid !== v._id
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
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { user, getSelectedView, updateView } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(null);
    const [showDeletedSnackbar, setShowDeletedSnackbar] = useState(false);
    const [showEditedSnackbar, setShowEditedSnackbar] = useState(false);
    const [leftArrowHovered, setLeftArrowHovered] = useState(false);
    const [rightArrowHovered, setRightArrowHovered] = useState(false);
    const [shownViews, setShownViews] = useState(
        user.views
            ? user.views.length > 0
                ? user.views.map((view) => {
                      return view._id;
                  })
                : getSelectedView()
                ? [getSelectedView()._id]
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
    const setPrevView = () => {
        let cur = user.views.findIndex((v) => v._id === view._id);
        let selectedView = {
            ...user.views[cur === 0 ? user.views.length - 1 : cur - 1],
        };
        if (view._id === selectedView._id) {
            return;
        } else {
            view.view_selected = false;
            selectedView.view_selected = true;
            updateView(view);
            updateView(selectedView);
        }
    };
    const setNextView = () => {
        let cur = user.views.findIndex((v) => v._id === view._id);
        let selectedView = {
            ...user.views[cur === user.views.length - 1 ? 0 : cur + 1],
        };
        if (view._id === selectedView._id) {
            return;
        } else {
            view.view_selected = false;
            selectedView.view_selected = true;
            updateView(view);
            updateView(selectedView);
        }
    };

    return isNonMobileScreens ? (
        <Box marginBottom="30px">
            <Box width="1200px" maxWidth="80vw">
                <Box
                    display="grid"
                    p="20px"
                    gridTemplateColumns="12.6% 12.6% 12.6% 12.6% 12.6% 12.6% 12.6%"
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
                                backgroundColor: colors.neutralLight[100],
                                textAlign: "center",
                            }}
                        >
                            {" "}
                            <Typography variant="h3" margin="5px 0 10px 0">
                                <b>Event Types</b>
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
                                    onClick={() => {
                                        setPrevView();
                                    }}
                                    onMouseOver={() =>
                                        setLeftArrowHovered(true)
                                    }
                                    onMouseLeave={() =>
                                        setLeftArrowHovered(false)
                                    }
                                    style={{
                                        width: "30px",
                                        cursor: "pointer",
                                        height: "43.2px",
                                    }}
                                >
                                    <Box
                                        backgroundColor={
                                            colors.neutralDark[500]
                                        }
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
                                        backgroundColor={
                                            colors.neutralDark[500]
                                        }
                                        sx={{
                                            position: "relative",
                                            top: leftArrowHovered
                                                ? "-12px"
                                                : "-10px",
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
                                    <Typography variant="h3">
                                        <b>{view.view_name}</b>
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color={colors.neutralDark[300]}
                                    >
                                        {view.view_desc}
                                    </Typography>
                                </Box>
                                <div
                                    onClick={() => {
                                        setNextView();
                                    }}
                                    onMouseOver={() =>
                                        setRightArrowHovered(true)
                                    }
                                    onMouseLeave={() =>
                                        setRightArrowHovered(false)
                                    }
                                    style={{
                                        width: "30px",
                                        cursor: "pointer",
                                        paddingRight: "25px",
                                        height: "43.2px",
                                    }}
                                >
                                    <Box
                                        backgroundColor={
                                            colors.neutralDark[500]
                                        }
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
                                        backgroundColor={
                                            colors.neutralDark[500]
                                        }
                                        sx={{
                                            position: "relative",
                                            top: rightArrowHovered
                                                ? "-12px"
                                                : "-10px",
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
                            <Typography
                                variant="h3"
                                color={colors.neutralDark[300]}
                            >
                                <b>No Views</b>
                            </Typography>
                        )}
                    </Box>
                    <Button
                        fullWidth
                        disabled={!view._id}
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
                        disabled={!view._id}
                        onClick={() => {
                            handleDeleteDialogOpen(view);
                        }}
                        sx={{
                            backgroundColor: colors.neutralLight[100],
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
                                backgroundColor: colors.neutralLight[100],
                                textAlign: "center",
                            }}
                        >
                            {/* <TransformWrapper>
                            <TransformComponent> */}
                            <Box height="260px" width="fit-content">
                                <Schedule
                                    direction="horizontal"
                                    type="write"
                                    pxSize="650"
                                    views={
                                        getSelectedView()
                                            ? [getSelectedView()]
                                            : []
                                    }
                                    updateView={updateView}
                                />
                            </Box>
                            {/* </TransformComponent>
                        </TransformWrapper> */}
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
                                backgroundColor: colors.neutralLight[100],
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="h3" margin="5px 0 10px 0">
                                <b>All Views</b>
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
                                backgroundColor: colors.neutralLight[100],
                                textAlign: "center",
                            }}
                        >
                            <Box height="260px" width="fit-content">
                                {shownViews.length > 0 ? (
                                    <Schedule
                                        direction="horizontal"
                                        type="read"
                                        pxSize="650"
                                        views={
                                            user.views
                                                ? user.views.length > 0
                                                    ? user.views.filter(
                                                          (view) =>
                                                              shownViews.some(
                                                                  (viewid) =>
                                                                      viewid ===
                                                                      view._id
                                                              )
                                                      )
                                                    : getSelectedView()
                                                    ? [getSelectedView()]
                                                    : []
                                                : []
                                        }
                                    />
                                ) : user.views ? (
                                    user.views.length <= 0 ? (
                                        <Typography
                                            variant="h3"
                                            color={colors.neutralDark[300]}
                                        >
                                            <b>Create a View!</b>
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="h3"
                                            color={colors.neutralDark[300]}
                                        >
                                            <b>Select a View</b>
                                        </Typography>
                                    )
                                ) : (
                                    <Typography
                                        variant="h3"
                                        color={colors.neutralDark[300]}
                                    >
                                        <b>Log In to See Your Views!</b>
                                    </Typography>
                                )}
                            </Box>
                        </Container>
                    </Box>
                    {showDeleteDialog && (
                        <DeleteViewDialog
                            view={showDeleteDialog}
                            setShowDialog={setShowDeleteDialog}
                        />
                    )}
                    {showEditDialog && (
                        <EditViewDialog
                            view={showEditDialog}
                            setShowDialog={setShowEditDialog}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    ) : (
        <Box marginBottom="30px">
            <Box
                display="grid"
                p="20px"
                paddingBottom="80px"
                gridTemplateColumns="9.5vw 9.5vw 9.5vw 9.5vw 9.5vw 9.5vw 9.5vw"
                gridTemplateRows="100px 100px fit-content 40px 100px 100px 100px 100px 100px 100px 100px"
                columnGap="20px"
                rowGap="20px"
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        gridColumnStart: 1,
                        gridColumnEnd: 8,
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
                                onClick={() => {
                                    setPrevView();
                                }}
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
                                        top: leftArrowHovered
                                            ? "-12px"
                                            : "-10px",
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
                                <Typography variant="h3">
                                    <b>{view.view_name}</b>
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    color={colors.neutralDark[300]}
                                >
                                    {view.view_desc}
                                </Typography>
                            </Box>
                            <div
                                onClick={() => {
                                    setNextView();
                                }}
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
                                        top: rightArrowHovered
                                            ? "-12px"
                                            : "-10px",
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
                        <Typography
                            variant="h3"
                            color={colors.neutralDark[300]}
                        >
                            <b>No Views</b>
                        </Typography>
                    )}
                </Box>
                <Button
                    fullWidth
                    disabled={!view._id}
                    variant="contained"
                    onClick={() => {
                        handleEditDialogOpen(view);
                    }}
                    sx={{
                        gridColumnStart: 1,
                        gridColumnEnd: 4,
                        gridRowStart: 2,
                        gridRowEnd: 3,
                    }}
                >
                    Edit View
                </Button>
                <Button
                    fullWidth
                    disabled={!view._id}
                    onClick={() => {
                        handleDeleteDialogOpen(view);
                    }}
                    sx={{
                        backgroundColor: colors.neutralLight[100],
                        gridColumnStart: 5,
                        gridColumnEnd: 8,
                        gridRowStart: 2,
                        gridRowEnd: 3,
                    }}
                >
                    Delete View
                </Button>
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        gridColumnStart: 1,
                        gridColumnEnd: 8,
                        gridRowStart: 3,
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
                            backgroundColor: colors.neutralLight[100],
                            textAlign: "center",
                        }}
                    >
                        {" "}
                        <Typography variant="h3" margin="5px 0 10px 0">
                            <b>Event Types</b>
                        </Typography>
                        <EventTypes />
                    </Container>
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        gridColumnStart: 1,
                        gridColumnEnd: 8,
                        gridRowStart: 5,
                        gridRowEnd: 7,
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
                            scrollbars: "",
                            // touchAction: "none",
                            display: "flex",
                            flexDirection: "column",
                            padding: "20px",
                            height: "100%",
                            backgroundColor: colors.neutralLight[100],
                            textAlign: "center",
                        }}
                    >
                        <Box width="710px">
                            <Box
                                margin="0 0 20px 0"
                                borderRadius="25px"
                                height="50px"
                                width="100%"
                                sx={{
                                    background: `repeating-linear-gradient(45deg, ${colors.neutralLight[600]}AA, ${colors.neutralLight[600]}AA 1px,  ${colors.neutralLight[600]}7F 2.5px,  ${colors.neutralLight[600]}7F 10px)`,
                                }}
                            ></Box>
                            <Box
                                height="260px"
                                width="fit-content"
                                sx={{
                                    overflow: "none",
                                }}
                            >
                                <Schedule
                                    direction="horizontal"
                                    type="write"
                                    pxSize="650"
                                    views={
                                        getSelectedView()
                                            ? [getSelectedView()]
                                            : []
                                    }
                                    updateView={updateView}
                                />
                            </Box>
                        </Box>
                    </Container>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        gridColumnStart: 1,
                        gridColumnEnd: 8,
                        gridRowStart: 7,
                        gridRowEnd: 9,
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
                            backgroundColor: colors.neutralLight[100],
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h3" margin="5px 0 10px 0">
                            <b>All Views</b>
                        </Typography>
                        <Views setShownViews={setShownViews} />
                    </Container>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        gridColumnStart: 1,
                        gridColumnEnd: 8,
                        gridRowStart: 9,
                        gridRowEnd: 11,
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
                            backgroundColor: colors.neutralLight[100],
                            textAlign: "center",
                        }}
                    >
                        <Box height="260px" width="fit-content">
                            {shownViews.length > 0 ? (
                                <Schedule
                                    direction="horizontal"
                                    type="read"
                                    pxSize="650"
                                    views={
                                        user.views
                                            ? user.views.length > 0
                                                ? user.views.filter((view) =>
                                                      shownViews.some(
                                                          (viewid) =>
                                                              viewid ===
                                                              view._id
                                                      )
                                                  )
                                                : getSelectedView()
                                                ? [getSelectedView()]
                                                : []
                                            : []
                                    }
                                />
                            ) : user.views ? (
                                user.views.length <= 0 ? (
                                    <Typography
                                        variant="h3"
                                        color={colors.neutralDark[300]}
                                    >
                                        <b>Create a View!</b>
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="h3"
                                        color={colors.neutralDark[300]}
                                    >
                                        <b>Select a View</b>
                                    </Typography>
                                )
                            ) : (
                                <Typography
                                    variant="h3"
                                    color={colors.neutralDark[300]}
                                >
                                    <b>Log In to See Your Views!</b>
                                </Typography>
                            )}
                        </Box>
                    </Container>
                </Box>
                {showDeleteDialog && (
                    <DeleteViewDialog
                        view={showDeleteDialog}
                        setShowDialog={setShowDeleteDialog}
                    />
                )}
                {showEditDialog && (
                    <EditViewDialog
                        view={showEditDialog}
                        setShowDialog={setShowEditDialog}
                    />
                )}
            </Box>
        </Box>
    );
};

export default View;
