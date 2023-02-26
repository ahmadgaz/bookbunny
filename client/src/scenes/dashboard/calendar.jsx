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

const Calendar = () => {
    const { user, getSelectedView, deleteEvent, acceptEvent } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const selectedView = getSelectedView() ? [getSelectedView()] : [];
    const [startOfCurrentWeek, setStartOfCurrentWeek] = useState(
        dayjs().startOf("week")
    );
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
            display="grid"
            m="20px"
            p="20px"
            height="auto"
            gridTemplateColumns="10vw 10vw 10vw 10vw 10vw 10vw 10vw"
            gridTemplateRows=" 60px 100px 100px 100px 100px 100px 100px"
            columnGap="20px"
            rowGap="20px"
        >
            <Box
                sx={{
                    width: "fit-content",
                    height: "100%",
                    gridColumnStart: 1,
                    gridColumnEnd: 8,
                    gridRowStart: 1,
                    gridRowEnd: 8,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box padding="10px 20px">
                        <Typography variant="h2">
                            {startOfCurrentWeek.month() ===
                            startOfCurrentWeek.add(7, "days").month()
                                ? startOfCurrentWeek.format("MMMM")
                                : `${startOfCurrentWeek.format(
                                      "MMMM"
                                  )} - ${startOfCurrentWeek
                                      .add(7, "days")
                                      .format("MMMM")}`}
                        </Typography>
                    </Box>
                </Box>
                <Box display="grid" gridTemplateColumns="50px 690px 50px">
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
                            width: "50px",
                            marginTop: "20px",
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
                    <Container
                        fullWidth
                        fullHeight
                        button={false}
                        style={{
                            padding: "0 30px",
                            height: "100%",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box
                            position="relative"
                            paddingTop="20px"
                            display="grid"
                            gridTemplateColumns="50px 78.5px 78.5px 78.5px 78.5px 78.5px 78.5px 78.5px"
                            gridTemplateRows="fit-content"
                        >
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            ></Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>{startOfCurrentWeek.format("D")}</i>
                            </Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>
                                    {startOfCurrentWeek
                                        .add(1, "days")
                                        .format("D")}
                                </i>
                            </Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>
                                    {startOfCurrentWeek
                                        .add(2, "days")
                                        .format("D")}
                                </i>
                            </Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>
                                    {startOfCurrentWeek
                                        .add(3, "days")
                                        .format("D")}
                                </i>
                            </Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>
                                    {startOfCurrentWeek
                                        .add(4, "days")
                                        .format("D")}
                                </i>
                            </Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>
                                    {startOfCurrentWeek
                                        .add(5, "days")
                                        .format("D")}
                                </i>
                            </Typography>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="gray"
                            >
                                <i>
                                    {startOfCurrentWeek
                                        .add(6, "days")
                                        .format("D")}
                                </i>
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
                                direction="vertical"
                                type="read"
                                pxSize="750"
                                incrementSize="1"
                                views={[...selectedView, ...userEvents]}
                                deleteEvent={deleteEvent}
                                acceptEvent={acceptEvent}
                            />
                        </Box>
                    </Container>
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
                            width: "30px",
                            cursor: "pointer",
                            marginTop: "20px",
                            paddingLeft: "50px",
                            height: "43.2px",
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
        </Box>
    );
};

export default Calendar;
