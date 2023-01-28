import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    TextField,
} from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CRUDFunctionsContext } from "App";
import { setRouteBeforeLogInOrSignUp } from "state";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowBack } from "@mui/icons-material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

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
            setFixedOptions([user.email, reciever.email]);
            setAutoCompleteValue([user.email, reciever.email]);
            setAttendees([user, reciever]);
            setOptions([user.email, reciever.email]);
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
        return listOfAvailableTimesOnChosenDay <= 0
            ? "No available times"
            : listOfAvailableTimesOnChosenDay.map((date, idx) => {
                  return (
                      <Button
                          key={idx}
                          variant={
                              timeChoice === idx ? "contained" : "outlined"
                          }
                          onClick={() => {
                              handleSetTimeChoice(idx);
                          }}
                      >
                          {date.format("h:mm A")}
                      </Button>
                  );
              });
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
            console.log(attendeesTextFieldValue);
        }
    }, [attendeesTextFieldValue]);

    return !submitted ? (
        receivingUser ? (
            typeof receivingUser === "string" ||
            receivingUser instanceof String ? (
                <div>{receivingUser}</div>
            ) : (
                <Box width="100%" height="100vh">
                    {isAuth ? (
                        <Box>
                            Book an event with {receivingUser.first_name}!
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
                                            flex: "0 0 100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            flexWrap="nowrap"
                                        >
                                            <Box>
                                                Day
                                                <Button
                                                    disabled={
                                                        dayChoice === null
                                                    }
                                                    variant="contained"
                                                    onClick={() => {
                                                        handleNext(1);
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                            </Box>
                                            <Box>{days()}</Box>
                                        </Box>
                                    </div>
                                    <div
                                        className="embla__slide"
                                        key="1"
                                        style={{
                                            flex: "0 0 100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            flexWrap="nowrap"
                                        >
                                            <Box>
                                                <IconButton
                                                    onClick={() => {
                                                        setTab(0);
                                                    }}
                                                >
                                                    <ArrowBack />
                                                </IconButton>
                                                Time
                                                <Button
                                                    disabled={
                                                        timeChoice === null
                                                    }
                                                    variant="contained"
                                                    onClick={() => {
                                                        handleNext(2);
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                            </Box>
                                            <Box>{times()}</Box>
                                        </Box>
                                    </div>
                                    <div
                                        className="embla__slide"
                                        key="2"
                                        style={{
                                            flex: "0 0 100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            flexWrap="nowrap"
                                        >
                                            <Box>
                                                <IconButton
                                                    onClick={() => {
                                                        setTab(1);
                                                    }}
                                                >
                                                    <ArrowBack />
                                                </IconButton>
                                                {eventType.event_type_name}
                                                <br />
                                                <TextField
                                                    disabled
                                                    label="Duration"
                                                    value={
                                                        eventType.event_type_duration
                                                    }
                                                />
                                                <br />
                                                <br />
                                                <TextField
                                                    label="Notes"
                                                    onChange={(e) => {
                                                        setNotes(
                                                            e.target.value
                                                        );
                                                    }}
                                                    name="event_notes"
                                                />
                                                <br />
                                                <br />
                                                {autoCompleteValue && (
                                                    <Autocomplete
                                                        multiple
                                                        id="event_attendees"
                                                        limitTags={3}
                                                        value={
                                                            autoCompleteValue
                                                        }
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
                                                        options={options}
                                                        loading={loading}
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
                                                        style={{ width: 500 }}
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
                                                                        e.target
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
                                                <br />
                                                <Button
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
                                                        setSubmitted(true);
                                                    }}
                                                >
                                                    Schedule
                                                </Button>
                                            </Box>
                                        </Box>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    ) : (
                        <Box>
                            Log in and book an event with{" "}
                            {receivingUser.first_name}!
                            <Box>
                                <Button
                                    color="inherit"
                                    onClick={() => {
                                        setPrevPageToNewEvent();
                                        navigate("/login");
                                    }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    color="inherit"
                                    variant="contained"
                                    onClick={() => {
                                        setPrevPageToNewEvent();
                                        navigate("/register");
                                    }}
                                >
                                    Sign up
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            )
        ) : (
            <Box>Loading</Box>
        )
    ) : (
        <Box>You've successfully booked the event!</Box>
    );
};

export default NewEvent;
