import { Box, Typography, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { CRUDFunctionsContext } from "App";
import Schedule from "components/Schedule/Schedule";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Container from "components/Container";
import { useState } from "react";
import { tokens } from "theme";
import { v4 } from "uuid";
import { useEffect } from "react";

const Calendar = () => {
    const { user, getSelectedView, deleteEvent, acceptEvent, getGoogleEvents } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const selectedView = getSelectedView() ? [getSelectedView()] : [];
    const [startOfCurrentWeek, setStartOfCurrentWeek] = useState(
        dayjs().startOf("week")
    );
    const [googleEvents, setGoogleEvents] = useState([]);
    console.log(googleEvents);
    dayjs.extend(isBetween);
    useEffect(() => {
        async function getEvents() {
            const events = await getGoogleEvents(
                startOfCurrentWeek.toISOString()
            );
            setGoogleEvents(events);
        }
        getEvents();
    }, [startOfCurrentWeek]);
    const userEvents = user.views
        ? [
              ...user.events
                  .filter((event) =>
                      dayjs(event.event_date).isBetween(
                          startOfCurrentWeek,
                          startOfCurrentWeek.add(7, "days")
                      )
                  )
                  .map((event) => {
                      let dayOfWeek = dayjs(event.event_date).format("dddd");
                      let start = dayjs(event.event_date).format("HH:mm");
                      let end = dayjs(event.event_date)
                          .add(event.event_duration, "minute")
                          .format("HH:mm");

                      if (end === "00:00") {
                          end = "24:00";
                      }

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
          ]
        : [];
    const [leftArrowHovered, setLeftArrowHovered] = useState(false);
    const [rightArrowHovered, setRightArrowHovered] = useState(false);
    const [randomKey, setRandomKey] = useState(v4()); // Random key used to remount the Schedule component when needed as it won't remount without changing the key
    const colors = tokens("light");

    return (
        <Box
            sx={{
                width: "fit-content",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: "120px",
            }}
        >
            <Box
                display="flex"
                width="100%"
                justifyContent="center"
                alignItems="center"
            >
                <Box padding="10px 20px">
                    <Typography
                        variant="h2"
                        fontSize={isNonMobileScreens ? 36 : 28}
                    >
                        {startOfCurrentWeek.month() ===
                        startOfCurrentWeek.add(7, "days").month()
                            ? `${startOfCurrentWeek.format(
                                  "MMMM"
                              )} ${startOfCurrentWeek.format("YYYY")}`
                            : `${startOfCurrentWeek.format(
                                  "MMMM"
                              )} - ${startOfCurrentWeek
                                  .add(7, "days")
                                  .format("MMMM")} ${startOfCurrentWeek.format(
                                  "YYYY"
                              )}`}
                    </Typography>
                </Box>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="7.5vmin min(710px, 70vw) 7.5vmin"
            >
                <div
                    onClick={() => {
                        setRandomKey(v4());
                        setStartOfCurrentWeek(
                            startOfCurrentWeek.subtract(7, "days")
                        );
                    }}
                    onMouseOver={() => setLeftArrowHovered(true)}
                    onMouseLeave={() => setLeftArrowHovered(false)}
                    style={{
                        width: "7.5vmin",
                        marginTop: "3vmin",
                        cursor: "pointer",
                        height: "7.5vmin",
                    }}
                >
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            width: "0.75vmin",
                            height: "3vmin",
                            rotate: "45deg",
                            border: leftArrowHovered
                                ? ` 0.61vmin solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease",
                        }}
                    ></Box>
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            top: leftArrowHovered ? "-1.60vmin" : "-1.40vmin",
                            width: "0.75vmin",
                            height: "3vmin",
                            rotate: "-45deg",
                            border: leftArrowHovered
                                ? ` 0.61vmin solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease, top 0.1s ease",
                        }}
                    ></Box>
                </div>
                <Box marginBottom="30px" width="100%">
                    <Container
                        fullWidth
                        button={false}
                        style={{
                            padding: "0 20px",
                            maxWidth: "90vw",
                            height: "77vh",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box
                            position="relative"
                            paddingTop="20px"
                            display="grid"
                            gridTemplateColumns="50px 85.6px 85.6px 85.6px 85.6px 85.6px 85.6px 85.6px"
                            gridTemplateRows="fit-content"
                        >
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                            ></Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek.isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.format("D")}
                            </Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek
                                        .add(1, "days")
                                        .isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.add(1, "days").format("D")}
                            </Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek
                                        .add(2, "days")
                                        .isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.add(2, "days").format("D")}
                            </Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek
                                        .add(3, "days")
                                        .isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.add(3, "days").format("D")}
                            </Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek
                                        .add(4, "days")
                                        .isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.add(4, "days").format("D")}
                            </Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek
                                        .add(5, "days")
                                        .isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.add(5, "days").format("D")}
                            </Typography>
                            <Typography
                                variant="h5"
                                lineHeight={1.7}
                                textAlign="center"
                                color="gray"
                                backgroundColor={
                                    startOfCurrentWeek
                                        .add(6, "days")
                                        .isSame(dayjs(), "day")
                                        ? "#eeeeee"
                                        : ""
                                }
                                sx={{
                                    clipPath: "circle(14px at 50% 45%)",
                                }}
                            >
                                {startOfCurrentWeek.add(6, "days").format("D")}
                            </Typography>
                        </Box>
                        <Box
                            position="relative"
                            top="-10px"
                            height="750px"
                            width="600px"
                        >
                            <Schedule
                                key={randomKey}
                                week={startOfCurrentWeek}
                                direction="vertical"
                                type="read"
                                pxSize="750"
                                incrementDuration="1"
                                views={[...selectedView, ...userEvents]}
                                deleteEvent={deleteEvent}
                                acceptEvent={acceptEvent}
                            />
                        </Box>
                    </Container>
                </Box>
                <div
                    onClick={() => {
                        setRandomKey(v4());
                        setStartOfCurrentWeek(
                            startOfCurrentWeek.add(7, "days")
                        );
                    }}
                    onMouseOver={() => setRightArrowHovered(true)}
                    onMouseLeave={() => setRightArrowHovered(false)}
                    style={{
                        width: "7.5vmin",
                        marginTop: "3vmin",
                        cursor: "pointer",
                        height: "7.5vmin",
                        paddingLeft: "7.25vmin",
                    }}
                >
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            width: "0.75vmin",
                            height: "3vmin",
                            rotate: "-45deg",
                            border: rightArrowHovered
                                ? ` 0.61vmin solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease",
                        }}
                    ></Box>
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            top: rightArrowHovered ? "-1.60vmin" : "-1.40vmin",
                            width: "0.75vmin",
                            height: "3vmin",
                            rotate: "45deg",
                            border: rightArrowHovered
                                ? ` 0.61vmin solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease, top 0.1s ease",
                        }}
                    ></Box>
                </div>
            </Box>
        </Box>
    );
};

export default Calendar;
