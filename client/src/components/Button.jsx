import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { tokens } from "theme";

const Text = (props) => {
    const { translation, height, italicized, children } = props;

    return children.split("").map((letter, idx) => (
        <p
            key={idx}
            style={{
                margin: 0,
                whiteSpace: "pre",
                height: height,
                lineHeight: parseInt(height) + 2 + "px",
                textAlign: "center",
                transform: translation,
                transition: `transform ${(idx / 5 + 1) * 200}ms ease`,
            }}
        >
            {italicized ? <i>{letter}</i> : letter}
        </p>
    ));
};

const Button = (props) => {
    const colors = tokens("light");
    const {
        italicized = false,
        size = "s",
        variant = "text",
        onClick = () => {},
        rounded,
        style = {},
        children,
    } = props;
    const [translation, setTranslation] = useState("");
    const [containedAnimation, setContainedAnimation] = useState("-2px");
    const nonContainedHeight =
        size === "s"
            ? "20px"
            : size === "m"
            ? "40px"
            : size === "l"
            ? "60px"
            : "20px";
    const containedHeight =
        size === "s"
            ? "35px"
            : size === "m"
            ? "60px"
            : size === "l"
            ? "90px"
            : "30px";
    const height =
        variant !== "contained" ? nonContainedHeight : containedHeight;

    return variant === "contained" ? (
        <div style={{ position: "relative", width: "fit-content" }}>
            {/* Shadow */}
            <Typography
                variant={
                    size === "s"
                        ? "h6"
                        : size === "m"
                        ? "h4"
                        : size === "l"
                        ? "h1"
                        : "button"
                }
                style={{
                    border: `${colors.borderSize} solid ${colors.neutralDark[500]}`,
                    borderRadius: rounded
                        ? `${parseInt(height) / 2}px`
                        : colors.borderRadius,
                    backgroundColor: colors.neutralDark[500],
                    padding: "0 15px",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    zIndex: "-1",
                    ...style,
                }}
            >
                <div
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        height: height,
                        overflow: "hidden",
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
                            margin: 0,
                            display: "flex",
                            flexWrap: "nowrap",
                            height: height,
                        }}
                    >
                        <Text
                            translation={translation}
                            height={height}
                            italicized={italicized}
                        >
                            {children}
                        </Text>
                    </div>
                    <div
                        style={{
                            margin: 0,
                            display: "flex",
                            flexWrap: "nowrap",
                            height: height,
                        }}
                    >
                        <Text
                            translation={translation}
                            height={height}
                            italicized={italicized}
                        >
                            {children}
                        </Text>
                    </div>
                    <div
                        style={{
                            margin: 0,
                            display: "flex",
                            flexWrap: "nowrap",
                            height: height,
                        }}
                    >
                        <Text
                            translation={translation}
                            height={height}
                            italicized={italicized}
                        >
                            {children}
                        </Text>
                    </div>
                </div>
                {variant === "outlined" && (
                    <div
                        style={{
                            width: "calc(100% + 2px)",
                            height: colors.borderSize,
                            borderRadius: "0.5px",
                            backgroundColor: colors.neutralDark[500],
                        }}
                    ></div>
                )}
            </Typography>
            {/* Button */}
            <Typography
                onMouseEnter={() => {
                    setContainedAnimation("-1px");
                    setTranslation("translateY(-100%)");
                }}
                onMouseLeave={() => {
                    setContainedAnimation("-2px");
                    setTranslation("");
                }}
                onMouseDown={() => {
                    setContainedAnimation("0px");
                    setTranslation("translateY(-200%)");
                }}
                onMouseUp={() => {
                    setContainedAnimation("-1px");
                    setTranslation("translateY(-100%)");
                    onClick();
                }}
                variant={
                    size === "s"
                        ? "h6"
                        : size === "m"
                        ? "h4"
                        : size === "l"
                        ? "h1"
                        : "button"
                }
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: containedAnimation,
                    left: containedAnimation,
                    border: `${colors.borderSize} solid ${colors.neutralDark[500]}`,
                    borderRadius: rounded
                        ? `${parseInt(height) / 2}px`
                        : colors.borderRadius,
                    backgroundColor: colors.primary[500],
                    padding: "0 15px",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    transition: `top 75ms ease, left 75ms ease`,
                    ...style,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        height: height,
                        overflow: "hidden",
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
                            margin: 0,
                            display: "flex",
                            flexWrap: "nowrap",
                            height: height,
                        }}
                    >
                        <Text
                            translation={translation}
                            height={height}
                            italicized={italicized}
                        >
                            {children}
                        </Text>
                    </div>
                    <div
                        style={{
                            margin: 0,
                            display: "flex",
                            flexWrap: "nowrap",
                            height: height,
                        }}
                    >
                        <Text
                            translation={translation}
                            height={height}
                            italicized={italicized}
                        >
                            {children}
                        </Text>
                    </div>
                    <div
                        style={{
                            margin: 0,
                            display: "flex",
                            flexWrap: "nowrap",
                            height: height,
                        }}
                    >
                        <Text
                            translation={translation}
                            height={height}
                            italicized={italicized}
                        >
                            {children}
                        </Text>
                    </div>
                </div>
                {variant === "outlined" && (
                    <div
                        style={{
                            width: "calc(100% + 2px)",
                            height: colors.borderSize,
                            borderRadius: "0.5px",
                            backgroundColor: colors.neutralDark[500],
                        }}
                    ></div>
                )}
            </Typography>
        </div>
    ) : (
        <Typography
            variant={
                size === "s"
                    ? "h6"
                    : size === "m"
                    ? "h4"
                    : size === "l"
                    ? "h1"
                    : "button"
            }
            style={{
                width: "fit-content",
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                alignItems: "center",
                ...style,
            }}
        >
            <div
                onMouseEnter={() => {
                    setTranslation("translateY(-100%)");
                }}
                onMouseLeave={() => {
                    setTranslation("");
                }}
                onMouseDown={() => {
                    setTranslation("translateY(-200%)");
                }}
                onMouseUp={() => {
                    setTranslation("translateY(-100%)");
                    onClick();
                }}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    height: height,
                    overflow: "hidden",
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
                        margin: 0,
                        display: "flex",
                        flexWrap: "nowrap",
                        height: height,
                    }}
                >
                    <Text
                        translation={translation}
                        height={height}
                        italicized={italicized}
                    >
                        {children}
                    </Text>
                </div>
                <div
                    style={{
                        margin: 0,
                        display: "flex",
                        flexWrap: "nowrap",
                        height: height,
                    }}
                >
                    <Text
                        translation={translation}
                        height={height}
                        italicized={italicized}
                    >
                        {children}
                    </Text>
                </div>
                <div
                    style={{
                        margin: 0,
                        display: "flex",
                        flexWrap: "nowrap",
                        height: height,
                    }}
                >
                    <Text
                        translation={translation}
                        height={height}
                        italicized={italicized}
                    >
                        {children}
                    </Text>
                </div>
            </div>
            {variant === "outlined" && (
                <div
                    style={{
                        width: "calc(100% + 2px)",
                        height: colors.borderSize,
                        borderRadius: "0.5px",
                        backgroundColor: colors.neutralDark[500],
                    }}
                ></div>
            )}
        </Typography>
    );
};

export default Button;
