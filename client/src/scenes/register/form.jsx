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

const authURL = `${process.env.REACT_APP_SERVER_BASE_URL}/auth`;

const registerSchema = yup.object().shape({
    first_name: yup.string().required("Enter your first name!"),
    last_name: yup.string().notRequired(),
    email: yup.string().email("Invalid email").required("Enter an email!"),
    password: yup.string().required("Enter a password!"),
});

const initialValuesRegister = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
};

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const previousPage = useSelector((state) => state.routeBeforeLogInOrSignUp);
    const [error, setError] = useState(null);

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
            return;
        } else if (savedUser.msg) {
            setError(savedUser.msg);
            return;
        } else {
            setError("There has been an error in the server.");
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
            console.log(previousPage);
            navigate(previousPage);
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
                            label="First Name"
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
                            REGISTER
                        </Button>

                        {/* QUESTION */}
                        <Typography>Already have an account?</Typography>
                        <Typography
                            onClick={() => {
                                navigate("/login");
                                resetForm();
                            }}
                            sx={{
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
