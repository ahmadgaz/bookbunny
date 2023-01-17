import { useState } from "react";
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

const authURL = `${process.env.REACT_APP_BASE_URL}/auth`;

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
        } else {
            setError(loggedIn.msg);
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
                    {error && <Typography>{error}</Typography>}

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
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                            }}
                        >
                            LOG IN
                        </Button>

                        {/* QUESTION */}
                        <Typography>Don't have an account?</Typography>
                        <Typography
                            onClick={() => {
                                navigate("/register");
                                resetForm();
                            }}
                            sx={{
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
