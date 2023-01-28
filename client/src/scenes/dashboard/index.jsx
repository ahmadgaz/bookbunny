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

    return (
        <Box width="100%" height={isNonMobileScreens ? "100vh" : "90vh"}>
            <Navbar tab={tab} handleTabChange={handleTabChange} />
            {isNonMobileScreens && <NavbarSpacer />}
            <div
                className="embla"
                ref={emblaRef}
                style={{
                    overflowY: isNonMobileScreens ? "" : "hidden",
                    overflowX: isNonMobileScreens ? "hidden" : "",
                    height: isNonMobileScreens ? "calc(100% - 64px)" : "100%",
                }}
            >
                <div
                    className="embla__container"
                    style={{
                        display: "flex",
                        flexDirection: isNonMobileScreens ? "row" : "column",
                        height: isNonMobileScreens ? "100%" : "90vh",
                    }}
                >
                    <div
                        className="embla__slide"
                        key="0"
                        style={{
                            flex: isNonMobileScreens ? "0 0 100%" : "0 0 90vh",
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
                            flex: isNonMobileScreens ? "0 0 100%" : "0 0 90vh",
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
                            flex: isNonMobileScreens ? "0 0 100%" : "0 0 90vh",
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
                            flex: isNonMobileScreens ? "0 0 100%" : "0 0 90vh",
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
