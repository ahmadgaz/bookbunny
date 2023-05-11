import { Box, Typography } from "@mui/material";
import Container from "components/Container";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { tokens } from "theme";
import Logo from "../../assets/Logo-02.svg";

const authURL = `${process.env.REACT_APP_SERVER_BASE_URL}/auth`;

const ConfirmedEmail = () => {
    const mode = useSelector((state) => state.mode);
    const [message, setMessage] = useState("");
    const colors = tokens(mode);

    const navigate = useNavigate();
    let { token } = useParams();

    useEffect(() => {
        async function confirmEmail() {
            const savedUserResponse = await fetch(
                `${authURL}/createConfirmedUser`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        token,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const savedUser = await savedUserResponse.json();

            if (!savedUser) {
                setMessage("There has been an error in the server.");
                return;
            } else if (savedUser.msg) {
                setMessage(savedUser.msg);
                return;
            }
        }
        confirmEmail();
    }, []);

    return (
        <Box
            sx={{
                margin: "30px 0 0 0",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <img
                src={Logo}
                alt="Logo"
                style={{
                    cursor: "pointer",
                    height: "50px",
                    margin: "30px 0",
                }}
                onClick={() => {
                    navigate("/");
                }}
            />
            <Typography
                variant="hero"
                fontSize={56}
                textAlign="center"
                sx={{ margin: "40px" }}
            >
                <em>{message}</em>
            </Typography>
            <Container
                button
                size="m"
                variant="contained"
                onClick={() => {
                    navigate("/login");
                }}
            >
                Login
            </Container>
        </Box>
    );
};

export default ConfirmedEmail;
