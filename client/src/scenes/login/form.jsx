import { useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "state";
import { tokens } from "theme";
import Container from "components/Container";
import jwtDecode from "jwt-decode";

const authURL = `${process.env.REACT_APP_SERVER_BASE_URL}/auth`;

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Enter your email!"),
    password: yup.string().required("Enter your password!"),
});

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const previousPage = useSelector((state) => state.routeBeforeLogInOrSignUp);
    const [error, setError] = useState(null);
    const colors = tokens("light");

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const loggedInResponse = await fetch(`${authURL}/login`, {
                method: "POST",
                body: JSON.stringify({
                    googleCode: codeResponse.code,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const loggedIn = await loggedInResponse.json();

            console.log(loggedIn);

            if (loggedIn.token !== undefined && loggedIn.user !== undefined) {
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

        if (loggedIn.token && loggedIn.user) {
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
            setError("There has been an error in the server.");
        }
    };

    return (
        <Formik
            onSubmit={login}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
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
                            label="Email"
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
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={
                                Boolean(touched.password) &&
                                Boolean(errors.password)
                            }
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Box
                            sx={{
                                m: "2rem 0",
                                p: "2px",
                            }}
                        >
                            <Container
                                size="m"
                                fullWidth
                                variant="contained"
                                type="submit"
                            >
                                Log in
                            </Container>
                            <Typography variant="h5" margin="10px">
                                OR
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
                                onClick={() => googleLogin()}
                                style={{
                                    backgroundColor: "#fff",
                                    // fontFamily: "Product Sans",
                                }}
                            >
                                Log in with <b color="#4285f4">G</b>
                                <b color="#EA4335">o</b>
                                <b color="#FBBC05">o</b>
                                <b color="#4285f4">g</b>
                                <b color="#34A853">l</b>
                                <b color="#EA4335">e</b>
                            </Container>
                        </Box>
                        {/* QUESTION */}
                        <Typography>Don't have an account?</Typography>
                        <Typography
                            onClick={() => {
                                navigate("/register");
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
                            Sign up here!
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
