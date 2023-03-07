import { Box, Snackbar, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import NavbarSpacer from "components/NavbarSpacer";
import Account from "./Account";
import Calendar from "./Calendar";
import Help from "./Help";
import Navbar from "./navbar";
import View from "./View";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "state";

const Dashboard = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [tab, setTab] = useState(1);
    const dispatch = useDispatch();
    const snackbars = useSelector((state) => state.snackbars);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: "x",
        draggable: false,
    });

    const handleTabChange = (event, newValue) => {
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

    return (
        <Box width="100vw" height="100vh" sx={{ touchAction: "pan-y" }}>
            <Navbar tab={tab} handleTabChange={handleTabChange} />
            <div
                className="embla"
                ref={emblaRef}
                style={{
                    overflowX: "hidden",
                    height: "100%",
                    touchAction: "pan-y",
                }}
            >
                <div
                    className="embla__container"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "100%",
                        touchAction: "pan-y",
                    }}
                >
                    <div
                        className="embla__slide"
                        key="0"
                        style={{
                            overflowY: "auto",
                            paddingTop: "70px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            minWidth: 0,
                            touchAction: "pan-y",
                        }}
                    >
                        <View />
                    </div>
                    <div
                        className="embla__slide"
                        key="1"
                        style={{
                            overflowY: "auto",
                            paddingTop: "70px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            touchAction: "pan-y",
                            minWidth: 0,
                        }}
                    >
                        <Calendar />
                    </div>
                    <div
                        className="embla__slide"
                        key="2"
                        style={{
                            overflowY: "auto",
                            paddingTop: "70px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            touchAction: "pan-y",
                            minWidth: 0,
                        }}
                    >
                        <Help />
                    </div>
                    <div
                        className="embla__slide"
                        key="3"
                        style={{
                            overflowY: "auto",
                            paddingTop: "70px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            touchAction: "pan-y",
                            minWidth: 0,
                        }}
                    >
                        <Account />
                    </div>
                </div>
            </div>
            <Snackbar
                open={snackbars.eventTypeCopied}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(
                        hideSnackbar({
                            snackbar: "eventTypeCopied",
                        })
                    );
                }}
                message="Link copied!"
            />
            <Snackbar
                open={snackbars.eventTypeDeleted}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(
                        hideSnackbar({
                            snackbar: "eventTypeDeleted",
                        })
                    );
                }}
                message="Event type deleted!"
                // action={} undo
            />
            <Snackbar
                open={snackbars.eventTypeEdited}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(
                        hideSnackbar({
                            snackbar: "eventTypeEdited",
                        })
                    );
                }}
                message="Event type saved!"
                // action={} undo
            />
            <Snackbar
                open={snackbars.eventTypeAdded}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(
                        hideSnackbar({
                            snackbar: "eventTypeAdded",
                        })
                    );
                }}
                message="Event type added!"
            />

            <Snackbar
                open={snackbars.viewDeleted}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(
                        hideSnackbar({
                            snackbar: "viewDeleted",
                        })
                    );
                }}
                message="View deleted!"
                // action={} undo
            />
            <Snackbar
                open={snackbars.viewEdited}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(
                        hideSnackbar({
                            snackbar: "viewEdited",
                        })
                    );
                }}
                message="View saved!"
                // action={} undo
            />
            <Snackbar
                open={snackbars.viewAdded}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(hideSnackbar({ snackbar: "viewAdded" }));
                }}
                message="View added!"
            />
            <Snackbar
                open={snackbars.eventAccepted}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(hideSnackbar({ snackbar: "eventAccepted" }));
                }}
                message="Event accepted!"
            />
            <Snackbar
                open={snackbars.eventDenied}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(hideSnackbar({ snackbar: "eventDenied" }));
                }}
                message="Event denied."
            />
            <Snackbar
                open={snackbars.eventCanceled}
                autoHideDuration={4000}
                onClose={() => {
                    dispatch(hideSnackbar({ snackbar: "eventCanceled" }));
                }}
                message="Event canceled."
            />
        </Box>
    );
};

export default Dashboard;
