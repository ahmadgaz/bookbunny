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

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const contactSchema = yup.object().shape({
    first_name: yup.string().required("Enter your first name!"),
    last_name: yup.string().notRequired(),
    email: yup.string().email("Invalid email").required("Enter an email!"),
    message: yup.string().notRequired(),
});

const initialValuesContact = {
    first_name: "",
    last_name: "",
    email: "",
    message: "",
};

const Form = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [error, setError] = useState(null);

    const submitForm = async (values, onSubmitProps) => {
        const contactMessageSentResponse = await fetch(`${URL}/contact`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const contactMessageSent = await contactMessageSentResponse.json();

        if (!contactMessageSent) {
            setError("There has been an error in the server.");
            return;
        } else if (contactMessageSent.msg) {
            setError(contactMessageSent.msg);
            return;
        }
    };

    return (
        <Formik
            onSubmit={submitForm}
            initialValues={initialValuesContact}
            validationSchema={contactSchema}
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
                            label="Message"
                            multiline
                            onBlur={handleBlur}
                            rows={4}
                            onChange={handleChange}
                            value={values.message}
                            name="message"
                            error={
                                Boolean(touched.message) &&
                                Boolean(errors.message)
                            }
                            helperText={touched.message && errors.message}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    {error && (
                        <Typography
                            textAlign="left"
                            variant="h6"
                            margin="10px 0 0 0"
                            color={colors.redAccent[500]}
                        >
                            {error}
                        </Typography>
                    )}

                    {/* BUTTONS */}
                    <Box>
                        <Box sx={{ m: "2rem 0 0 0", p: "2px" }}>
                            <Container
                                size="m"
                                fullWidth
                                variant="contained"
                                type="submit"
                            >
                                Send
                            </Container>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
