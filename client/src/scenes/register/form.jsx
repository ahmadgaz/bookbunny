import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "state";
import Container from "components/Container";
import { tokens } from "theme";
import { useGoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const authURL = `${process.env.REACT_APP_SERVER_BASE_URL}/auth`;

const registerSchema = yup.object().shape({
    first_name: yup.string().required("Enter your first name!"),
    last_name: yup.string().notRequired(),
    email: yup.string().email("Invalid email").required("Enter an email!"),
    password: yup
        .string()
        .required("Enter a password!")
        .min(8, "Password must be 8 characters long!")
        .matches(/[0-9]/, "Password requires a number!")
        .matches(/[a-z]/, "Password requires a lowercase letter!")
        .matches(/[A-Z]/, "Password requires an uppercase letter!")
        .matches(/[^\w]/, "Password requires a symbol!"),
    passwordConfirm: yup
        .string()
        .oneOf(
            [yup.ref("password"), null],
            'Must match "Password" field value'
        ),
});

const initialValuesRegister = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
};

const Form = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const previousPage = useSelector((state) => state.routeBeforeLogInOrSignUp);
    const [error, setError] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState();

    const googleRegister = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const savedUserResponse = await fetch(`${authURL}/register`, {
                method: "POST",
                body: JSON.stringify({
                    googleCode: codeResponse.code,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const savedUser = await savedUserResponse.json();

            if (savedUser.token !== undefined && savedUser.user !== undefined) {
                console.log(savedUser);
                dispatch(
                    setLogin({
                        user: savedUser.user,
                        token: savedUser.token,
                    })
                );
                navigate(previousPage);
            } else if (savedUser.msg) {
                setError(savedUser.msg);
            } else {
                setError("There has been an error on our end.");
            }
        },
        onError: (err) => setError(err),
        scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
        ].join(" "),
        flow: "auth-code",
    });

    const register = async (values, onSubmitProps) => {
        const savedUserResponse = await fetch(`${authURL}/register`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const savedUser = await savedUserResponse.json();

        if (!savedUser) {
            setError("There has been an error in the server.");
            return;
        } else if (savedUser.msg) {
            setError(savedUser.msg);
            return;
        }

        login(values, onSubmitProps);
    };

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(`${authURL}/login`, {
            method: "POST",
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const loggedIn = await loggedInResponse.json();

        if (loggedIn.token !== undefined && loggedIn.user !== undefined) {
            onSubmitProps.resetForm();
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate(previousPage);
        } else if (loggedIn.msg) {
            setError(loggedIn.msg);
        } else {
            setError("There has been an error on our end.");
        }
    };

    return (
        <Formik
            onSubmit={register}
            initialValues={initialValuesRegister}
            validationSchema={registerSchema}
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
                    {error && (
                        <Typography
                            textAlign="left"
                            variant="h6"
                            margin="0 0 10px 0"
                            color={colors.redAccent[500]}
                        >
                            {error}
                        </Typography>
                    )}

                    {/* FIELDS */}
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": {
                                gridColumn: isNonMobile ? undefined : "span 4",
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
                                Boolean(touched.first_name) &&
                                Boolean(errors.first_name)
                            }
                            helperText={touched.first_name && errors.first_name}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.last_name}
                            name="last_name"
                            error={
                                Boolean(touched.last_name) &&
                                Boolean(errors.last_name)
                            }
                            helperText={touched.last_name && errors.last_name}
                            sx={{ gridColumn: "span 2" }}
                        />
                        {/* ADD TIMEZONE HERE */}
                        <TextField
                            label="Email*"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={
                                Boolean(touched.email) && Boolean(errors.email)
                            }
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password*"
                            type="password"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                setShowPasswordRequirements(e.target.value);
                                handleChange(e);
                            }}
                            value={values.password}
                            name="password"
                            error={
                                Boolean(touched.password) &&
                                Boolean(errors.password)
                            }
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 2" }}
                        />

                        <TextField
                            label="Confirm Password*"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.passwordConfirm}
                            name="passwordConfirm"
                            error={
                                Boolean(touched.passwordConfirm) &&
                                Boolean(errors.passwordConfirm)
                            }
                            helperText={
                                touched.passwordConfirm &&
                                errors.passwordConfirm
                            }
                            sx={{ gridColumn: "span 2" }}
                        />
                        {showPasswordRequirements && (
                            <Box
                                sx={{
                                    gridColumn: "span 4",
                                    opacity: showPasswordRequirements
                                        ? "100%"
                                        : "0%",
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                <Container
                                    fullWidth
                                    button={false}
                                    style={{
                                        padding: "15px",
                                        backgroundColor: colors.secondary[200],
                                        textAlign: "left",
                                    }}
                                >
                                    <Typography variant="h6">
                                        Your password must:
                                    </Typography>

                                    <ul>
                                        <li>
                                            <Typography
                                                variant="body1"
                                                fontSize={14}
                                            >
                                                Contain at least{" "}
                                                <b>8 characters</b>
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography
                                                variant="body1"
                                                fontSize={14}
                                            >
                                                Contain at least <b>1 number</b>
                                                , <b>1 lowercase letter</b>,{" "}
                                                <b>1 uppercase letter</b>, and{" "}
                                                <b>1 unique character</b>
                                            </Typography>
                                        </li>
                                    </ul>
                                </Container>
                            </Box>
                        )}
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Box sx={{ m: "2rem 0", p: "2px" }}>
                            <Container
                                size="m"
                                fullWidth
                                variant="contained"
                                type="submit"
                            >
                                Sign up
                            </Container>
                            <Typography variant="h5" margin="10px">
                                <b>OR</b>
                            </Typography>
                            {/* <GoogleLogin
                                size="large"
                                onSuccess={googleLogin}
                                onError={(err) => console.log(err)}
                            /> */}
                            <Container
                                size="m"
                                fullWidth
                                variant="contained"
                                onClick={googleRegister}
                                style={{
                                    backgroundColor: colors.neutralLight[100],
                                    // fontFamily: "Product Sans",
                                }}
                            >
                                Sign up with <b color="#4285f4">G</b>
                                <b color="#EA4335">o</b>
                                <b color="#FBBC05">o</b>
                                <b color="#4285f4">g</b>
                                <b color="#34A853">l</b>
                                <b color="#EA4335">e</b>
                            </Container>
                        </Box>

                        {/* QUESTION */}
                        <Typography>Already have an account?</Typography>
                        <Typography
                            onClick={() => {
                                navigate("/login");
                                resetForm();
                            }}
                            sx={{
                                color: colors.primary[500],
                                textDecoration: "underline",
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                        >
                            Log in here!
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
