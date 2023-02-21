import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import NavbarSpacer from "components/NavbarSpacer";
import Account from "./Account";
import Calendar from "./Calendar";
import Help from "./Help";
import Navbar from "./navbar";
import View from "./View";

const Dashboard = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [tab, setTab] = useState(1);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: isNonMobileScreens ? "x" : "y",
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

    return isNonMobileScreens ? (
        <Box width="100vw" height="100vh">
            <Navbar tab={tab} handleTabChange={handleTabChange} />
            <div
                className="embla"
                ref={emblaRef}
                style={{
                    overflowX: "hidden",
                    height: "100%",
                }}
            >
                <div
                    className="embla__container"
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
                            marginTop: "90px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            minWidth: 0,
                        }}
                    >
                        <View />
                    </div>
                    <div
                        className="embla__slide"
                        key="1"
                        style={{
                            marginTop: "90px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            minWidth: 0,
                        }}
                    >
                        <Calendar />
                    </div>
                    <div
                        className="embla__slide"
                        key="2"
                        style={{
                            marginTop: "90px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            minWidth: 0,
                        }}
                    >
                        <Help />
                    </div>
                    <div
                        className="embla__slide"
                        key="3"
                        style={{
                            marginTop: "90px",
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            minWidth: 0,
                        }}
                    >
                        <Account />
                    </div>
                </div>
            </div>
        </Box>
    ) : (
        <Box width="100vw" height="100vh">
            <Navbar tab={tab} handleTabChange={handleTabChange} />
            <div
                className="embla"
                ref={emblaRef}
                style={{
                    overflowY: "hidden",
                    height: "100%",
                }}
            >
                <div
                    className="embla__container"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "90vh",
                    }}
                >
                    <div
                        className="embla__slide"
                        key="0"
                        style={{
                            flex: "0 0 90vh",
                            minWidth: 0,
                        }}
                    >
                        <Typography variant="h1">View</Typography>
                        <View />
                    </div>
                    <div
                        className="embla__slide"
                        key="1"
                        style={{
                            flex: "0 0 90vh",
                            minWidth: 0,
                        }}
                    >
                        <Typography variant="h1">Calendar</Typography>
                        <Calendar />
                    </div>
                    <div
                        className="embla__slide"
                        key="2"
                        style={{
                            flex: "0 0 90vh",
                            minWidth: 0,
                        }}
                    >
                        <Typography variant="h1">Account</Typography>
                        <Account />
                    </div>
                    <div
                        className="embla__slide"
                        key="3"
                        style={{
                            flex: "0 0 90vh",
                            minWidth: 0,
                        }}
                    >
                        <Typography variant="h1">Help</Typography>
                        <Help />
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default Dashboard;
