import { Box, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { CRUDFunctionsContext } from "App";
import Schedule from "components/Schedule/Schedule";
import dayjs from "dayjs";

const Calendar = () => {
    const { user, getSelectedView, deleteEvent, acceptEvent } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const selectedView = getSelectedView() ? [getSelectedView()] : [];
    const calendarTimeslots = [
        ...selectedView,
        ...user.events.map((event) => {
            let dayOfWeek = dayjs(event.event_date).format("dddd");
            let start = dayjs(event.event_date).format("HH:mm");
            let end = dayjs(event.event_date)
                .add(event.event_duration, "minute")
                .format("HH:mm");

            return {
                view_event: event,
                view_color:
                    event.event_status === "denied" ||
                    event.event_status === "canceled"
                        ? "#FF2E00"
                        : event.event_status === "pending"
                        ? "#FEA82F"
                        : event.event_status === "confirmed"
                        ? "#00A300"
                        : "",
                view_schedule: {
                    sunday:
                        dayOfWeek === "Sunday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                    monday:
                        dayOfWeek === "Monday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                    tuesday:
                        dayOfWeek === "Tuesday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                    wednesday:
                        dayOfWeek === "Wednesday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                    thursday:
                        dayOfWeek === "Thursday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                    friday:
                        dayOfWeek === "Friday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                    saturday:
                        dayOfWeek === "Saturday"
                            ? [{ start_time: start, end_time: end }]
                            : [],
                },
            };
        }),
    ];

    return (
        <Box
            display="flex"
            flexDirection={isNonMobileScreens ? "column" : "row"}
            flexWrap="nowrap"
            flexGrow="1"
            width="100%"
        >
            Calendar with selected view + events + google calendar events
            <Box height="260px" width="100%">
                <Schedule
                    direction="vertical"
                    type="read"
                    pxSize="750"
                    incrementSize="1"
                    views={calendarTimeslots}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
            </Box>
            <Box height="260px" width="100%"></Box>
        </Box>
    );
};

export default Calendar;
