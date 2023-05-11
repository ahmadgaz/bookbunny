import { useState } from "react";
import { Box, TextField, useMediaQuery, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { tokens } from "theme";
import Container from "components/Container";

const authURL = `${process.env.REACT_APP_SERVER_BASE_URL}/auth`;

const schema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Enter your email!"),
});

const initialValues = {
    email: "",
};

const Form = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [error, setError] = useState(null);

    const forgotPassword = async (values, onSubmitProps) => {
        const forgotPasswordResponse = await fetch(
            `${authURL}/forgotPassword`,
            {
                method: "POST",
                body: JSON.stringify({
                    email: values.email,
                }),
                headers: { "Content-Type": "application/json" },
            }
        );

        const forgotPassword = await forgotPasswordResponse.json();

        if (forgotPassword.msg) {
            setError(forgotPassword.msg);
        } else {
            setError("There has been an error in the server.");
        }
    };

    return (
        <Formik
            onSubmit={forgotPassword}
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
                                Send Email
                            </Container>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
