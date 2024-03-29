import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { LocationOn, Notes } from "@mui/icons-material";
import Container from "components/Container";
import { tokens } from "theme";
import { useContext } from "react";
import { CRUDFunctionsContext } from "App";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "state";

const Event = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { timeslot } = props;
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { deleteEvent, acceptEvent, getAttendeesInfo } =
        useContext(CRUDFunctionsContext);
    const [attendees, setAttendees] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchAttendeesInfo() {
            const users = await getAttendeesInfo(timeslot.event.event_id);
            setAttendees(users);
        }
        fetchAttendeesInfo();
    }, []);
    return (
        <Box
            sx={
                isNonMobileScreens
                    ? {}
                    : {
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "nowrap",
                          width: "100%",
                          height: "100%",
                      }
            }
        >
            {" "}
            <Box
                paddingLeft="10px"
                paddingTop="10px"
                display="flex"
                flexWrap="nowrap"
                alignItems="center"
            >
                <Box
                    sx={{
                        width: "125px",
                        height: "125px",
                        padding: "15px",
                    }}
                >
                    <Container
                        fullWidth
                        fullHeight
                        button={false}
                        style={{
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0 23px",
                            maxWidth: "90vw",
                            borderRadius: `${colors.borderRadius}px`,
                            backgroundColor: colors.primary[100],
                        }}
                    >
                        <Typography
                            color={colors.primary[700]}
                            textAlign="center"
                            variant="h3"
                        >
                            <b>
                                {dayjs(timeslot.event.event_date).format("MMM")}
                            </b>
                        </Typography>
                        <Typography
                            color={colors.primary[700]}
                            textAlign="center"
                            variant="body1"
                            lineHeight={1}
                            fontSize={20}
                        >
                            {dayjs(timeslot.event.event_date).format("D")}
                        </Typography>
                    </Container>
                </Box>
                <Box width="max(500px, min-content)">
                    <Box m="10px">
                        <Typography
                            lineHeight={1}
                            variant="body1"
                            fontSize={18}
                        >
                            <b>{timeslot.event.event_name}</b>
                        </Typography>
                        <Typography
                            lineHeight={1}
                            variant="body2"
                            fontSize={14}
                        >
                            {dayjs(timeslot.event.event_date).format("h:mm A")}{" "}
                            -{" "}
                            {dayjs(timeslot.event.event_date)
                                .add(timeslot.event.event_duration, "minutes")
                                .format("h:mm A")}
                        </Typography>
                    </Box>
                    <Box
                        m="10px"
                        display="flex"
                        flexWrap="nowrap"
                        color={colors.neutralDark[300]}
                        alignItems="center"
                    >
                        {timeslot.event.event_location && <LocationOn />}
                        <Typography
                            lineHeight={1}
                            paddingLeft="15px"
                            variant="body1"
                            color={colors.neutralDark[300]}
                            fontSize={14}
                        >
                            {timeslot.event.event_location}
                        </Typography>
                    </Box>
                    <Box
                        m="10px"
                        display="flex"
                        flexWrap="nowrap"
                        color={colors.neutralDark[300]}
                        alignItems="center"
                    >
                        {timeslot.event.event_notes && <Notes />}
                        <Typography
                            paddingLeft="15px"
                            lineHeight={1}
                            variant="body1"
                            color={colors.neutralDark[300]}
                            fontSize={14}
                        >
                            {timeslot.event.event_notes}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                flexGrow={isNonMobileScreens ? "" : "1"}
                display="flex"
                flexDirection="column"
                flexWrap="nowrap"
                alignItems="center"
            >
                <Box
                    sx={{
                        width: "100%",
                        height: isNonMobileScreens ? "125px" : "100%",
                        padding: "0 25px 10px 25px",
                    }}
                >
                    <Container
                        fullWidth
                        fullHeight
                        button={false}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px 15px",
                            maxWidth: "90vw",
                            borderRadius: `${colors.borderRadius}px`,
                            backgroundColor: colors.primary[100],
                        }}
                    >
                        <Box
                            display="flex"
                            flexWrap="nowrap"
                            justifyContent="space-between"
                            sx={{
                                borderBottom: `1px solid ${colors.primary[700]}}`,
                            }}
                        >
                            <Typography
                                color={colors.primary[700]}
                                textAlign="left"
                                variant="body1"
                                lineHeight={1.5}
                                fontSize={16}
                            >
                                Attendees
                            </Typography>
                            <Typography
                                color={colors.primary[700]}
                                variant="body1"
                                textAlign="right"
                                lineHeight={1.5}
                                fontSize={16}
                            >
                                Status
                            </Typography>
                        </Box>
                        {attendees ? (
                            attendees.map((attendee, idx) => {
                                return (
                                    <Box
                                        key={idx}
                                        display="flex"
                                        flexWrap="nowrap"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box m="10px 0 0 0">
                                            <Typography
                                                lineHeight={1}
                                                color={colors.primary[700]}
                                                variant="body1"
                                                textAlign="left"
                                                fontSize={18}
                                            >
                                                <b>
                                                    {attendee.first_name}{" "}
                                                    {attendee.last_name}
                                                </b>
                                            </Typography>
                                            <Typography
                                                color={colors.primary[700]}
                                                lineHeight={1}
                                                variant="body2"
                                                textAlign="left"
                                                fontSize={14}
                                            >
                                                {attendee.email}
                                            </Typography>
                                        </Box>
                                        {attendee.events[
                                            attendee.events.findIndex(
                                                (event) =>
                                                    event.event_id.toString() ===
                                                    timeslot.event.event_id.toString()
                                            )
                                        ].event_attending ? (
                                            <Box
                                                title="Attending"
                                                sx={{
                                                    margin: "10px",
                                                    width: "15px",
                                                    height: "15px",
                                                    border: `${colors.borderSize}px solid #00A300`,
                                                    borderRadius: "5px",
                                                    background:
                                                        "repeating-linear-gradient(45deg, #00A300AA, #00A300AA 1px,  #00A3007F 2.5px,  #00A3007F 10px)",
                                                }}
                                            ></Box>
                                        ) : attendee.events[
                                              attendee.events.findIndex(
                                                  (event) =>
                                                      event.event_id.toString() ===
                                                      timeslot.event.event_id.toString()
                                              )
                                          ].event_status === "pending" ? (
                                            <Box
                                                title="Pending"
                                                sx={{
                                                    margin: "10px",
                                                    width: "15px",
                                                    height: "15px",
                                                    border: `${colors.borderSize}px solid #FEA82F`,
                                                    borderRadius: "5px",
                                                    background:
                                                        "repeating-linear-gradient(45deg, #FEA82FAA, #FEA82FAA 1px,  #FEA82F7F 2.5px,  #FEA82F7F 10px)",
                                                }}
                                            ></Box>
                                        ) : (
                                            <Box
                                                title="Not Attending"
                                                sx={{
                                                    margin: "10px",
                                                    width: "15px",
                                                    height: "15px",
                                                    border: `${colors.borderSize}px solid #FF2E00`,
                                                    borderRadius: "5px",
                                                    background:
                                                        "repeating-linear-gradient(45deg, #FF2E00AA, #FF2E00AA 1px,  #FF2E007F 2.5px,  #FF2E007F 10px)",
                                                }}
                                            ></Box>
                                        )}
                                    </Box>
                                );
                            })
                        ) : (
                            <Box
                                display="flex"
                                flexWrap="nowrap"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box m="10px 0 0 0">
                                    <Typography
                                        lineHeight={1}
                                        color={colors.primary[700]}
                                        variant="body1"
                                        textAlign="left"
                                        fontSize={18}
                                    >
                                        <b>Loading...</b>
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Container>
                </Box>
            </Box>
            {((timeslot.event.event_status === "pending" &&
                timeslot.event.event_attending) ||
                (timeslot.event.event_status === "confirmed" &&
                    timeslot.event.event_attending)) && (
                <Box
                    p="0 25px 10px 25px"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Button
                        onClick={() => {
                            deleteEvent(timeslot.event);
                            dispatch(
                                showSnackbar({ snackbar: "eventCanceled" })
                            );
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
            {timeslot.event.event_status === "pending" &&
                !timeslot.event.event_attending && (
                    <Box
                        p="0 25px 10px 25px"
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="contained"
                            onClick={() => {
                                acceptEvent(timeslot.event);
                                dispatch(
                                    showSnackbar({ snackbar: "eventAccepted" })
                                );
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            onClick={() => {
                                deleteEvent(timeslot.event);
                                dispatch(
                                    showSnackbar({ snackbar: "eventDenied" })
                                );
                            }}
                        >
                            Deny
                        </Button>
                    </Box>
                )}
        </Box>
    );
};
export default Event;
