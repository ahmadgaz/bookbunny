import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CRUDFunctionsContext } from "App";
import { setRouteBeforeLogInOrSignUp } from "state";
import useEmblaCarousel from "embla-carousel-react";
import Logo from "../../assets/Logo-02.svg";
import { ArrowBack, ArrowRight } from "@mui/icons-material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import Container from "components/Container";

const NewEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = Boolean(useSelector((state) => state.token));
    const { user, getRecievingUser, getFirstFourUsers, createEvent } =
        useContext(CRUDFunctionsContext);
    let { eventTypeID } = useParams();
    let [receivingUser, setRecievingUser] = useState(null);

    // Get recieving user info
    useEffect(() => {
        async function getUser() {
            const reciever = await getRecievingUser(eventTypeID);
            setFixedOptions([user ? user.email : "", reciever.email]);
            setAutoCompleteValue([user ? user.email : "", reciever.email]);
            setAttendees([user, reciever]);
            setOptions([user ? user.email : "", reciever.email]);
            setRecievingUser(reciever);
        }
        getUser();
    }, []);

    // Embla carousel
    const [tab, setTab] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: "x",
        draggable: false,
    });
    const handleNext = (newValue) => {
        setTab(newValue);
    };
    useEffect(() => {
        const onSelect = () => {
            setTab(emblaApi.selectedScrollSnap());
        };
        if (emblaApi) {
            emblaApi.scrollTo(tab);
            emblaApi.on("select", onSelect); // Add event listener
        }
    }, [emblaApi, tab]);

    // If logging in/ signing up, set the previous page to this new event page so that after login it can redirect here
    const setPrevPageToNewEvent = () => {
        dispatch(
            setRouteBeforeLogInOrSignUp({
                routeBeforeLogInOrSignUp: `/newEvent/${eventTypeID}`,
            })
        );
    };

    const view = receivingUser
        ? !(
              typeof receivingUser === "string" ||
              receivingUser instanceof String
          )
            ? receivingUser.views.find((view) =>
                  view.event_types.some(
                      (et) => et._id.toString() === eventTypeID
                  )
              )
            : null
        : null;
    const eventType = view
        ? view.event_types.find((et) => et._id.toString() === eventTypeID)
        : null;
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const weekOfDatesFromToday = [];
    for (let i = 0; i < 7; i++) {
        weekOfDatesFromToday.push(dayjs().add(i, "day"));
    }
    const [
        listOfAvailableTimesOnChosenDay,
        setListOfAvailableTimesOnChosenDay,
    ] = useState([]);
    const dayContainsTimeslots = (idx) => {
        return (
            view.view_schedule[daysOfWeek[weekOfDatesFromToday[idx].day()]]
                .length > 0
        );
    };
    const handleSetDayChoice = (idx) => {
        setTimeChoice(null);
        setDayChoice(idx);

        const eventDuration = String(eventType.event_type_duration).match(
            /^(\d+):(\d+)$/
        );
        const eventDurationHr = parseInt(eventDuration[1], 10);
        const eventDurationMin = parseInt(eventDuration[2], 10);
        const increment = eventDurationHr * 60 + eventDurationMin;
        setDuration(increment);
        const schedule =
            view.view_schedule[daysOfWeek[weekOfDatesFromToday[idx].day()]];

        const eventsOfBothUsers = [...user.events, ...receivingUser.events];

        // Including dayjs plugins
        dayjs.extend(customParseFormat);
        dayjs.extend(isBetween);

        // Get user and recievingUsers events to prevent event overlap
        const eventsOfBothUsersTimes = eventsOfBothUsers.map((event) => {
            let start = dayjs(event.event_date);
            let end = dayjs(start.add(event.event_duration, "minute"));
            return {
                startTime: start,
                endTime: end,
            };
        });

        // Get view which the event_type falls under's timeslots' start_times and lengths (until end_times) for chosen day
        const times = schedule.map((timeslot) => {
            let start = dayjs(
                weekOfDatesFromToday[idx].format("YYYY-MM-DDT") +
                    timeslot.start_time +
                    ":00" +
                    weekOfDatesFromToday[idx].format("Z"),
                "YYYY-MM-DDTHH:mm:ssZ"
            );
            let end = dayjs(
                weekOfDatesFromToday[idx].format("YYYY-MM-DDT") +
                    timeslot.end_time +
                    ":00" +
                    weekOfDatesFromToday[idx].format("Z"),
                "YYYY-MM-DDTHH:mm:ssZ"
            );
            return {
                startTime: start,
                lengthInMinutes: end.diff(start, "minute"),
            };
        });

        // Set list of available timeslots to choose from based on availability and event duration
        const list = [];
        times.forEach((time, idx) => {
            if (time.lengthInMinutes < increment) {
                return;
            }
            for (
                let i = 0;
                i + increment <= time.lengthInMinutes;
                i += increment
            ) {
                if (
                    !eventsOfBothUsersTimes.some(
                        (event) =>
                            event.startTime.isBetween(
                                time.startTime.add(i, "minute"),
                                time.startTime.add(i + increment, "minute"),
                                "milliseconds",
                                "[]"
                            ) ||
                            event.endTime.isBetween(
                                time.startTime.add(i, "minute"),
                                time.startTime.add(
                                    i + increment,
                                    "minute",
                                    "milliseconds",
                                    "[]"
                                )
                            )
                    ) &&
                    time.startTime.add(i, "minute").isAfter(dayjs())
                ) {
                    list.push(time.startTime.add(i, "minute"));
                }
            }
        });
        setListOfAvailableTimesOnChosenDay(list);
    };
    // Days list
    const [dayChoice, setDayChoice] = useState(null);
    const days = () => {
        return weekOfDatesFromToday.map((date, idx) => {
            return (
                <Button
                    disabled={!dayContainsTimeslots(idx)}
                    key={idx}
                    sx={{ margin: "10px", gridColumn: "span 1" }}
                    variant={
                        dayContainsTimeslots(idx)
                            ? dayChoice === idx
                                ? "contained"
                                : "outlined"
                            : "contained"
                    }
                    onClick={() => {
                        handleSetDayChoice(idx);
                    }}
                >
                    {date.format("ddd, MMM D, YYYY")}
                </Button>
            );
        });
    };
    // Times list
    const handleSetTimeChoice = (idx) => {
        setTimeChoice(idx);
    };
    const [timeChoice, setTimeChoice] = useState(null);
    const times = () => {
        return listOfAvailableTimesOnChosenDay <= 0 ? (
            <Typography variant="body1" fontSize={24} color="gray">
                No available times
            </Typography>
        ) : (
            listOfAvailableTimesOnChosenDay.map((date, idx) => {
                return (
                    <Button
                        key={idx}
                        sx={{ margin: "10px", gridColumn: "span 1" }}
                        variant={timeChoice === idx ? "contained" : "outlined"}
                        onClick={() => {
                            handleSetTimeChoice(idx);
                        }}
                    >
                        {date.format("h:mm A")}
                    </Button>
                );
            })
        );
    };

    const [fixedOptions, setFixedOptions] = useState(null);
    const [autoCompleteValue, setAutoCompleteValue] = useState(null);
    const [attendeesTextFieldValue, setAttendeesTextFieldValue] = useState("");
    const [attendees, setAttendees] = useState(null);
    const [duration, setDuration] = useState(0);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (
            receivingUser &&
            !(
                typeof receivingUser === "string" ||
                receivingUser instanceof String
            )
        ) {
            async function fetchFilteredFirstFourUsers() {
                const users = await getFirstFourUsers(attendeesTextFieldValue);
                setOptions([
                    ...autoCompleteValue,
                    ...users
                        .filter(
                            (user) =>
                                !autoCompleteValue.some(
                                    (value) => value === user.email
                                )
                        )
                        .map((user) => {
                            return user.email;
                        }),
                ]);
                setAttendees([
                    user,
                    receivingUser,
                    ...users.filter(
                        (user) =>
                            !autoCompleteValue.some(
                                (value) => value === user.email
                            )
                    ),
                ]);
                setLoading(false);
            }
            fetchFilteredFirstFourUsers();
        }
    }, [attendeesTextFieldValue]);

    return !submitted ? (
        receivingUser ? (
            typeof receivingUser === "string" ||
            receivingUser instanceof String ? (
                <Typography variant="body1" fontSize={24}>
                    {receivingUser}
                </Typography>
            ) : (
                <Box width="100%" height="100vh">
                    {isAuth ? (
                        <Box display="grid" gridTemplateRows="15vh 70vh 15vh">
                            <Typography
                                justifySelf="center"
                                paddingTop="20px"
                                alignSelf="center"
                                variant="hero"
                                fontSize={40}
                            >
                                Book an event with{" "}
                                <b>{receivingUser.first_name}</b>!
                            </Typography>
                            <div
                                className="embla"
                                ref={emblaRef}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                }}
                            >
                                <div
                                    className="embla-container"
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        height: "100%",
                                    }}
                                >
                                    <div
                                        className="embla__slide"
                                        key="0"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            overflow: "auto",
                                            flex: "0 0 100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box p="20px" width="fit-content">
                                            <Container
                                                button={false}
                                                style={{
                                                    padding: "30px",
                                                    backgroundColor: "#fff",
                                                    textAlign: "left",
                                                    width: "fit-content",
                                                }}
                                            >
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                >
                                                    <Typography
                                                        variant="h1"
                                                        paddingLeft="5px"
                                                        margin="5px 0 10px 0"
                                                    >
                                                        {
                                                            eventType.event_type_name
                                                        }
                                                    </Typography>
                                                    <Box>
                                                        <Button
                                                            disabled={
                                                                dayChoice ===
                                                                null
                                                            }
                                                            endIcon={
                                                                <ArrowRight />
                                                            }
                                                            variant="contained"
                                                            onClick={() => {
                                                                handleNext(1);
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    flexWrap="nowrap"
                                                    justifyContent="space-between"
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        fontSize={24}
                                                        color="grey"
                                                        margin="0 0 20px 0"
                                                    >
                                                        <b>Duration: </b>
                                                        {
                                                            eventType.event_type_duration
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        fontSize={24}
                                                        color="grey"
                                                        margin="0 0 20px 0"
                                                        textAlign="left"
                                                    >
                                                        <b>Location: </b>
                                                        {
                                                            eventType.event_type_location
                                                        }
                                                    </Typography>
                                                </Box>
                                                <hr />
                                                <Typography
                                                    variant="body1"
                                                    fontSize={28}
                                                    margin="15px 0 20px 0"
                                                    textAlign="center"
                                                >
                                                    <b>Select a date</b>
                                                </Typography>
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    flexWrap="nowrap"
                                                >
                                                    <Box
                                                        display="grid"
                                                        gridTemplateColumns="repeat(4, auto)"
                                                    >
                                                        {days()}
                                                    </Box>
                                                </Box>
                                            </Container>
                                        </Box>
                                    </div>
                                    <div
                                        className="embla__slide"
                                        key="1"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            overflow: "auto",
                                            flex: "0 0 100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box p="20px" width="fit-content">
                                            <Container
                                                button={false}
                                                style={{
                                                    padding: "30px",
                                                    backgroundColor: "#fff",
                                                    textAlign: "left",
                                                    width: "fit-content",
                                                }}
                                            >
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    width="650px"
                                                    height="60px"
                                                    marginBottom="20px"
                                                >
                                                    <IconButton
                                                        onClick={() => {
                                                            setTab(0);
                                                        }}
                                                    >
                                                        <ArrowBack />
                                                    </IconButton>
                                                    <Typography
                                                        position="absolute"
                                                        left="50%"
                                                        variant="body1"
                                                        fontSize={28}
                                                        sx={{
                                                            transform:
                                                                "translateX(-50%)",
                                                        }}
                                                    >
                                                        <b>Select a time</b>
                                                    </Typography>
                                                    <Box>
                                                        <Button
                                                            disabled={
                                                                timeChoice ===
                                                                null
                                                            }
                                                            endIcon={
                                                                <ArrowRight />
                                                            }
                                                            variant="contained"
                                                            onClick={() => {
                                                                handleNext(2);
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    flexWrap="nowrap"
                                                >
                                                    <Box
                                                        display="grid"
                                                        gridTemplateColumns="repeat(4, auto)"
                                                    >
                                                        {times()}
                                                    </Box>
                                                </Box>
                                            </Container>
                                        </Box>
                                    </div>
                                    <div
                                        className="embla__slide"
                                        key="2"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            overflow: "auto",
                                            flex: "0 0 100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box p="20px" width="fit-content">
                                            <Container
                                                button={false}
                                                style={{
                                                    padding: "30px",
                                                    backgroundColor: "#fff",
                                                    textAlign: "left",
                                                    width: "fit-content",
                                                }}
                                            >
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    width="650px"
                                                    height="65px"
                                                    marginBottom="20px"
                                                >
                                                    <IconButton
                                                        onClick={() => {
                                                            setTab(1);
                                                        }}
                                                    >
                                                        <ArrowBack />
                                                    </IconButton>
                                                    <Typography
                                                        position="absolute"
                                                        left="50%"
                                                        top="30px"
                                                        variant="body1"
                                                        fontSize={28}
                                                        sx={{
                                                            transform:
                                                                "translateX(-50%)",
                                                        }}
                                                    >
                                                        <b>Almost there</b>
                                                    </Typography>
                                                    <Typography
                                                        position="absolute"
                                                        top="70px"
                                                        left="50%"
                                                        variant="body2"
                                                        fontSize={20}
                                                        color="gray"
                                                        sx={{
                                                            transform:
                                                                "translateX(-50%)",
                                                        }}
                                                    >
                                                        Add some more details!
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    flexWrap="nowrap"
                                                >
                                                    <Box
                                                        display="grid"
                                                        gridTemplateColumns="repeat(4, auto)"
                                                    >
                                                        <TextField
                                                            disabled
                                                            label="Duration"
                                                            value={
                                                                eventType.event_type_duration
                                                            }
                                                            sx={{
                                                                gridColumn:
                                                                    "span 4",
                                                                margin: "10px",
                                                            }}
                                                        />
                                                        <TextField
                                                            label="Notes"
                                                            onChange={(e) => {
                                                                setNotes(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            name="event_notes"
                                                            sx={{
                                                                gridColumn:
                                                                    "span 4",
                                                                margin: "10px",
                                                            }}
                                                        />
                                                        {autoCompleteValue && (
                                                            <Autocomplete
                                                                multiple
                                                                id="event_attendees"
                                                                limitTags={3}
                                                                value={
                                                                    autoCompleteValue
                                                                }
                                                                sx={{
                                                                    gridColumn:
                                                                        "span 4",
                                                                    margin: "10px",
                                                                }}
                                                                onChange={(
                                                                    event,
                                                                    newValue
                                                                ) => {
                                                                    setAutoCompleteValue(
                                                                        [
                                                                            ...fixedOptions,
                                                                            ...newValue.filter(
                                                                                (
                                                                                    option
                                                                                ) =>
                                                                                    fixedOptions.indexOf(
                                                                                        option
                                                                                    ) ===
                                                                                    -1
                                                                            ),
                                                                        ]
                                                                    );
                                                                }}
                                                                options={
                                                                    options
                                                                }
                                                                loading={
                                                                    loading
                                                                }
                                                                renderTags={(
                                                                    tagValue,
                                                                    getTagProps
                                                                ) =>
                                                                    tagValue.map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <Chip
                                                                                label={
                                                                                    option
                                                                                }
                                                                                {...getTagProps(
                                                                                    {
                                                                                        index,
                                                                                    }
                                                                                )}
                                                                                disabled={
                                                                                    fixedOptions.indexOf(
                                                                                        option
                                                                                    ) !==
                                                                                    -1
                                                                                }
                                                                            />
                                                                        )
                                                                    )
                                                                }
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        {...params}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setLoading(
                                                                                true
                                                                            );
                                                                            setAttendeesTextFieldValue(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        }}
                                                                        label="Attendees"
                                                                        placeholder="Add a Guest"
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                            endAdornment:
                                                                                (
                                                                                    <Fragment>
                                                                                        {loading ? (
                                                                                            <CircularProgress
                                                                                                color="inherit"
                                                                                                size={
                                                                                                    20
                                                                                                }
                                                                                            />
                                                                                        ) : null}
                                                                                        {
                                                                                            params
                                                                                                .InputProps
                                                                                                .endAdornment
                                                                                        }
                                                                                    </Fragment>
                                                                                ),
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        )}

                                                        <Box
                                                            sx={{
                                                                gridColumn:
                                                                    "span 4",
                                                                margin: "20px 10px 0 10px",
                                                            }}
                                                        >
                                                            <Container
                                                                fullWidth
                                                                button
                                                                size="m"
                                                                variant="contained"
                                                                onClick={() => {
                                                                    createEvent(
                                                                        {
                                                                            event_date:
                                                                                listOfAvailableTimesOnChosenDay[
                                                                                    timeChoice
                                                                                ],
                                                                            event_duration:
                                                                                duration,
                                                                            event_notes:
                                                                                notes,
                                                                            event_attendees:
                                                                                attendees.map(
                                                                                    (
                                                                                        attendee
                                                                                    ) =>
                                                                                        attendee._id
                                                                                ),
                                                                        },
                                                                        eventTypeID
                                                                    );
                                                                    setSubmitted(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Schedule
                                                            </Container>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Container>
                                        </Box>
                                    </div>
                                </div>
                            </div>
                            <img
                                src={Logo}
                                alt="Logo"
                                style={{
                                    justifySelf: "center",
                                    alignSelf: "center",
                                    height: "50px",
                                    margin: "10px 0",
                                }}
                            />
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            width="100vw"
                            height="100vh"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography
                                variant="hero"
                                textAlign="center"
                                fontSize={56}
                                sx={{ margin: "40px" }}
                            >
                                <b>Log in</b> or <b>create an account</b> and
                                book an event with{" "}
                                <b>{receivingUser.first_name}</b>!
                            </Typography>
                            <Box
                                display="grid"
                                gridTemplateColumns="200px 200px"
                            >
                                <Box justifySelf="center" alignSelf="center">
                                    <Container
                                        button
                                        size="m"
                                        variant="outlined"
                                        onClick={() => {
                                            setPrevPageToNewEvent();
                                            navigate("/login");
                                        }}
                                    >
                                        Log In
                                    </Container>
                                </Box>
                                <Box justifySelf="center" alignSelf="center">
                                    <Container
                                        button
                                        size="m"
                                        variant="contained"
                                        onClick={() => {
                                            setPrevPageToNewEvent();
                                            navigate("/register");
                                        }}
                                    >
                                        Sign Up
                                    </Container>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            )
        ) : (
            <Typography variant="h3" margin="50px">
                Loading...
            </Typography>
        )
    ) : (
        <Box
            display="flex"
            width="100vw"
            height="100vh"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Typography
                variant="hero"
                fontSize={56}
                textAlign="center"
                sx={{ margin: "40px" }}
            >
                You've successfully booked <b>{eventType.event_type_name}</b>{" "}
                for{" "}
                <b>
                    {listOfAvailableTimesOnChosenDay[timeChoice].format(
                        "MMMM D, YYYY"
                    )}
                </b>{" "}
                at{" "}
                <b>
                    {listOfAvailableTimesOnChosenDay[timeChoice].format(
                        "h:mm A"
                    )}
                </b>
                !
            </Typography>

            <Container
                button
                size="m"
                variant="contained"
                onClick={() => {
                    navigate("/dashboard");
                }}
            >
                Return Home
            </Container>
        </Box>
    );
};

export default NewEvent;
