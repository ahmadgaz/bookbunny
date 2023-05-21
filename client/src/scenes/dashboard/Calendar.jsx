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
import { useSelector } from "react-redux";

const Calendar = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const { user, getSelectedView, deleteEvent, acceptEvent, getGoogleEvents } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const selectedView = getSelectedView() ? [getSelectedView()] : [];
    const [startOfCurrentWeek, setStartOfCurrentWeek] = useState(
        dayjs().startOf("week")
    );
    const [googleEvents, setGoogleEvents] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [pendingRequests, setPendingRequests] = useState(0);
    dayjs.extend(isBetween);
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
    useEffect(() => {
        async function getEvents() {
            setPendingRequests((prev) => {
                setRandomKey(v4());
                setLoading("Loading...");
                return prev + 1;
            });
            const calendars = await getGoogleEvents(
                startOfCurrentWeek.toISOString()
            );
            let events = [];
            if (calendars.length) {
                calendars.forEach((calendar) => {
                    calendar.forEach((event) => {
                        if (user.events.some((e) => e.event_id === event.id)) {
                            return;
                        }
                        if (!event.start.dateTime || !event.end.dateTime) {
                            return;
                        }
                        if (
                            !dayjs(event.start.dateTime).isSame(
                                event.end.dateTime,
                                "day"
                            )
                        ) {
                            return;
                        }
                        let dayOfWeek = dayjs(event.start.dateTime).format(
                            "dddd"
                        );
                        let start = dayjs(event.start.dateTime).format("HH:mm");
                        let end = dayjs(event.end.dateTime).format("HH:mm");
                        if (end == "00:00") {
                            end = "24:00";
                        }

                        events.push({
                            view_google_event: { event_name: event.summary },
                            view_color: colors.neutralDark[300],
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
                        });
                    });
                });
            }
            setPendingRequests((prev) => {
                if (prev === 1) {
                    setLoading("");
                    setRandomKey(v4());
                }
                return prev - 1;
            });
            setGoogleEvents(events);
        }
        getEvents();
    }, [startOfCurrentWeek]);

    const [leftArrowHovered, setLeftArrowHovered] = useState(false);
    const [rightArrowHovered, setRightArrowHovered] = useState(false);
    const [randomKey, setRandomKey] = useState(v4()); // Random key used to remount the Schedule component when needed as it won't remount without changing the key

    return isNonMobileScreens ? (
        <Box
            sx={{
                width: "fit-content",
                height: "940px",
                display: "flex",
                flexDirection: "column",
                marginBottom: "30px",
            }}
        >
            <Box
                display="flex"
                width="100%"
                justifyContent="center"
                alignItems="center"
            >
                <Box padding="10px 20px">
                    <Typography variant="h3">
                        <b>
                            {startOfCurrentWeek.month() ===
                            startOfCurrentWeek.add(7, "days").month()
                                ? `${startOfCurrentWeek.format(
                                      "MMMM"
                                  )} ${startOfCurrentWeek.format("YYYY")}`
                                : `${startOfCurrentWeek.format(
                                      "MMMM"
                                  )} - ${startOfCurrentWeek
                                      .add(7, "days")
                                      .format(
                                          "MMMM"
                                      )} ${startOfCurrentWeek.format("YYYY")}`}
                        </b>
                    </Typography>
                </Box>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="50px min(710px, 70vw) 50px"
                flexGrow={1}
            >
                <div
                    onClick={() => {
                        setLoading("Loading...");
                        setRandomKey(v4());
                        setStartOfCurrentWeek(
                            startOfCurrentWeek.subtract(7, "days")
                        );
                    }}
                    onMouseOver={() => setLeftArrowHovered(true)}
                    onMouseLeave={() => setLeftArrowHovered(false)}
                    style={{
                        marginTop: "20px",
                        width: "30px",
                        cursor: "pointer",
                        height: "43.2px",
                    }}
                >
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            width: "5px",
                            height: "55%",
                            rotate: "45deg",
                            border: leftArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease",
                        }}
                    ></Box>
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            top: leftArrowHovered ? "-12px" : "-10px",
                            width: "5px",
                            height: "55%",
                            rotate: "-45deg",
                            border: leftArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease, top 0.1s ease",
                        }}
                    ></Box>
                </div>
                <Box marginBottom="30px" width="100%" height="100%">
                    <Container
                        fullWidth
                        fullHeight
                        button={false}
                        style={{
                            padding: "0 20px",
                            maxWidth: "90vw",
                            backgroundColor: colors.neutralLight[100],
                        }}
                    >
                        {loading ? (
                            <Box
                                position="relative"
                                width="100%"
                                height="fit-content"
                            >
                                <Box position="absolute">
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
                                            color={colors.neutralDark[300]}
                                        ></Typography>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
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
                                            views={[]}
                                            deleteEvent={deleteEvent}
                                            acceptEvent={acceptEvent}
                                        />
                                    </Box>
                                </Box>
                                <div className="loading-backdrop"></div>
                            </Box>
                        ) : (
                            <>
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
                                        color={colors.neutralDark[300]}
                                    ></Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek.isSame(
                                                dayjs(),
                                                "day"
                                            )
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek.format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(1, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(1, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(2, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(2, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(3, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(3, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(4, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(4, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(5, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(5, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(6, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(6, "days")
                                            .format("D")}
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
                                        views={[
                                            ...selectedView,
                                            ...googleEvents,
                                            ...userEvents,
                                        ]}
                                        deleteEvent={deleteEvent}
                                        acceptEvent={acceptEvent}
                                    />
                                </Box>
                            </>
                        )}
                    </Container>
                </Box>
                <div
                    onClick={() => {
                        setStartOfCurrentWeek(
                            startOfCurrentWeek.add(7, "days")
                        );
                    }}
                    onMouseOver={() => setRightArrowHovered(true)}
                    onMouseLeave={() => setRightArrowHovered(false)}
                    style={{
                        width: "30px",
                        cursor: "pointer",
                        height: "43.2px",
                        marginTop: "20px",
                        paddingLeft: "45px",
                    }}
                >
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            width: "5px",
                            height: "55%",
                            rotate: "-45deg",
                            border: rightArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease",
                        }}
                    ></Box>
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            top: rightArrowHovered ? "-12px" : "-10px",
                            width: "5px",
                            height: "55%",
                            rotate: "45deg",
                            border: rightArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease, top 0.1s ease",
                        }}
                    ></Box>
                </div>
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                width: "fit-content",
                height: "940px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "30px",
            }}
        >
            <Box
                margin="20px 0"
                display="grid"
                gridTemplateColumns="50px auto 50px"
                width="100%"
            >
                <div
                    onClick={() => {
                        setLoading("Loading...");
                        setRandomKey(v4());
                        setStartOfCurrentWeek(
                            startOfCurrentWeek.subtract(7, "days")
                        );
                    }}
                    onMouseOver={() => setLeftArrowHovered(true)}
                    onMouseLeave={() => setLeftArrowHovered(false)}
                    style={{
                        marginTop: "20px",
                        width: "30px",
                        cursor: "pointer",
                        height: "43.2px",
                    }}
                >
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            width: "5px",
                            height: "55%",
                            rotate: "45deg",
                            border: leftArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease",
                        }}
                    ></Box>
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            top: leftArrowHovered ? "-12px" : "-10px",
                            width: "5px",
                            height: "55%",
                            rotate: "-45deg",
                            border: leftArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease, top 0.1s ease",
                        }}
                    ></Box>
                </div>
                <Box paddingBottom="5px" alignSelf="end" justifySelf="center">
                    <Typography variant="h2">
                        <b>
                            {startOfCurrentWeek.month() ===
                            startOfCurrentWeek.add(7, "days").month()
                                ? `${startOfCurrentWeek.format(
                                      "MMMM"
                                  )} ${startOfCurrentWeek.format("YYYY")}`
                                : `${startOfCurrentWeek.format(
                                      "MMMM"
                                  )} - ${startOfCurrentWeek
                                      .add(7, "days")
                                      .format(
                                          "MMMM"
                                      )} ${startOfCurrentWeek.format("YYYY")}`}
                        </b>
                    </Typography>
                </Box>
                <div
                    onClick={() => {
                        setStartOfCurrentWeek(
                            startOfCurrentWeek.add(7, "days")
                        );
                    }}
                    onMouseOver={() => setRightArrowHovered(true)}
                    onMouseLeave={() => setRightArrowHovered(false)}
                    style={{
                        width: "30px",
                        cursor: "pointer",
                        height: "43.2px",
                        marginTop: "20px",
                        paddingLeft: "45px",
                    }}
                >
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            width: "5px",
                            height: "55%",
                            rotate: "-45deg",
                            border: rightArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease",
                        }}
                    ></Box>
                    <Box
                        backgroundColor={colors.neutralDark[500]}
                        sx={{
                            position: "relative",
                            top: rightArrowHovered ? "-12px" : "-10px",
                            width: "5px",
                            height: "55%",
                            rotate: "45deg",
                            border: rightArrowHovered
                                ? ` 4px solid ${colors.neutralDark[500]}`
                                : ` 0px solid ${colors.neutralDark[500]}`,
                            transition: "border 0.1s ease, top 0.1s ease",
                        }}
                    ></Box>
                </div>
            </Box>
            <Box flexGrow={1}>
                <Box marginBottom="30px" width="100%" height="100%">
                    <Container
                        fullWidth
                        fullHeight
                        button={false}
                        style={{
                            padding: "0 20px",
                            maxWidth: "90vw",
                            backgroundColor: colors.neutralLight[100],
                        }}
                    >
                        {loading ? (
                            <Box
                                position="relative"
                                width="100%"
                                height="fit-content"
                            >
                                <Box position="absolute">
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
                                            color={colors.neutralDark[300]}
                                        ></Typography>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
                                        <Box
                                            height="30.75px"
                                            backgroundColor={
                                                colors.neutralDark[100]
                                            }
                                            sx={{
                                                clipPath:
                                                    "circle(14px at 50% 45%)",
                                            }}
                                        ></Box>
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
                                            views={[]}
                                            deleteEvent={deleteEvent}
                                            acceptEvent={acceptEvent}
                                        />
                                    </Box>
                                </Box>
                                <div className="loading-backdrop"></div>
                            </Box>
                        ) : (
                            <>
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
                                        color={colors.neutralDark[300]}
                                    ></Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek.isSame(
                                                dayjs(),
                                                "day"
                                            )
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek.format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(1, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(1, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(2, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(2, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(3, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(3, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(4, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(4, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(5, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(5, "days")
                                            .format("D")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        lineHeight={1.7}
                                        textAlign="center"
                                        color={colors.neutralDark[300]}
                                        backgroundColor={
                                            startOfCurrentWeek
                                                .add(6, "days")
                                                .isSame(dayjs(), "day")
                                                ? colors.neutralDark[100]
                                                : ""
                                        }
                                        sx={{
                                            clipPath: "circle(14px at 50% 45%)",
                                        }}
                                    >
                                        {startOfCurrentWeek
                                            .add(6, "days")
                                            .format("D")}
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
                                        views={[
                                            ...selectedView,
                                            ...googleEvents,
                                            ...userEvents,
                                        ]}
                                        deleteEvent={deleteEvent}
                                        acceptEvent={acceptEvent}
                                    />
                                </Box>
                            </>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;
