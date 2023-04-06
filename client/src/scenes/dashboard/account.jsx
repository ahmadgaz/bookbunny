import {
    Box,
    Button,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { CRUDFunctionsContext } from "App";
import Container from "components/Container";
import * as yup from "yup";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { tokens } from "theme";

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

const Account = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const {
        user,
        isConnectedToGoogle,
        unlinkFromGoogle,
        updateName,
        updatePass,
        confirmPassword,
    } = useContext(CRUDFunctionsContext);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [connectedToGoogle, setConnectedToGoogle] = useState();
    const [profError, setProfError] = useState(null);
    const [passError, setPassError] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState();

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
            setProfError(updatedNameRespone.success);
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
            setPassError(confirmedResponse.passConfirmed);
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

    return (
        <Box marginBottom="30px">
            <Box width="700px" maxWidth="80vw">
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
                                        name="first_name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        disabled
                                        label="Last Name"
                                        name="last_name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        disabled
                                        label="Email*"
                                        name="email"
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Container
                                        size="m"
                                        fullWidth
                                        variant="contained"
                                        onClick={() => {}}
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
                                                    onClick={() => {}}
                                                    sx={{
                                                        gridColumn: "span 4",
                                                        color: colors
                                                            .primary[500],
                                                        textDecoration:
                                                            "underline",
                                                        textAlign: "right",
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
                                    onClick={() => {}}
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
        </Box>
    );
};

export default Account;
