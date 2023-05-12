import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { tokens } from "theme";
import { v4 } from "uuid";
import Timeline from "./Timeline";
const Schedule = (props) => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    /* FORMAT
    view => [{view_color: "", view_schedule: [{
       sunday: [{start_time: "00:00", end_time: "00:00"}]
       ...
       saturday: ...
    }]}]
    */

    const {
        direction,
        week,
        type,
        pxSize,
        views = [],
        incrementDuration = 30,
        updateView = () => {},
        deleteEvent = () => {},
        acceptEvent = () => {},
    } = props;
    const dividers = [];
    for (let i = 0; i < 24; i++) {
        dividers.push(
            <div
                key={i}
                style={{
                    position: "relative",
                    borderLeft:
                        direction === "horizontal"
                            ? `0.5px solid ${colors.neutralDark[300]}`
                            : "",
                    borderTop:
                        direction === "vertical"
                            ? `0.5px solid ${colors.neutralDark[300]}`
                            : "",
                    width:
                        direction === "horizontal"
                            ? `calc((${pxSize}px / 24))`
                            : "100%",
                    height:
                        direction === "vertical"
                            ? `calc((${pxSize}px  / 24))`
                            : "100%",
                    WebkitTapHighlightColor: "transparent",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    KhtmlUserSelect: "none",
                    MozUserSelect: "none",
                    MsUserSelect: "none",
                    userSelect: "none",
                }}
            >
                <h6
                    style={{
                        margin: 0,
                        padding: "5px",
                        fontSize: "0.4em",
                        color: colors.neutralDark[300],
                    }}
                >
                    {i === 0 ? "12" : i > 12 ? `${i - 12}` : `${i}`}
                    <br />
                    {i === 0 ? "AM" : i >= 12 ? `PM` : `AM`}
                </h6>
            </div>
        );
    }

    const [touchAction, setTouchAction] = useState("none");
    const key = useRef(v4());

    return (
        <div
            onTouchStart={() => {
                key.current = v4();
                setTouchAction("auto");
            }}
            onTouchEnd={() => {
                key.current = v4();
                setTouchAction("none");
            }}
            onTouchEndCapture={() => {
                key.current = v4();
                setTouchAction("none");
            }}
            onTouchCancel={() => {
                key.current = v4();
                setTouchAction("none");
            }}
            onTouchCancelCapture={() => {
                key.current = v4();
                setTouchAction("none");
            }}
            style={{
                position: "relative",
                width:
                    direction === "horizontal"
                        ? `${parseInt(pxSize) + 60}px`
                        : "100%",
                height:
                    direction === "vertical"
                        ? `${parseInt(pxSize) + 60}px`
                        : "100%",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                KhtmlUserSelect: "none",
                MozUserSelect: "none",
                MsUserSelect: "none",
                userSelect: "none",
            }}
        >
            <div
                key={key.current}
                style={{
                    position: "relative",
                    width:
                        direction === "horizontal"
                            ? `${parseInt(pxSize) + 60}px`
                            : "100%",
                    height:
                        direction === "vertical"
                            ? `${parseInt(pxSize) + 60}px`
                            : "100%",
                    touchAction: type === "write" ? touchAction : "auto",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: direction === "horizontal" ? 0 : "",
                        left: direction === "horizontal" ? "" : 0,
                        display: "flex",
                        flexDirection:
                            direction === "vertical" ? "column" : "row",
                        flexWrap: "nowrap",
                        width:
                            direction === "horizontal"
                                ? pxSize + "px"
                                : "calc(100% + 50px)",
                        height:
                            direction === "vertical" ? pxSize + "px" : "100%",
                    }}
                >
                    {dividers}
                </div>
                <div
                    style={{
                        position: "relative",
                        left: direction === "horizontal" ? 0 : "50px",
                        top: direction === "vertical" ? 0 : "50px",
                        display: "flex",
                        flexDirection:
                            direction === "vertical" ? "row" : "column",
                        flexWrap: "nowrap",
                        bottom: "0px",
                        right: "0px",
                        width:
                            direction === "horizontal"
                                ? `${parseInt(pxSize) + 60}px`
                                : "100%",
                        height:
                            direction === "vertical"
                                ? `${parseInt(pxSize) + 60}px`
                                : "80%",
                    }}
                >
                    <Timeline
                        ticker={
                            week
                                ? week.isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Sunday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                    <Timeline
                        ticker={
                            week
                                ? week.add(1, "days").isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Monday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                    <Timeline
                        ticker={
                            week
                                ? week.add(2, "days").isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Tuesday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                    <Timeline
                        ticker={
                            week
                                ? week.add(3, "days").isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Wednesday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                    <Timeline
                        ticker={
                            week
                                ? week.add(4, "days").isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Thursday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                    <Timeline
                        ticker={
                            week
                                ? week.add(5, "days").isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Friday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                    <Timeline
                        ticker={
                            week
                                ? week.add(6, "days").isSame(dayjs(), "day")
                                    ? true
                                    : false
                                : false
                        }
                        direction={direction}
                        type={type}
                        pxSize={pxSize + "px"}
                        label="Saturday"
                        views={views}
                        incrementDuration={incrementDuration}
                        updateView={updateView}
                        deleteEvent={deleteEvent}
                        acceptEvent={acceptEvent}
                    />
                </div>
            </div>
        </div>
    );
};

export default Schedule;
