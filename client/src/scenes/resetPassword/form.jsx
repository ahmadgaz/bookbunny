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

const schema = yup.object().shape({
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
        .required("Confirm your password!")
        .oneOf(
            [yup.ref("password"), null],
            'Must match "Password" field value'
        ),
});

const initialValues = {
    password: "",
    passwordConfirm: "",
};

const Form = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { token, userId } = props;
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [error, setError] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState();

    const resetPassword = async (values, onSubmitProps) => {
        const resetPasswordResponse = await fetch(`${authURL}/resetPassword`, {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                token: token,
                password: values.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resetPassword = await resetPasswordResponse.json();

        if (resetPassword.msg) {
            setError(resetPassword.msg);
            return;
        } else {
            setError("There has been an error in the server.");
            return;
        }
    };

    return (
        <Formik
            onSubmit={resetPassword}
            initialValues={initialValues}
            validationSchema={schema}
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
                            label="New Password*"
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
                            sx={{ gridColumn: "span 4" }}
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
                                        <b>Your password must:</b>
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
                            sx={{ gridColumn: "span 4" }}
                        />
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
                                Reset Password
                            </Container>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
