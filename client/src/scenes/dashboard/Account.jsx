import {
    Box,
    Button,
    TextField,
    Dialog,
    Paper,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { CRUDFunctionsContext } from "App";
import Container from "components/Container";
import * as yup from "yup";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "theme";
import { setLogout, showSnackbar } from "state";
import { useNavigate } from "react-router-dom";

const profileSchema = yup.object().shape({
    first_name: yup.string().required("Enter your first name!"),
    last_name: yup.string().notRequired(),
    email: yup.string().email("Invalid email").required("Enter an email!"),
});
const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required("Enter your current password!"),
    newPassword: yup
        .string()
        .required("Enter a password!")
        .min(8, "Password must be 8 characters long!")
        .matches(/[0-9]/, "Password requires a number!")
        .matches(/[a-z]/, "Password requires a lowercase letter!")
        .matches(/[A-Z]/, "Password requires an uppercase letter!")
        .matches(/[^\w]/, "Password requires a symbol!"),
    passwordConfirm: yup
        .string()
        .required("Confirm your password!")
        .oneOf(
            [yup.ref("newPassword"), null],
            'Must match "New Password" field value'
        ),
});
const unlinkAccountNewPasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .required("Enter a password!")
        .min(8, "Password must be 8 characters long!")
        .matches(/[0-9]/, "Password requires a number!")
        .matches(/[a-z]/, "Password requires a lowercase letter!")
        .matches(/[A-Z]/, "Password requires an uppercase letter!")
        .matches(/[^\w]/, "Password requires a symbol!"),
    passwordConfirm: yup
        .string()
        .required("Confirm your password!")
        .oneOf(
            [yup.ref("newPassword"), null],
            'Must match "New Password" field value'
        ),
});

const DeleteAccountDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { setShowDialog } = props;
    const { deleteUser } = useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const dispatch = useDispatch();

    const handleOnDelete = async () => {
        await deleteUser();
        dispatch(setLogout());
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
                            Are you sure you want to delete your account?
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
                            Are you sure you want to delete your account?
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
const UnlinkFromGoogleDialog = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { setShowDialog, setConnectedToGoogle } = props;
    const { unlinkFromGoogle } = useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const dispatch = useDispatch();
    const [passError, setPassError] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState();

    const initialValuesPassword = {
        newPassword: "",
        passwordConfirm: "",
    };

    const handleOnUnlink = async (values, onSubmitProps) => {
        const unlinkedFromGoogleResponse = await unlinkFromGoogle(
            values.newPassword
        );

        if (unlinkedFromGoogleResponse.err) {
            setPassError(unlinkedFromGoogleResponse.err);
            return;
        }
        if (!unlinkedFromGoogleResponse.msg) {
            setPassError(
                "There has been a error in the server. Try again later."
            );
            return;
        }

        onSubmitProps.resetForm();
        setShowPasswordRequirements(null);
        setConnectedToGoogle(false);
        setPassError(null);
        setShowDialog(null);
        dispatch(showSnackbar({ snackbar: "googleAccountUnlinked" }));
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
                            You must create a new password to continue unlinking
                            your account
                        </Typography>
                        <Formik
                            onSubmit={handleOnUnlink}
                            initialValues={initialValuesPassword}
                            validationSchema={unlinkAccountNewPasswordSchema}
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
                                <form
                                    onSubmit={handleSubmit}
                                    style={{ gridColumn: "span 4" }}
                                >
                                    {passError && (
                                        <Typography
                                            textAlign="left"
                                            variant="h6"
                                            margin="0 0 10px 0"
                                            color={colors.redAccent[500]}
                                        >
                                            {passError}
                                        </Typography>
                                    )}

                                    {/* FIELDS */}
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": {
                                                gridColumn: isNonMobile
                                                    ? undefined
                                                    : "span 4",
                                            },
                                        }}
                                    >
                                        <TextField
                                            label="New Password*"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setShowPasswordRequirements(
                                                    e.target.value
                                                );
                                                handleChange(e);
                                            }}
                                            value={values.newPassword}
                                            name="newPassword"
                                            error={
                                                Boolean(touched.newPassword) &&
                                                Boolean(errors.newPassword)
                                            }
                                            helperText={
                                                touched.newPassword &&
                                                errors.newPassword
                                            }
                                            sx={{
                                                gridColumn: "span 4",
                                            }}
                                        />
                                        {showPasswordRequirements && (
                                            <Box
                                                sx={{
                                                    gridColumn: "span 4",
                                                    opacity:
                                                        showPasswordRequirements
                                                            ? "100%"
                                                            : "0%",
                                                    transition:
                                                        "opacity 0.2s ease",
                                                }}
                                            >
                                                <Container
                                                    fullWidth
                                                    button={false}
                                                    style={{
                                                        padding: "15px",
                                                        backgroundColor:
                                                            colors
                                                                .secondary[200],
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <Typography variant="h6">
                                                        <b>
                                                            Your password must:
                                                        </b>
                                                    </Typography>

                                                    <ul>
                                                        <li>
                                                            <Typography
                                                                variant="body1"
                                                                fontSize={14}
                                                            >
                                                                Contain at least{" "}
                                                                <b>
                                                                    8 characters
                                                                </b>
                                                            </Typography>
                                                        </li>
                                                        <li>
                                                            <Typography
                                                                variant="body1"
                                                                fontSize={14}
                                                            >
                                                                Contain at least{" "}
                                                                <b>1 number</b>,{" "}
                                                                <b>
                                                                    1 lowercase
                                                                    letter
                                                                </b>
                                                                ,{" "}
                                                                <b>
                                                                    1 uppercase
                                                                    letter
                                                                </b>
                                                                , and{" "}
                                                                <b>
                                                                    1 unique
                                                                    character
                                                                </b>
                                                            </Typography>
                                                        </li>
                                                    </ul>
                                                </Container>
                                            </Box>
                                        )}

                                        <TextField
                                            label="Confirm Password*"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.passwordConfirm}
                                            name="passwordConfirm"
                                            error={
                                                Boolean(
                                                    touched.passwordConfirm
                                                ) &&
                                                Boolean(errors.passwordConfirm)
                                            }
                                            helperText={
                                                touched.passwordConfirm &&
                                                errors.passwordConfirm
                                            }
                                            sx={{
                                                gridColumn: "span 4",
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            style={{}}
                                            onClick={() => {
                                                setShowPasswordRequirements(
                                                    null
                                                );
                                                resetForm();
                                                setPassError(null);
                                                setShowDialog(null);
                                            }}
                                            sx={{
                                                gridColumn: "span 2",
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={
                                                !Boolean(
                                                    touched.currentPassword
                                                ) &&
                                                !Boolean(touched.newPassword) &&
                                                !Boolean(
                                                    touched.passwordConfirm
                                                )
                                            }
                                            variant="contained"
                                            color="error"
                                            type="submit"
                                            style={{}}
                                            sx={{
                                                gridColumn: "span 2",
                                            }}
                                        >
                                            Unlink
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
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
                            You must create a new password to continue unlinking
                            your account
                        </Typography>
                        <Formik
                            onSubmit={handleOnUnlink}
                            initialValues={initialValuesPassword}
                            validationSchema={unlinkAccountNewPasswordSchema}
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
                                <form
                                    onSubmit={handleSubmit}
                                    style={{ gridColumn: "span 4" }}
                                >
                                    {passError && (
                                        <Typography
                                            textAlign="left"
                                            variant="h6"
                                            margin="0 0 10px 0"
                                            color={colors.redAccent[500]}
                                        >
                                            {passError}
                                        </Typography>
                                    )}

                                    {/* FIELDS */}
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": {
                                                gridColumn: isNonMobile
                                                    ? undefined
                                                    : "span 4",
                                            },
                                        }}
                                    >
                                        <TextField
                                            label="New Password*"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setShowPasswordRequirements(
                                                    e.target.value
                                                );
                                                handleChange(e);
                                            }}
                                            value={values.newPassword}
                                            name="newPassword"
                                            error={
                                                Boolean(touched.newPassword) &&
                                                Boolean(errors.newPassword)
                                            }
                                            helperText={
                                                touched.newPassword &&
                                                errors.newPassword
                                            }
                                            sx={{
                                                gridColumn: "span 4",
                                            }}
                                        />
                                        {showPasswordRequirements && (
                                            <Box
                                                sx={{
                                                    gridColumn: "span 4",
                                                    opacity:
                                                        showPasswordRequirements
                                                            ? "100%"
                                                            : "0%",
                                                    transition:
                                                        "opacity 0.2s ease",
                                                }}
                                            >
                                                <Container
                                                    fullWidth
                                                    button={false}
                                                    style={{
                                                        padding: "15px",
                                                        backgroundColor:
                                                            colors
                                                                .secondary[200],
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <Typography variant="h6">
                                                        <b>
                                                            Your password must:
                                                        </b>
                                                    </Typography>

                                                    <ul>
                                                        <li>
                                                            <Typography
                                                                variant="body1"
                                                                fontSize={14}
                                                            >
                                                                Contain at least{" "}
                                                                <b>
                                                                    8 characters
                                                                </b>
                                                            </Typography>
                                                        </li>
                                                        <li>
                                                            <Typography
                                                                variant="body1"
                                                                fontSize={14}
                                                            >
                                                                Contain at least{" "}
                                                                <b>1 number</b>,{" "}
                                                                <b>
                                                                    1 lowercase
                                                                    letter
                                                                </b>
                                                                ,{" "}
                                                                <b>
                                                                    1 uppercase
                                                                    letter
                                                                </b>
                                                                , and{" "}
                                                                <b>
                                                                    1 unique
                                                                    character
                                                                </b>
                                                            </Typography>
                                                        </li>
                                                    </ul>
                                                </Container>
                                            </Box>
                                        )}

                                        <TextField
                                            label="Confirm Password*"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.passwordConfirm}
                                            name="passwordConfirm"
                                            error={
                                                Boolean(
                                                    touched.passwordConfirm
                                                ) &&
                                                Boolean(errors.passwordConfirm)
                                            }
                                            helperText={
                                                touched.passwordConfirm &&
                                                errors.passwordConfirm
                                            }
                                            sx={{
                                                gridColumn: "span 4",
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            style={{}}
                                            onClick={() => {
                                                setShowPasswordRequirements(
                                                    null
                                                );
                                                resetForm();
                                                setPassError(null);
                                                setShowDialog(null);
                                            }}
                                            sx={{
                                                gridColumn: "span 2",
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={
                                                !Boolean(
                                                    touched.currentPassword
                                                ) &&
                                                !Boolean(touched.newPassword) &&
                                                !Boolean(
                                                    touched.passwordConfirm
                                                )
                                            }
                                            variant="contained"
                                            color="error"
                                            type="submit"
                                            style={{}}
                                            sx={{
                                                gridColumn: "span 2",
                                            }}
                                        >
                                            Unlink
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Paper>
            )}
        </Dialog>
    );
};

const Account = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const {
        user,
        isConnectedToGoogle,
        updateName,
        updatePass,
        confirmPassword,
    } = useContext(CRUDFunctionsContext);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isNonMobileScreens = useMediaQuery("(min-width: 1400px)");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [connectedToGoogle, setConnectedToGoogle] = useState();
    const [profError, setProfError] = useState(null);
    const [passError, setPassError] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState();
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    const [showUnlinkFromGoogleDialog, setShowUnlinkFromGoogleDialog] =
        useState(null);

    useEffect(() => {
        async function getData() {
            const data = await isConnectedToGoogle();
            setConnectedToGoogle(data.connectedToGoogle);
        }
        getData();
    }, []);

    const submitProfile = async (values, onSubmitProps) => {
        const updatedNameRespone = await updateName(
            values.first_name,
            values.last_name
        );
        if (updatedNameRespone.success) {
            setInitialValuesProfile((init) => {
                init.first_name = values.first_name;
                init.last_name = values.last_name;
                return init;
            });
            onSubmitProps.resetForm();
            setProfError(null);
            dispatch(showSnackbar({ snackbar: "profileSaved" }));
        } else if (updatedNameRespone.msg) {
            setProfError(updatedNameRespone.msg);
        } else if (updatedNameRespone.err) {
            setProfError(updatedNameRespone.err);
        }
    };
    const submitPass = async (values, onSubmitProps) => {
        const confirmedResponse = await confirmPassword(values.currentPassword);

        if (confirmedResponse.passConfirmed) {
            await updatePass(values.newPassword);
            onSubmitProps.resetForm();
            setShowPasswordRequirements(null);
            setPassError(null);
            dispatch(showSnackbar({ snackbar: "passwordChanged" }));
        } else if (confirmedResponse.msg) {
            setPassError(confirmedResponse.msg);
        } else if (confirmedResponse.err) {
            setPassError(confirmedResponse.err);
        }
    };

    const [initialValuesProfile, setInitialValuesProfile] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    });
    const initialValuesPassword = {
        currentPassword: "",
        newPassword: "",
        passwordConfirm: "",
    };

    return isNonMobileScreens ? (
        <Box marginBottom="30px">
            <Box width="700px" maxWidth="80vw" paddingBottom="80px">
                <Box display="flex" flexDirection="column">
                    {connectedToGoogle && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                padding: "10px 0",
                            }}
                        >
                            <Container
                                fullWidth
                                fullHeight
                                button={false}
                                style={{
                                    padding: "15px 20px",
                                    height: "100%",
                                    backgroundColor: colors.secondary[200],
                                    textAlign: "left",
                                }}
                            >
                                <Typography variant="body1">
                                    Your <b>Bookbunny</b> account is currently
                                    linked to your <b>Google Account</b>. If you
                                    unlink these accounts, then your{" "}
                                    <b>Bookbunny</b> account password will be
                                    reset and you will be able to change your
                                    email address.
                                </Typography>
                            </Container>
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "10px 0",
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
                            <Typography variant="h3" margin="5px 0 20px 0">
                                <b>Profile</b>
                            </Typography>
                            {connectedToGoogle ? (
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": {
                                            gridColumn: isNonMobile
                                                ? undefined
                                                : "span 4",
                                        },
                                    }}
                                >
                                    <TextField
                                        disabled
                                        label="First Name*"
                                        value={initialValuesProfile.first_name}
                                        name="first_name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        disabled
                                        label="Last Name"
                                        value={initialValuesProfile.last_name}
                                        name="last_name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        disabled
                                        label="Email*"
                                        value={initialValuesProfile.email}
                                        name="email"
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Container
                                        size="m"
                                        fullWidth
                                        variant="contained"
                                        onClick={() => {
                                            setShowUnlinkFromGoogleDialog(true);
                                        }}
                                        outerStyle={{
                                            gridColumn: "span 4",
                                        }}
                                        style={{
                                            backgroundColor:
                                                colors.neutralLight[100],
                                            // fontFamily: "Product Sans",
                                        }}
                                    >
                                        Unlink from <b color="#4285f4">G</b>
                                        <b color="#EA4335">o</b>
                                        <b color="#FBBC05">o</b>
                                        <b color="#4285f4">g</b>
                                        <b color="#34A853">l</b>
                                        <b color="#EA4335">e</b>
                                    </Container>
                                </Box>
                            ) : (
                                <Formik
                                    onSubmit={submitProfile}
                                    initialValues={initialValuesProfile}
                                    validationSchema={profileSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit,
                                        resetForm,
                                        isValidating,
                                        isSubmitting,
                                        isValid,
                                        initialErrors,
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            {profError && (
                                                <Typography
                                                    textAlign="left"
                                                    variant="h6"
                                                    margin="0 0 30px 0"
                                                    color={
                                                        colors.redAccent[500]
                                                    }
                                                >
                                                    {profError}
                                                </Typography>
                                            )}

                                            {/* FIELDS */}
                                            <Box
                                                display="grid"
                                                gap="30px"
                                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                                sx={{
                                                    "& > div": {
                                                        gridColumn: isNonMobile
                                                            ? undefined
                                                            : "span 4",
                                                    },
                                                }}
                                            >
                                                <TextField
                                                    label="First Name*"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.first_name}
                                                    name="first_name"
                                                    error={
                                                        Boolean(
                                                            touched.first_name
                                                        ) &&
                                                        Boolean(
                                                            errors.first_name
                                                        )
                                                    }
                                                    helperText={
                                                        touched.first_name &&
                                                        errors.first_name
                                                    }
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                />
                                                <TextField
                                                    label="Last Name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.last_name}
                                                    name="last_name"
                                                    error={
                                                        Boolean(
                                                            touched.last_name
                                                        ) &&
                                                        Boolean(
                                                            errors.last_name
                                                        )
                                                    }
                                                    helperText={
                                                        touched.last_name &&
                                                        errors.last_name
                                                    }
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                />
                                                <TextField
                                                    disabled
                                                    label="Email*"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.email}
                                                    name="email"
                                                    error={
                                                        Boolean(
                                                            touched.email
                                                        ) &&
                                                        Boolean(errors.email)
                                                    }
                                                    helperText={
                                                        touched.email &&
                                                        errors.email
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                <Typography
                                                    onClick={() => {}}
                                                    sx={{
                                                        gridColumn: "span 4",
                                                        color: colors
                                                            .primary[500],
                                                        textDecoration:
                                                            "underline",
                                                        textAlign: "left",
                                                        "&:hover": {
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                >
                                                    Change Email Address
                                                </Typography>
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.first_name
                                                        ) &&
                                                        !Boolean(
                                                            touched.last_name
                                                        ) &&
                                                        !Boolean(touched.email)
                                                    }
                                                    variant="outlined"
                                                    color="inherit"
                                                    style={{}}
                                                    onClick={() => {
                                                        setProfError(null);
                                                        resetForm();
                                                    }}
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.first_name
                                                        ) &&
                                                        !Boolean(
                                                            touched.last_name
                                                        ) &&
                                                        !Boolean(touched.email)
                                                    }
                                                    variant="contained"
                                                    color="inherit"
                                                    type="submit"
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </form>
                                    )}
                                </Formik>
                            )}
                        </Container>
                    </Box>
                    {!connectedToGoogle && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                padding: "10px 0",
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
                                <Typography variant="h3" margin="5px 0 25px 0">
                                    <b>Change Your Password</b>
                                </Typography>
                                <Formik
                                    onSubmit={submitPass}
                                    initialValues={initialValuesPassword}
                                    validationSchema={passwordSchema}
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
                                            {passError && (
                                                <Typography
                                                    textAlign="left"
                                                    variant="h6"
                                                    margin="0 0 10px 0"
                                                    color={
                                                        colors.redAccent[500]
                                                    }
                                                >
                                                    {passError}
                                                </Typography>
                                            )}

                                            {/* FIELDS */}
                                            <Box
                                                display="grid"
                                                gap="30px"
                                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                                sx={{
                                                    "& > div": {
                                                        gridColumn: isNonMobile
                                                            ? undefined
                                                            : "span 4",
                                                    },
                                                }}
                                            >
                                                <TextField
                                                    label="Current Password*"
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={
                                                        values.currentPassword
                                                    }
                                                    name="currentPassword"
                                                    error={
                                                        Boolean(
                                                            touched.currentPassword
                                                        ) &&
                                                        Boolean(
                                                            errors.currentPassword
                                                        )
                                                    }
                                                    helperText={
                                                        touched.currentPassword &&
                                                        errors.currentPassword
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                <Typography
                                                    onClick={() => {
                                                        navigate(
                                                            "/forgot_password"
                                                        );
                                                        resetForm();
                                                    }}
                                                    sx={{
                                                        gridColumn: "span 4",
                                                        color: colors
                                                            .primary[500],
                                                        textDecoration:
                                                            "underline",
                                                        textAlign: "left",
                                                        "&:hover": {
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                >
                                                    Forgot Password?
                                                </Typography>
                                                <TextField
                                                    label="New Password*"
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setShowPasswordRequirements(
                                                            e.target.value
                                                        );
                                                        handleChange(e);
                                                    }}
                                                    value={values.newPassword}
                                                    name="newPassword"
                                                    error={
                                                        Boolean(
                                                            touched.newPassword
                                                        ) &&
                                                        Boolean(
                                                            errors.newPassword
                                                        )
                                                    }
                                                    helperText={
                                                        touched.newPassword &&
                                                        errors.newPassword
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                {showPasswordRequirements && (
                                                    <Box
                                                        sx={{
                                                            gridColumn:
                                                                "span 4",
                                                            opacity:
                                                                showPasswordRequirements
                                                                    ? "100%"
                                                                    : "0%",
                                                            transition:
                                                                "opacity 0.2s ease",
                                                        }}
                                                    >
                                                        <Container
                                                            fullWidth
                                                            button={false}
                                                            style={{
                                                                padding: "15px",
                                                                backgroundColor:
                                                                    colors
                                                                        .secondary[200],
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <Typography variant="h6">
                                                                <b>
                                                                    Your
                                                                    password
                                                                    must:
                                                                </b>
                                                            </Typography>

                                                            <ul>
                                                                <li>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    >
                                                                        Contain
                                                                        at least{" "}
                                                                        <b>
                                                                            8
                                                                            characters
                                                                        </b>
                                                                    </Typography>
                                                                </li>
                                                                <li>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    >
                                                                        Contain
                                                                        at least{" "}
                                                                        <b>
                                                                            1
                                                                            number
                                                                        </b>
                                                                        ,{" "}
                                                                        <b>
                                                                            1
                                                                            lowercase
                                                                            letter
                                                                        </b>
                                                                        ,{" "}
                                                                        <b>
                                                                            1
                                                                            uppercase
                                                                            letter
                                                                        </b>
                                                                        , and{" "}
                                                                        <b>
                                                                            1
                                                                            unique
                                                                            character
                                                                        </b>
                                                                    </Typography>
                                                                </li>
                                                            </ul>
                                                        </Container>
                                                    </Box>
                                                )}

                                                <TextField
                                                    label="Confirm Password*"
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={
                                                        values.passwordConfirm
                                                    }
                                                    name="passwordConfirm"
                                                    error={
                                                        Boolean(
                                                            touched.passwordConfirm
                                                        ) &&
                                                        Boolean(
                                                            errors.passwordConfirm
                                                        )
                                                    }
                                                    helperText={
                                                        touched.passwordConfirm &&
                                                        errors.passwordConfirm
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.currentPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.newPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.passwordConfirm
                                                        )
                                                    }
                                                    variant="outlined"
                                                    color="inherit"
                                                    style={{}}
                                                    onClick={() => {
                                                        setShowPasswordRequirements(
                                                            null
                                                        );
                                                        setPassError(null);
                                                        resetForm();
                                                    }}
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.currentPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.newPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.passwordConfirm
                                                        )
                                                    }
                                                    variant="contained"
                                                    color="inherit"
                                                    type="submit"
                                                    style={{}}
                                                    sx={{
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
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "10px 0",
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
                            <Box
                                display="grid"
                                gap="15px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMobile
                                            ? undefined
                                            : "span 4",
                                    },
                                }}
                            >
                                <Typography variant="h3" gridColumn="span 4">
                                    <b>Delete Account</b>
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color={colors.redAccent[500]}
                                    gridColumn="span 4"
                                    margin="0 0 15px 0"
                                >
                                    <b>This action will be permenant!</b>
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    onClick={() => {
                                        setShowDeleteDialog(true);
                                    }}
                                    style={{
                                        gridColumn: "span 4",
                                        backgroundColor: colors.redAccent[500],
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
            {showUnlinkFromGoogleDialog && (
                <UnlinkFromGoogleDialog
                    setConnectedToGoogle={setConnectedToGoogle}
                    setShowDialog={setShowUnlinkFromGoogleDialog}
                />
            )}
            {showDeleteDialog && (
                <DeleteAccountDialog setShowDialog={setShowDeleteDialog} />
            )}
        </Box>
    ) : (
        <Box marginBottom="30px">
            <Box width="700px" maxWidth="90vw" paddingBottom="80px">
                <Box display="flex" flexDirection="column">
                    {connectedToGoogle && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                padding: "10px 0",
                            }}
                        >
                            <Container
                                fullWidth
                                fullHeight
                                button={false}
                                style={{
                                    padding: "15px 20px",
                                    height: "100%",
                                    backgroundColor: colors.secondary[200],
                                    textAlign: "left",
                                }}
                            >
                                <Typography variant="body1">
                                    Your <b>Bookbunny</b> account is currently
                                    linked to your <b>Google Account</b>. If you
                                    unlink these accounts, then your{" "}
                                    <b>Bookbunny</b> account password will be
                                    reset and you will be able to change your
                                    email address.
                                </Typography>
                            </Container>
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "10px 0",
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
                            <Typography variant="h3" margin="5px 0 20px 0">
                                <b>Profile</b>
                            </Typography>
                            {connectedToGoogle ? (
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": {
                                            gridColumn: isNonMobile
                                                ? undefined
                                                : "span 4",
                                        },
                                    }}
                                >
                                    <TextField
                                        disabled
                                        label="First Name*"
                                        value={initialValuesProfile.first_name}
                                        name="first_name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        disabled
                                        label="Last Name"
                                        value={initialValuesProfile.last_name}
                                        name="last_name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        disabled
                                        label="Email*"
                                        value={initialValuesProfile.email}
                                        name="email"
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Container
                                        size="m"
                                        fullWidth
                                        variant="contained"
                                        onClick={() => {
                                            setShowUnlinkFromGoogleDialog(true);
                                        }}
                                        outerStyle={{
                                            gridColumn: "span 4",
                                        }}
                                        style={{
                                            backgroundColor:
                                                colors.neutralLight[100],
                                            // fontFamily: "Product Sans",
                                        }}
                                    >
                                        Unlink from <b color="#4285f4">G</b>
                                        <b color="#EA4335">o</b>
                                        <b color="#FBBC05">o</b>
                                        <b color="#4285f4">g</b>
                                        <b color="#34A853">l</b>
                                        <b color="#EA4335">e</b>
                                    </Container>
                                </Box>
                            ) : (
                                <Formik
                                    onSubmit={submitProfile}
                                    initialValues={initialValuesProfile}
                                    validationSchema={profileSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit,
                                        resetForm,
                                        isValidating,
                                        isSubmitting,
                                        isValid,
                                        initialErrors,
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            {profError && (
                                                <Typography
                                                    textAlign="left"
                                                    variant="h6"
                                                    margin="0 0 30px 0"
                                                    color={
                                                        colors.redAccent[500]
                                                    }
                                                >
                                                    {profError}
                                                </Typography>
                                            )}

                                            {/* FIELDS */}
                                            <Box
                                                display="grid"
                                                gap="30px"
                                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                                sx={{
                                                    "& > div": {
                                                        gridColumn: isNonMobile
                                                            ? undefined
                                                            : "span 4",
                                                    },
                                                }}
                                            >
                                                <TextField
                                                    label="First Name*"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.first_name}
                                                    name="first_name"
                                                    error={
                                                        Boolean(
                                                            touched.first_name
                                                        ) &&
                                                        Boolean(
                                                            errors.first_name
                                                        )
                                                    }
                                                    helperText={
                                                        touched.first_name &&
                                                        errors.first_name
                                                    }
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                />
                                                <TextField
                                                    label="Last Name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.last_name}
                                                    name="last_name"
                                                    error={
                                                        Boolean(
                                                            touched.last_name
                                                        ) &&
                                                        Boolean(
                                                            errors.last_name
                                                        )
                                                    }
                                                    helperText={
                                                        touched.last_name &&
                                                        errors.last_name
                                                    }
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                />
                                                <TextField
                                                    disabled
                                                    label="Email*"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.email}
                                                    name="email"
                                                    error={
                                                        Boolean(
                                                            touched.email
                                                        ) &&
                                                        Boolean(errors.email)
                                                    }
                                                    helperText={
                                                        touched.email &&
                                                        errors.email
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                <Typography
                                                    onClick={() => {}}
                                                    sx={{
                                                        gridColumn: "span 4",
                                                        color: colors
                                                            .primary[500],
                                                        textDecoration:
                                                            "underline",
                                                        textAlign: "left",
                                                        "&:hover": {
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                >
                                                    Change Email Address
                                                </Typography>
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.first_name
                                                        ) &&
                                                        !Boolean(
                                                            touched.last_name
                                                        ) &&
                                                        !Boolean(touched.email)
                                                    }
                                                    variant="outlined"
                                                    color="inherit"
                                                    style={{}}
                                                    onClick={() => {
                                                        setProfError(null);
                                                        resetForm();
                                                    }}
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.first_name
                                                        ) &&
                                                        !Boolean(
                                                            touched.last_name
                                                        ) &&
                                                        !Boolean(touched.email)
                                                    }
                                                    variant="contained"
                                                    color="inherit"
                                                    type="submit"
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </form>
                                    )}
                                </Formik>
                            )}
                        </Container>
                    </Box>
                    {!connectedToGoogle && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                padding: "10px 0",
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
                                <Typography variant="h3" margin="5px 0 25px 0">
                                    <b>Change Your Password</b>
                                </Typography>
                                <Formik
                                    onSubmit={submitPass}
                                    initialValues={initialValuesPassword}
                                    validationSchema={passwordSchema}
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
                                            {passError && (
                                                <Typography
                                                    textAlign="left"
                                                    variant="h6"
                                                    margin="0 0 10px 0"
                                                    color={
                                                        colors.redAccent[500]
                                                    }
                                                >
                                                    {passError}
                                                </Typography>
                                            )}

                                            {/* FIELDS */}
                                            <Box
                                                display="grid"
                                                gap="30px"
                                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                                sx={{
                                                    "& > div": {
                                                        gridColumn: isNonMobile
                                                            ? undefined
                                                            : "span 4",
                                                    },
                                                }}
                                            >
                                                <TextField
                                                    label="Current Password*"
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={
                                                        values.currentPassword
                                                    }
                                                    name="currentPassword"
                                                    error={
                                                        Boolean(
                                                            touched.currentPassword
                                                        ) &&
                                                        Boolean(
                                                            errors.currentPassword
                                                        )
                                                    }
                                                    helperText={
                                                        touched.currentPassword &&
                                                        errors.currentPassword
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                <Typography
                                                    onClick={() => {
                                                        navigate(
                                                            "/forgot_password"
                                                        );
                                                        resetForm();
                                                    }}
                                                    sx={{
                                                        gridColumn: "span 4",
                                                        color: colors
                                                            .primary[500],
                                                        textDecoration:
                                                            "underline",
                                                        textAlign: "left",
                                                        "&:hover": {
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                >
                                                    Forgot Password?
                                                </Typography>
                                                <TextField
                                                    label="New Password*"
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setShowPasswordRequirements(
                                                            e.target.value
                                                        );
                                                        handleChange(e);
                                                    }}
                                                    value={values.newPassword}
                                                    name="newPassword"
                                                    error={
                                                        Boolean(
                                                            touched.newPassword
                                                        ) &&
                                                        Boolean(
                                                            errors.newPassword
                                                        )
                                                    }
                                                    helperText={
                                                        touched.newPassword &&
                                                        errors.newPassword
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                {showPasswordRequirements && (
                                                    <Box
                                                        sx={{
                                                            gridColumn:
                                                                "span 4",
                                                            opacity:
                                                                showPasswordRequirements
                                                                    ? "100%"
                                                                    : "0%",
                                                            transition:
                                                                "opacity 0.2s ease",
                                                        }}
                                                    >
                                                        <Container
                                                            fullWidth
                                                            button={false}
                                                            style={{
                                                                padding: "15px",
                                                                backgroundColor:
                                                                    colors
                                                                        .secondary[200],
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <Typography variant="h6">
                                                                <b>
                                                                    Your
                                                                    password
                                                                    must:
                                                                </b>
                                                            </Typography>

                                                            <ul>
                                                                <li>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    >
                                                                        Contain
                                                                        at least{" "}
                                                                        <b>
                                                                            8
                                                                            characters
                                                                        </b>
                                                                    </Typography>
                                                                </li>
                                                                <li>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    >
                                                                        Contain
                                                                        at least{" "}
                                                                        <b>
                                                                            1
                                                                            number
                                                                        </b>
                                                                        ,{" "}
                                                                        <b>
                                                                            1
                                                                            lowercase
                                                                            letter
                                                                        </b>
                                                                        ,{" "}
                                                                        <b>
                                                                            1
                                                                            uppercase
                                                                            letter
                                                                        </b>
                                                                        , and{" "}
                                                                        <b>
                                                                            1
                                                                            unique
                                                                            character
                                                                        </b>
                                                                    </Typography>
                                                                </li>
                                                            </ul>
                                                        </Container>
                                                    </Box>
                                                )}

                                                <TextField
                                                    label="Confirm Password*"
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={
                                                        values.passwordConfirm
                                                    }
                                                    name="passwordConfirm"
                                                    error={
                                                        Boolean(
                                                            touched.passwordConfirm
                                                        ) &&
                                                        Boolean(
                                                            errors.passwordConfirm
                                                        )
                                                    }
                                                    helperText={
                                                        touched.passwordConfirm &&
                                                        errors.passwordConfirm
                                                    }
                                                    sx={{
                                                        gridColumn: "span 4",
                                                    }}
                                                />
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.currentPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.newPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.passwordConfirm
                                                        )
                                                    }
                                                    variant="outlined"
                                                    color="inherit"
                                                    style={{}}
                                                    onClick={() => {
                                                        setShowPasswordRequirements(
                                                            null
                                                        );
                                                        setPassError(null);
                                                        resetForm();
                                                    }}
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    disabled={
                                                        !Boolean(
                                                            touched.currentPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.newPassword
                                                        ) &&
                                                        !Boolean(
                                                            touched.passwordConfirm
                                                        )
                                                    }
                                                    variant="contained"
                                                    color="inherit"
                                                    type="submit"
                                                    style={{}}
                                                    sx={{
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
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "10px 0",
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
                            <Box
                                display="grid"
                                gap="15px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMobile
                                            ? undefined
                                            : "span 4",
                                    },
                                }}
                            >
                                <Typography variant="h3" gridColumn="span 4">
                                    <b>Delete Account</b>
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color={colors.redAccent[500]}
                                    gridColumn="span 4"
                                    margin="0 0 15px 0"
                                >
                                    <b>This action will be permenant!</b>
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    onClick={() => {
                                        setShowDeleteDialog(true);
                                    }}
                                    style={{
                                        gridColumn: "span 4",
                                        backgroundColor: colors.redAccent[500],
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
            {showUnlinkFromGoogleDialog && (
                <UnlinkFromGoogleDialog
                    setConnectedToGoogle={setConnectedToGoogle}
                    setShowDialog={setShowUnlinkFromGoogleDialog}
                />
            )}
            {showDeleteDialog && (
                <DeleteAccountDialog setShowDialog={setShowDeleteDialog} />
            )}
        </Box>
    );
};

export default Account;
