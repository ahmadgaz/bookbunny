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
const useStyles = makeStyles({
    timeslotHoverAnimation: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "2px",
        backgroundColor: "rgb(255,255,255,0)",
        opacity: "25%",
        boxShadow: "0",
        mixBlendMode: "luminosity",
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
            backgroundColor: "rgb(255,255,255, 0.5)",
            boxShadow: "1px 1px 5px black",
        },
    },
});

const Timeline = (props) => {
    const { getAttendeesInfo } = useContext(CRUDFunctionsContext);
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
    const classes = useStyles();

    class TimeslotData {
        constructor(color, time, event) {
            this.key = v4();
            this.direction = direction;
            this.color = color;
            this.borderColor = `rgba(${hexToRgb(color).r - 100}, ${
                hexToRgb(color).g - 100
            }, ${hexToRgb(color).b - 100}, 1)`;
            this.time = time;
            this.event = event;
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
                        : this.event
                        ? "90%"
                        : "100%",
                height:
                    this.direction === "vertical"
                        ? `calc(${this.size}px - 1px)`
                        : this.event
                        ? "90%"
                        : "100%",
                borderRadius: "5px",
                border: this.size > 0 ? `1.5px solid ${this.borderColor}` : "",
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
                    // console.log('same slot');
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
                    // console.log('inside slot');
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
                    // console.log('start overlaps slot');
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
                    // console.log('end overlaps slot');
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
                    // console.log('overtakes slot');
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
            const color = `rgba(${hexToRgb(this.color).r}, ${
                hexToRgb(this.color).g
            }, ${hexToRgb(this.color).b}, 1)`;
            const opaqueColor = ` rgba(${hexToRgb(this.color).r}, ${
                hexToRgb(this.color).g
            }, ${hexToRgb(this.color).b}, 0.5)`;
            let opaqueParts = [];
            let linearGradient = `linear-gradient(${
                direction === "horizontal" ? "90deg" : "180deg"
            }, ${color} 0%, ${color} 100%)`;

            // HOW IT WORKS:
            // let opaqueParts = [`, ${color} 32%, ${opaqueColor} 32%, ${opaqueColor} 60%, ${color} 60%`]
            // let opaqueParts = [`, ${color} 32%, ${opaqueColor} 32%, ${opaqueColor} 60%, ${color} 60%`, `,  ${color} 80%, ${opaqueColor} 80%, ${opaqueColor} 90%, ${color} 90%`]
            // let linearGradient = `linear-gradient(${direction === "horizontal" ? "90deg" : "180deg"}, ${color} 0%${opaqueParts.join("")}, ${color} 100%)`

            data.forEach((timeslot, idx) => {
                if (this.event) {
                    return;
                }
                if (this.key === timeslot.key) {
                    // console.log('same slot');
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
                    // console.log("inside slot");
                    // this.position --- 0%
                    // this.position + this.size --- 100%
                    let opaqueStart = 0;
                    let opaqueEnd = 100;
                    opaqueParts.push({
                        percentages: [opaqueStart, opaqueEnd],
                        str: `, ${color} ${opaqueStart}%, ${opaqueColor} ${opaqueStart}%, ${opaqueColor} ${opaqueEnd}%, ${color} ${opaqueEnd}%`,
                    });
                    opaqueParts = this.sortOpaqueParts(opaqueParts);
                    linearGradient = `linear-gradient(${
                        direction === "horizontal" ? "90deg" : "180deg"
                    }, ${color} 0%${opaqueParts
                        .map((part) => {
                            return part.str;
                        })
                        .join("")}, ${color} 100%)`;
                    this.color = linearGradient;
                }
                if (checks.thisStartIsBetweenTimeslot) {
                    // console.log("start overlaps slot");
                    // this.position --- 0%
                    // timeslot.position + timeslot.size - this.position --- ((timeslot.position + timeslot.size - this.position)/(this.size))%
                    let opaqueStart = 0;
                    let opaqueEnd =
                        ((timeslot.position +
                            timeslot.size -
                            this.position -
                            1) /
                            this.size) *
                        100;
                    opaqueParts.push({
                        percentages: [opaqueStart, opaqueEnd],
                        str: `, ${color} ${opaqueStart}%, ${opaqueColor} ${opaqueStart}%, ${opaqueColor} ${opaqueEnd}%, ${color} ${opaqueEnd}%`,
                    });
                    opaqueParts = this.sortOpaqueParts(opaqueParts);
                    linearGradient = `linear-gradient(${
                        direction === "horizontal" ? "90deg" : "180deg"
                    }, ${color} 0%${opaqueParts
                        .map((part) => {
                            return part.str;
                        })
                        .join("")}, ${color} 100%)`;
                    this.color = linearGradient;
                }
                if (checks.thisEndIsBetweenTimeslot) {
                    // console.log("end overlaps slot");
                    // timeslot.position - this.position --- ((timeslot.position - this.position)/(this.size))%
                    // this.position + this.size --- 100%
                    let opaqueStart =
                        ((timeslot.position - this.position + 1) / this.size) *
                        100;
                    let opaqueEnd = 100;
                    opaqueParts.push({
                        percentages: [opaqueStart, opaqueEnd],
                        str: `, ${color} ${opaqueStart}%, ${opaqueColor} ${opaqueStart}%, ${opaqueColor} ${opaqueEnd}%, ${color} ${opaqueEnd}%`,
                    });
                    opaqueParts = this.sortOpaqueParts(opaqueParts);
                    linearGradient = `linear-gradient(${
                        direction === "horizontal" ? "90deg" : "180deg"
                    }, ${color} 0%${opaqueParts
                        .map((part) => {
                            return part.str;
                        })
                        .join("")}, ${color} 100%)`;
                    this.color = linearGradient;
                }
                if (checks.timeslotIsInsideThis) {
                    // console.log("overtakes slot");
                    // timeslot.position
                    // thimeSlot.position + timeslot.size
                    let opaqueStart =
                        ((timeslot.position - this.position + 1) / this.size) *
                        100;
                    let opaqueEnd =
                        ((timeslot.position +
                            timeslot.size -
                            this.position -
                            1) /
                            this.size) *
                        100;
                    opaqueParts.push({
                        percentages: [opaqueStart, opaqueEnd],
                        str: `, ${color} ${opaqueStart}%, ${opaqueColor} ${opaqueStart}%, ${opaqueColor} ${opaqueEnd}%, ${color} ${opaqueEnd}%`,
                    });
                    opaqueParts = this.sortOpaqueParts(opaqueParts);
                    linearGradient = `linear-gradient(${
                        direction === "horizontal" ? "90deg" : "180deg"
                    }, ${color} 0%${opaqueParts
                        .map((part) => {
                            return part.str;
                        })
                        .join("")}, ${color} 100%)`;
                    this.color = linearGradient;
                }
            });
            // console.log(opaqueParts.map((part) => part.percentages));
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
                        view.current.view_event ? view.current.view_event : null
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
                                view.view_event ? view.view_event : null
                            )
                        );
                        data[data.length - 1].setCellDistFromBoundingClient(
                            cell.current
                        );
                        data[data.length - 1].setIncrement(cell.current);
                        data[data.length - 1].setPosition();
                        data[data.length - 1].setSize();
                        // data[data.length - 1].correctOverlapsForReadComponents(
                        //     data
                        // );
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
                    backgroundColor: "gray",
                    height: "1px",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        backgroundColor: "gray",
                        marginRight: "-3px",
                    }}
                ></div>
            </div>
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
                                deleteEvent(timeslot.event);
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
                                    padding: "0",
                                    backgroundColor: "#fff",
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
                    fontSize: "0.5em",
                    color: "#bbb",
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
                        direction === "vertical" ? "0.5px solid #bbb" : "",
                    borderTop:
                        direction === "horizontal" ? "0.5px solid #bbb" : "",
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
