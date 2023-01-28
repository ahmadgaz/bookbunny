import {
    Box,
    Button,
    Dialog,
    Snackbar,
    TextField,
    useMediaQuery,
} from "@mui/material";
import { useContext, useState } from "react";
import { CRUDFunctionsContext } from "App";
import Schedule from "components/Schedule/Schedule";
import * as yup from "yup";
import { Formik } from "formik";

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

const View = () => {
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
                        user.views.length > 0
                            ? user.views
                            : getSelectedView()
                            ? [getSelectedView()]
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

export default View;
