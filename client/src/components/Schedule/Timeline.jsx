import { makeStyles } from "@mui/styles";
import { useState, useEffect, useRef, useCallback } from "react";
import { v4 } from "uuid";
import { getTime, getPosAndSize } from "./convertData";

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
              result[3],
              16
          )}`
        : null;
}
function move(input, from, to) {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(to, numberOfDeletedElm, elm);
}
const useStyles = makeStyles({
    timeslotHoverAnimation: {
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
    const { direction, type, pxSize, label, views, updateView } = props;
    const classes = useStyles();

    class TimeslotData {
        constructor(color, time) {
            this.key = v4();
            this.direction = direction;
            this.color = color;
            this.time = time;
        }
        getStyle() {
            return {
                position: "absolute",
                cursor: type === "read" ? "" : "no-drop",
                left:
                    this.direction === "horizontal"
                        ? this.position + "px"
                        : "0px",
                top:
                    this.direction === "vertical"
                        ? this.position + "px"
                        : "0px",
                width:
                    this.direction === "horizontal" ? this.size + "px" : "100%",
                height:
                    this.direction === "vertical" ? this.size + "px" : "100%",
                borderRadius: "2px",
                border: this.size > 0 ? "1px inset rgba(0,0,0,0.25)" : "",
                background: this.color,
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
        setThirtyMinSize(target) {
            this.thirtyMinSize =
                this.direction === "vertical"
                    ? target.clientHeight / 48
                    : target.clientWidth / 48;
        }
        IsNearThirtyMinMark() {
            return this.rawPosition % this.thirtyMinSize <
                this.thirtyMinSize / 5 ||
                this.rawPosition % this.thirtyMinSize >
                    this.thirtyMinSize - this.thirtyMinSize / 5
                ? true
                : false;
        }
        setTime(isFor = "pos", time) {
            if (isFor === "pos") {
                this.time = {
                    start_time: `${getTime(
                        this.rawPosition -
                            (this.rawPosition % this.thirtyMinSize),
                        this.thirtyMinSize
                    )}`,
                    end_time: `${getTime(
                        this.rawPosition -
                            (this.rawPosition % this.thirtyMinSize),
                        this.thirtyMinSize
                    )}`,
                };
            } else if (isFor === "size") {
                this.time.end_time = `${getTime(
                    this.rawPosition +
                        this.thirtyMinSize / 5 -
                        ((this.rawPosition + this.thirtyMinSize / 5) %
                            this.thirtyMinSize) -
                        this.position >=
                        0
                        ? this.rawPosition +
                              this.thirtyMinSize / 5 -
                              ((this.rawPosition + this.thirtyMinSize / 5) %
                                  this.thirtyMinSize)
                        : 0,
                    this.thirtyMinSize
                )}`;
            } else if (isFor === "time") {
                this.time = time;
            }
            // {start_time: "00:00", end_time: "00:00"}
        }
        setPosition() {
            this.position = getPosAndSize(this.time, this.thirtyMinSize).pos;
        }
        setSize() {
            this.size = getPosAndSize(this.time, this.thirtyMinSize).size;
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
                            this.thirtyMinSize
                        )}`,
                        end_time: `${getTime(
                            timeslot.position + timeslot.size,
                            this.thirtyMinSize
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
                                splitSlot.thirtyMinSize =
                                    timeslot.thirtyMinSize;
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
                            this.thirtyMinSize
                        )}`,
                        end_time: `${getTime(
                            data[idx + 1].position + data[idx + 1].size,
                            this.thirtyMinSize
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
                            this.thirtyMinSize
                        )}`,
                        end_time: `${getTime(
                            timeslot.position + timeslot.size,
                            this.thirtyMinSize
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
                            this.thirtyMinSize
                        )}`,
                        end_time: `${getTime(
                            timeslot.position + timeslot.size,
                            this.thirtyMinSize
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
            const color = `rgba(${hexToRgb(this.color)}, 1)`;
            const opaqueColor = ` rgba(${hexToRgb(this.color)}, 0.5)`;
            let opaqueParts = [];
            let linearGradient = `linear-gradient(${
                direction === "horizontal" ? "90deg" : "180deg"
            }, ${color} 0%, ${color} 100%)`;

            // HOW IT WORKS:
            // let opaqueParts = [`, ${color} 32%, ${opaqueColor} 32%, ${opaqueColor} 60%, ${color} 60%`]
            // let opaqueParts = [`, ${color} 32%, ${opaqueColor} 32%, ${opaqueColor} 60%, ${color} 60%`, `,  ${color} 80%, ${opaqueColor} 80%, ${opaqueColor} 90%, ${color} 90%`]
            // let linearGradient = `linear-gradient(${direction === "horizontal" ? "90deg" : "180deg"}, ${color} 0%${opaqueParts.join("")}, ${color} 100%)`

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
                        ((timeslot.position + timeslot.size - this.position) /
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
                        ((timeslot.position - this.position) / this.size) * 100;
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
                        ((timeslot.position - this.position) / this.size) * 100;
                    let opaqueEnd =
                        ((timeslot.position + timeslot.size - this.position) /
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
                data.push(new TimeslotData(view.current.view_color, timeslot));
                data[data.length - 1].setCellDistFromBoundingClient(
                    cell.current
                );
                data[data.length - 1].setThirtyMinSize(cell.current);
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
                        data.push(new TimeslotData(view.view_color, timeslot));
                        data[data.length - 1].setCellDistFromBoundingClient(
                            cell.current
                        );
                        data[data.length - 1].setThirtyMinSize(cell.current);
                        data[data.length - 1].setPosition();
                        data[data.length - 1].setSize();
                        data[data.length - 1].correctOverlapsForReadComponents(
                            data
                        );
                    });
                }
            });
        }
        return data;
    };
    useEffect(() => {
        if (views.length > 0) {
            view.current = JSON.parse(JSON.stringify(views[0]));
        }
        if (type === "write") {
            timeslotsData.current = setSelectedView();
        } else {
            timeslotsData.current = setAllViews();
        }
        timeslotsData.current = handleMouseUpMouseLeave();
        updateTimeslots();
    }, [direction, type, pxSize, label, views]);

    const handleOnMouseDown = (e) => {
        let color = view.current.view_color;
        let data = timeslotsData.current;
        data.push(new TimeslotData(color));
        data[data.length - 1].setCellDistFromBoundingClient(e.target);
        data[data.length - 1].setRawPosition(e);
        data[data.length - 1].setThirtyMinSize(e.target);
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
        if (data[data.length - 1].IsNearThirtyMinMark()) {
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
    const updateTimeslots = () => {
        setTimeslots([
            ...timeslotsData.current.map((timeslot, idx) => (
                <div
                    key={timeslot.key}
                    style={timeslot.getStyle()}
                    onMouseDown={() => {
                        if (type === "write") {
                            timeslotsData.current = handleOnTimeslotClick(idx);
                            view.current.view_schedule[label.toLowerCase()] =
                                timeslotsData.current.map(
                                    (timeslot) => timeslot.time
                                );
                            updateTimeslots();
                        }
                    }}
                >
                    <div
                        className={
                            type === "write"
                                ? classes.timeslotHoverAnimation
                                : ""
                        }
                    ></div>
                </div>
            )),
        ]);
    };

    return (
        <div
            style={{
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
                    if (type === "write") {
                        e.persist();
                        timeslotsData.current = handleOnMouseDown(e.touches[0]);
                        updateTimeslots();
                    }
                }}
                onTouchMoveCapture={(e) => {
                    if (type === "write") {
                        handleMouseMove(e.touches[0]);
                    }
                }}
                onTouchEndCapture={() => {
                    if (type === "write") {
                        timeslotsData.current = handleMouseUpMouseLeave();
                        updateTimeslots();
                        updateView(view.current);
                    }
                }}
                onMouseDownCapture={(e) => {
                    if (type === "write") {
                        e.persist();
                        timeslotsData.current = handleOnMouseDown(e);
                        updateTimeslots();
                    }
                }}
                onMouseUpCapture={() => {
                    if (type === "write") {
                        timeslotsData.current = handleMouseUpMouseLeave();
                        updateTimeslots();
                        updateView(view.current);
                    }
                }}
                onMouseLeave={() => {
                    if (type === "write") {
                        timeslotsData.current = handleMouseUpMouseLeave();
                        updateTimeslots();
                        updateView(view.current);
                    }
                }}
            >
                {timeslots}
            </div>
        </div>
    );
};

export default Timeline;
