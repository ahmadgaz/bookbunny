import { Close, LocationOn, Notes } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    IconButton,
    Paper,
    Popover,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CRUDFunctionsContext } from "App";
import Container from "components/Container";
import dayjs from "dayjs";
import { useContext } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { tokens } from "theme";
import { v4 } from "uuid";
import { getTime, getPosAndSize } from "./convertData";
import Event from "./Event";

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : {
              r: "",
              g: "",
              b: "",
          };
}
function move(input, from, to) {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(to, numberOfDeletedElm, elm);
}

const Timeline = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const {
        direction,
        ticker,
        type,
        pxSize,
        label,
        views,
        incrementDuration,
        updateView,
        deleteEvent,
        acceptEvent,
    } = props;
    const useStyles = makeStyles({
        timeslotHoverAnimation: {
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: `${colors.borderRadius / 2}px`,
            backgroundColor: "rgb(255,255,255,0)",
            opacity: "25%",
            boxShadow: "0",
            mixBlendMode: "luminosity",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
                backgroundColor: "rgb(255,255,255, 0.5)",
                boxShadow: `1px 1px 5px ${colors.neutralDark[900]}`,
            },
        },
    });
    const classes = useStyles();

    class TimeslotData {
        constructor(color, time, event, googleEvent) {
            this.key = v4();
            this.direction = direction;
            this.color = color;
            this.borderColor = `rgba(${hexToRgb(color).r - 50}, ${
                hexToRgb(color).g - 50
            }, ${hexToRgb(color).b - 50}, 1)`;
            this.time = time;
            this.event = event;
            this.googleEvent = googleEvent;
            this.eventWidth = "90%";
            this.eventHeight = "90%";
            this.opacity = "100%";
        }
        getStyle() {
            return {
                position: "absolute",
                overflow: "hidden",
                cursor:
                    type === "write"
                        ? "no-drop"
                        : this.event
                        ? this.event.event_status === "denied" ||
                          this.event.event_status === "canceled"
                            ? "no-drop"
                            : ""
                        : "",
                left:
                    this.direction === "horizontal"
                        ? this.position + "px"
                        : "0px",
                top:
                    this.direction === "vertical"
                        ? this.position + "px"
                        : "0px",
                width:
                    this.direction === "horizontal"
                        ? `calc(${this.size}px - 1px)`
                        : this.event || this.googleEvent
                        ? this.eventWidth
                        : "100%",
                height:
                    this.direction === "vertical"
                        ? `calc(${this.size}px - 1px)`
                        : this.event || this.googleEvent
                        ? this.eventHeight
                        : "100%",
                borderRadius: `${colors.borderRadius / 2}px`,
                border:
                    this.size > 0
                        ? type === "write"
                            ? `${colors.borderSize}px solid ${this.borderColor}`
                            : this.event
                            ? `${colors.borderSize}px  solid ${this.borderColor}`
                            : ""
                        : "",
                opacity: this.opacity,
                background:
                    type === "read" &&
                    // views.some((view) => view.view_event) &&
                    !this.event
                        ? `repeating-linear-gradient(45deg, ${this.color}AA, ${this.color}AA 1px,  ${this.color}7F 2.5px,  ${this.color}7F 10px)`
                        : this.color,
                WebkitUserSelect: "none",
                KhtmlUserSelect: "none",
                MozUserSelect: "none",
                MsUserSelect: "none",
                userSelect: "none",
                transition:
                    "left 0.05s ease, top 0.05s ease, height 0.05s ease,width 0.05s ease",
            };
        }
        setDirection(direction) {
            this.direction = direction;
        }

        setColor(color) {
            this.color = color;
        }
        setCellDistFromBoundingClient(target) {
            this.cellDistFromBoundingClient =
                this.direction === "vertical"
                    ? target.getBoundingClientRect().top
                    : target.getBoundingClientRect().left;
        }
        setRawPosition(e) {
            this.rawPosition =
                this.direction === "vertical"
                    ? e.clientY - this.cellDistFromBoundingClient
                    : e.clientX - this.cellDistFromBoundingClient;
        }
        setIncrement(target) {
            this.increment =
                this.direction === "vertical"
                    ? target.clientHeight / ((60 / incrementDuration) * 24)
                    : target.clientWidth / ((60 / incrementDuration) * 24);
        }
        IsNearIncrementMark() {
            return this.rawPosition % this.increment < this.increment / 5 ||
                this.rawPosition % this.increment >
                    this.increment - this.increment / 5
                ? true
                : false;
        }
        setTime(isFor = "pos", time) {
            if (isFor === "pos") {
                this.time = {
                    start_time: `${getTime(
                        this.rawPosition - (this.rawPosition % this.increment),
                        this.increment
                    )}`,
                    end_time: `${getTime(
                        this.rawPosition - (this.rawPosition % this.increment),
                        this.increment
                    )}`,
                };
            } else if (isFor === "size") {
                this.time.end_time = `${getTime(
                    this.rawPosition +
                        this.increment / 5 -
                        ((this.rawPosition + this.increment / 5) %
                            this.increment) -
                        this.position >=
                        0
                        ? this.rawPosition +
                              this.increment / 5 -
                              ((this.rawPosition + this.increment / 5) %
                                  this.increment)
                        : 0,
                    this.increment
                )}`;
            } else if (isFor === "time") {
                this.time = time;
            }
            // {start_time: "00:00", end_time: "00:00"}
        }
        setPosition() {
            this.position = getPosAndSize(
                this.time,
                this.increment,
                incrementDuration
            ).pos;
        }
        setSize() {
            this.size = getPosAndSize(
                this.time,
                this.increment,
                incrementDuration
            ).size;
        }
        correctOverlapsForWriteComponents(timeslotsDataCurrent) {
            let data = [...timeslotsDataCurrent];
            data.forEach((timeslot, idx) => {
                if (this.key === timeslot.key) {
                    return;
                }
                let checks = {
                    thisEndIsBetweenTimeslot:
                        this.position + this.size > timeslot.position &&
                        this.position + this.size <=
                            timeslot.position + timeslot.size,
                    thisStartIsBetweenTimeslot:
                        this.position >= timeslot.position &&
                        this.position < timeslot.position + timeslot.size,
                    timeslotIsInsideThis:
                        timeslot.position >= this.position &&
                        timeslot.position < this.position + this.size &&
                        timeslot.position + timeslot.size > this.position &&
                        timeslot.position + timeslot.size <=
                            this.position + this.size,
                };
                if (
                    checks.thisEndIsBetweenTimeslot &&
                    checks.thisStartIsBetweenTimeslot
                ) {
                    let time = timeslot.time;
                    timeslot.size = this.position - timeslot.position;
                    timeslot.time = {
                        start_time: `${getTime(
                            timeslot.position,
                            this.increment
                        )}`,
                        end_time: `${getTime(
                            timeslot.position + timeslot.size,
                            this.increment
                        )}`,
                    };
                    data = [
                        ...data.flatMap((t, i) => {
                            if (idx === i) {
                                let splitSlot = new TimeslotData(
                                    timeslot.direction,
                                    timeslot.label,
                                    timeslot.color,
                                    time
                                );
                                splitSlot.cellDistFromBoundingClient =
                                    timeslot.cellDistFromBoundingClient;
                                splitSlot.increment = timeslot.increment;
                                splitSlot.setPosition();
                                splitSlot.setSize();
                                return [t, splitSlot];
                            }
                            return t;
                        }),
                    ];
                    data[idx + 1].size =
                        data[idx + 1].position +
                        data[idx + 1].size -
                        (this.position + this.size);
                    data[idx + 1].position = this.position + this.size;
                    data[idx + 1].time = {
                        start_time: `${getTime(
                            data[idx + 1].position,
                            this.increment
                        )}`,
                        end_time: `${getTime(
                            data[idx + 1].position + data[idx + 1].size,
                            this.increment
                        )}`,
                    };
                    return;
                }
                if (checks.thisStartIsBetweenTimeslot) {
                    timeslot.size = this.position - timeslot.position;
                    timeslot.time = {
                        start_time: `${getTime(
                            timeslot.position,
                            this.increment
                        )}`,
                        end_time: `${getTime(
                            timeslot.position + timeslot.size,
                            this.increment
                        )}`,
                    };
                    return;
                }
                if (checks.thisEndIsBetweenTimeslot) {
                    timeslot.size =
                        timeslot.position +
                        timeslot.size -
                        (this.position + this.size);
                    timeslot.position = this.position + this.size;
                    timeslot.time = {
                        start_time: `${getTime(
                            timeslot.position,
                            this.increment
                        )}`,
                        end_time: `${getTime(
                            timeslot.position + timeslot.size,
                            this.increment
                        )}`,
                    };
                    return;
                }
                if (checks.timeslotIsInsideThis) {
                    data.splice(idx, 1);
                    data = this.correctOverlapsForWriteComponents(data);
                }
                return;
            });
            return data;
        }
        sortOpaqueParts(opaqueParts) {
            // [12 < 20] <
            // [30 < 40] <
            // [50 < 80] <
            // [90 < 95] <

            let parts = opaqueParts;
            let ptr = parts.length - 1;

            if (ptr <= 0 || parts === null || parts === undefined) {
                return parts;
            }

            for (let i = parts.length - 2; i >= 0; i--) {
                if (parts[i].percentages[1] < parts[ptr].percentages[0]) {
                    return parts;
                }
                move(parts, ptr, i);
                ptr = i;
            }

            return parts;
        }
        correctOverlapsForReadComponents(timeslotsDataCurrent) {
            let data = [...timeslotsDataCurrent];

            data.forEach((timeslot, idx) => {
                if (
                    !(this.googleEvent || this.event) ||
                    !(timeslot.googleEvent || timeslot.event)
                ) {
                    return;
                }
                if (this.key === timeslot.key) {
                    return;
                }
                let checks = {
                    // ----[----    ]
                    thisEndIsBetweenTimeslot:
                        this.position + this.size > timeslot.position &&
                        this.position + this.size <=
                            timeslot.position + timeslot.size,
                    // [   ----]----
                    thisStartIsBetweenTimeslot:
                        this.position >= timeslot.position &&
                        this.position < timeslot.position + timeslot.size,
                    // ---[----]----
                    timeslotIsInsideThis:
                        timeslot.position >= this.position &&
                        timeslot.position < this.position + this.size &&
                        timeslot.position + timeslot.size > this.position &&
                        timeslot.position + timeslot.size <=
                            this.position + this.size,
                };
                if (
                    checks.thisEndIsBetweenTimeslot &&
                    checks.thisStartIsBetweenTimeslot
                ) {
                    if (this.event) {
                        this.opacity = "80%";
                    }
                    this.eventWidth = `${parseInt(this.eventWidth) - 10}%`;
                    this.eventHeight = `${parseInt(this.eventHeight) - 10}%`;
                    return;
                }
                if (checks.thisStartIsBetweenTimeslot) {
                    if (this.event) {
                        this.opacity = "80%";
                    }
                    this.eventWidth = `${parseInt(this.eventWidth) - 10}%`;
                    this.eventHeight = `${parseInt(this.eventHeight) - 10}%`;
                    return;
                }
                if (checks.timeslotIsInsideThis) {
                }
            });
            return data;
        }
        handlePopoverOpen(event) {
            this.popoverAnchorEl = event.currentTarget;
            updateTimeslots();
        }
        handlePopoverClose() {
            this.popoverAnchorEl = null;
            updateTimeslots();
        }
    }

    const cell = useRef();
    const view = useRef();
    const timeslotsData = useRef([]);
    const [timeslots, setTimeslots] = useState([]);
    const [cursor, setCursor] = useState("copy");

    const setSelectedView = () => {
        let data = [];
        let schedule = view.current.view_schedule[label.toLowerCase()];
        if (schedule.length > 0) {
            schedule.forEach((timeslot) => {
                data.push(
                    new TimeslotData(
                        view.current.view_color,
                        timeslot,
                        null,
                        null
                    )
                );
                data[data.length - 1].setCellDistFromBoundingClient(
                    cell.current
                );
                data[data.length - 1].setIncrement(cell.current);
                data[data.length - 1].setPosition();
                data[data.length - 1].setSize();
                data[data.length - 1].correctOverlapsForWriteComponents(data);
            });
        }
        return data;
    };
    const setAllViews = () => {
        let data = [];
        if (views.length > 0) {
            views.forEach((view) => {
                let schedule = view.view_schedule[label.toLowerCase()];
                if (schedule.length > 0) {
                    schedule.forEach((timeslot) => {
                        data.push(
                            new TimeslotData(
                                view.view_color,
                                timeslot,
                                view.view_event ? view.view_event : null,
                                view.view_google_event
                                    ? view.view_google_event
                                    : null
                            )
                        );
                        data[data.length - 1].setCellDistFromBoundingClient(
                            cell.current
                        );
                        data[data.length - 1].setIncrement(cell.current);
                        data[data.length - 1].setPosition();
                        data[data.length - 1].setSize();
                        if (view.view_google_event || view.view_event) {
                            data[
                                data.length - 1
                            ].correctOverlapsForReadComponents(data);
                        }
                    });
                }
            });
        }
        return data;
    };
    const [timeTicker, setTimeTicker] = useState(<div></div>);
    useEffect(() => {
        if (!views[0]) {
            view.current = [];
        }
        if (views.length > 0) {
            view.current = JSON.parse(JSON.stringify(views[0]));
            if (type === "write") {
                timeslotsData.current = setSelectedView();
            } else {
                timeslotsData.current = setAllViews();
            }
            timeslotsData.current = handleMouseUpMouseLeave();
            updateTimeslots();
        }
        setTimeTicker(
            views.length > 0 ? (
                <div
                    style={{
                        position: "absolute",
                        left:
                            direction === "horizontal"
                                ? getPosAndSize(
                                      {
                                          start_time: dayjs().format("HH:mm"),
                                          end_time: dayjs()
                                              .add(1, "minutes")
                                              .format("HH:mm"),
                                      },
                                      cell.current.clientWidth /
                                          ((60 / incrementDuration) * 24),
                                      incrementDuration
                                  ).pos + "px"
                                : "0px",
                        top:
                            direction === "vertical"
                                ? getPosAndSize(
                                      {
                                          start_time: dayjs().format("HH:mm"),
                                          end_time: dayjs()
                                              .add(1, "minutes")
                                              .format("HH:mm"),
                                      },
                                      cell.current.clientHeight /
                                          ((60 / incrementDuration) * 24),
                                      incrementDuration
                                  ).pos + "px"
                                : "0px",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                        WebkitUserSelect: "none",
                        KhtmlUserSelect: "none",
                        MozUserSelect: "none",
                        MsUserSelect: "none",
                        userSelect: "none",
                        backgroundColor: colors.redAccent[500],
                        height: "1px",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            backgroundColor: colors.redAccent[500],
                            marginRight: "-3px",
                        }}
                    ></div>
                </div>
            ) : (
                <div></div>
            )
        );
    }, [direction, type, pxSize, label, views]);

    const handleOnMouseDown = (e) => {
        let color = view.current.view_color;
        let data = timeslotsData.current;
        data.push(new TimeslotData(color));
        data[data.length - 1].setCellDistFromBoundingClient(e.target);
        data[data.length - 1].setRawPosition(e);
        data[data.length - 1].setIncrement(e.target);
        data[data.length - 1].setTime("pos");
        data[data.length - 1].setPosition();
        data[data.length - 1].setSize();

        if (e.target.parentElement.parentElement === cell.current) {
            data = handleMouseUpMouseLeave();
            return data;
        }

        cell.current.addEventListener("mousemove", handleMouseMove, true);
        return data;
    };
    const handleMouseMove = useCallback((e) => {
        timeslotsData.current = mouseMove(e);
        updateTimeslots();
    }, []);
    const mouseMove = (e) => {
        setCursor("grabbing");
        let data = timeslotsData.current;
        data[data.length - 1].setRawPosition(e);

        // Set current timeslot
        if (data[data.length - 1].IsNearIncrementMark()) {
            data[data.length - 1].setTime("size");
            data[data.length - 1].setSize();
            data =
                data[data.length - 1].correctOverlapsForWriteComponents(data);
        }

        return data;
    };
    const handleMouseUpMouseLeave = () => {
        let data = timeslotsData.current;

        if (data.length > 0) {
            data.forEach((timeslot, idx) => {
                if (timeslot.size <= 0) {
                    data.splice(idx, 1);
                }
            });
        }

        if (view.current !== undefined) {
            view.current.view_schedule[label.toLowerCase()] = data.map(
                (timeslot) => timeslot.time
            );
        }

        setCursor("copy");
        cell.current.removeEventListener("mousemove", handleMouseMove, true);
        return data;
    };
    const handleOnTimeslotClick = (idx) => {
        let data = timeslotsData.current;
        data.splice(idx, 1);
        return data;
    };
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const updateTimeslots = () => {
        setTimeslots([
            ...timeslotsData.current.map((timeslot, idx) => (
                <div
                    key={timeslot.key}
                    style={timeslot.getStyle()}
                    onMouseDown={(e) => {
                        if (type === "write") {
                            timeslotsData.current = handleOnTimeslotClick(idx);
                            view.current.view_schedule[label.toLowerCase()] =
                                timeslotsData.current.map(
                                    (timeslot) => timeslot.time
                                );
                            updateTimeslots();
                        } else if (type === "read" && timeslot.event) {
                            if (
                                timeslot.event.event_status !== "denied" &&
                                timeslot.event.event_status !== "canceled"
                            ) {
                                timeslot.handlePopoverOpen(e);
                            } else if (
                                timeslot.event.event_status === "denied" ||
                                timeslot.event.event_status === "canceled"
                            ) {
                                timeslotsData.current =
                                    handleOnTimeslotClick(idx);
                                view.current.view_schedule[
                                    label.toLowerCase()
                                ] = timeslotsData.current.map(
                                    (timeslot) => timeslot.time
                                );
                                deleteEvent(timeslot.event);
                                updateTimeslots();
                            }
                        }
                    }}
                >
                    {timeslot.event && (
                        <div
                            style={{
                                width: "100%",
                                position: "absolute",
                                padding: "3px 0 0 5px",
                                fontSize: "0.5rem",
                                opacity: "40%",
                            }}
                        >
                            <b>{timeslot.event.event_name}</b>
                        </div>
                    )}
                    {timeslot.googleEvent && (
                        <div
                            style={{
                                width: "100%",
                                position: "absolute",
                                padding: "3px 0 0 5px",
                                fontSize: "0.5rem",
                                opacity: "40%",
                            }}
                        >
                            <b>{timeslot.googleEvent.event_name}</b>
                        </div>
                    )}
                    <div
                        className={
                            type === "write"
                                ? classes.timeslotHoverAnimation
                                : type === "read" && timeslot.event
                                ? classes.timeslotHoverAnimation
                                : ""
                        }
                    ></div>
                    {timeslot.event && isNonMobileScreens ? (
                        <Popover
                            open={Boolean(timeslot.popoverAnchorEl)}
                            anchorEl={timeslot.popoverAnchorEl}
                            anchorOrigin={{
                                vertical: "center",
                                horizontal: "center",
                            }}
                            PaperProps={{
                                style: {
                                    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                                    overflow: "visible",
                                    backgroundColor: "rgba(0,0,0,0)",
                                    marginTop: "10px",
                                },
                            }}
                            onClose={() => {
                                timeslot.handlePopoverClose();
                            }}
                        >
                            <Container
                                fullWidth
                                button={false}
                                style={{
                                    minWidth: "335px",
                                    padding: "0",
                                    backgroundColor: colors.neutralLight[100],
                                }}
                            >
                                <Event timeslot={timeslot} />
                            </Container>
                        </Popover>
                    ) : (
                        <Dialog
                            fullScreen
                            open={Boolean(timeslot.popoverAnchorEl)}
                            onClose={() => {
                                timeslot.handlePopoverClose();
                            }}
                        >
                            <Paper
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexWrap: "nowrap",
                                    padding: "20px 0",
                                    overflow: "auto",
                                    textAlign: "center",
                                    alignItems: "center",
                                    width: "100vw",
                                    height: "100vh",
                                }}
                            >
                                <IconButton
                                    onClick={() => {
                                        timeslot.handlePopoverClose();
                                    }}
                                    sx={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "5px",
                                    }}
                                >
                                    <Close />
                                </IconButton>
                                <Event timeslot={timeslot} />
                            </Paper>
                        </Dialog>
                    )}
                </div>
            )),
        ]);
    };

    return (
        <div
            style={{
                flex: "1 1 0px",
                display: "grid",
                alignContent: "center",
                gridTemplateColumns:
                    direction === "horizontal" ? `60px ${pxSize}` : "",
                gridTemplateRows:
                    direction === "vertical" ? `60px ${pxSize}` : "",
                width:
                    direction === "horizontal" ? `calc(60px + ${pxSize})` : "",
                height:
                    direction === "vertical" ? `calc(60px + ${pxSize})` : "",
            }}
        >
            {/* LABEL */}
            <h6
                style={{
                    justifySelf: direction === "vertical" ? "center" : "right",
                    alignSelf: "center",
                    padding: "0 15px",
                    margin: "10px",
                    fontSize: "0.4em",
                    color: colors.neutralDark[300],
                    WebkitTapHighlightColor: "transparent",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    KhtmlUserSelect: "none",
                    MozUserSelect: "none",
                    MsUserSelect: "none",
                    userSelect: "none",
                }}
            >
                {label}
            </h6>

            {/* TIMELINE */}
            <div
                ref={cell}
                style={{
                    position: "relative",
                    display: "flex",
                    cursor: type === "read" ? "" : cursor,
                    flexDirection: direction === "vertical" ? "row" : "column",
                    flexWrap: "nowrap",
                    borderLeft:
                        direction === "vertical"
                            ? `0.5px solid ${colors.neutralDark[300]}`
                            : "",
                    borderTop:
                        direction === "horizontal"
                            ? `0.5px solid ${colors.neutralDark[300]}`
                            : "",
                    width: direction === "horizontal" ? "100%" : "85%",
                    height: direction === "vertical" ? "100%" : "80%",
                    minHeight: 0,
                }}
                onTouchStartCapture={(e) => {
                    if (type === "write" && views.length > 0) {
                        e.persist();
                        timeslotsData.current = handleOnMouseDown(e.touches[0]);
                        updateTimeslots();
                    }
                }}
                onTouchMoveCapture={(e) => {
                    if (type === "write" && views.length > 0) {
                        handleMouseMove(e.touches[0]);
                    }
                }}
                onTouchEndCapture={() => {
                    if (type === "write" && views.length > 0) {
                        timeslotsData.current = handleMouseUpMouseLeave();
                        updateTimeslots();
                        updateView(view.current);
                    }
                }}
                onMouseDownCapture={(e) => {
                    if (type === "write" && views.length > 0) {
                        e.persist();
                        timeslotsData.current = handleOnMouseDown(e);
                        updateTimeslots();
                    }
                }}
                onMouseUpCapture={() => {
                    if (type === "write" && views.length > 0) {
                        timeslotsData.current = handleMouseUpMouseLeave();
                        updateTimeslots();
                        updateView(view.current);
                    }
                }}
                onMouseLeave={() => {
                    if (type === "write" && views.length > 0) {
                        timeslotsData.current = handleMouseUpMouseLeave();
                        updateTimeslots();
                        updateView(view.current);
                    }
                }}
            >
                {ticker && timeTicker}
                {timeslots}
            </div>
        </div>
    );
};

export default Timeline;
