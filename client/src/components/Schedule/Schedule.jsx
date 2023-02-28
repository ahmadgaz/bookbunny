import Timeline from "./Timeline";

const Schedule = (props) => {
    /* FORMAT
    view => [{view_color: "", view_schedule: [{
       sunday: [{start_time: "00:00", end_time: "00:00"}]
       ...
       saturday: ...
    }]}]
    */

    const {
        direction,
        type,
        pxSize,
        views = [],
        incrementSize = 30,
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
                        direction === "horizontal" ? "0.5px solid #bbb" : "",
                    borderTop:
                        direction === "vertical" ? "0.5px solid #bbb" : "",
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
                        fontSize: "0.5em",
                        color: "#bbb",
                    }}
                >
                    {i === 0 ? "12" : i > 12 ? `${i - 12}` : `${i}`}
                    <br />
                    {i === 0 ? "AM" : i >= 12 ? `PM` : `AM`}
                </h6>
            </div>
        );
    }
    return (
        <div
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
                touchAction: "none",
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
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: direction === "vertical" ? "column" : "row",
                    flexWrap: "nowrap",
                    width: direction === "horizontal" ? pxSize + "px" : "100%",
                    height: direction === "vertical" ? pxSize + "px" : "100%",
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
                    flexDirection: direction === "vertical" ? "row" : "column",
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
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Sunday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
                <Timeline
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Monday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
                <Timeline
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Tuesday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
                <Timeline
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Wednesday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
                <Timeline
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Thursday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
                <Timeline
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Friday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
                <Timeline
                    direction={direction}
                    type={type}
                    pxSize={pxSize + "px"}
                    label="Saturday"
                    views={views}
                    incrementSize={incrementSize}
                    updateView={updateView}
                    deleteEvent={deleteEvent}
                    acceptEvent={acceptEvent}
                />
            </div>
        </div>
    );
};

export default Schedule;
