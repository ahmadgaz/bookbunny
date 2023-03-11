export const getTime = (cur, incrementPxSize) => {
    const thirtyMinIncrementsMultiple = 30 / incrementPxSize;
    const numOfThirtyMinIncrements = cur * thirtyMinIncrementsMultiple;
    const hr = Math.floor(numOfThirtyMinIncrements / 60);
    const min = ((numOfThirtyMinIncrements / 30) % 2) * 30;
    return `${hr.toString().length <= 1 ? "0" + hr : hr}:${
        min <= 25 ? "00" : "30"
    }`;
    // hr: 00-23
    // min: 00-59
};

export const getPosAndSize = (cur, incrementPxSize, incrementDuration) => {
    if (cur === undefined) return { pos: 0, size: 0 };

    const { start_time, end_time } = cur;
    let start = String(start_time).match(/^(\d+):(\d+)$/);
    let end = String(end_time).match(/^(\d+):(\d+)$/);
    start = start === null ? ["00:00", "00", "00"] : start;
    end = end === null ? ["00:00", "00", "00"] : end;
    const startHours = parseInt(start[1], 10);
    const startMinutes = parseInt(start[2], 10);
    const endHours = parseInt(end[1], 10);
    const endMinutes = parseInt(end[2], 10);
    let pos = 0;
    let size = 0;
    // 5:56 - 7:23

    let iteration = 0;
    for (let i = 0; i < 60; i += parseInt(incrementDuration)) {
        if (
            startMinutes >= i &&
            startMinutes < i + parseInt(incrementDuration)
        ) {
            pos =
                incrementPxSize *
                ((60 / parseInt(incrementDuration)) * startHours + iteration);
        }
        iteration++;
    }

    iteration = 0;
    for (let i = 0; i < 60; i += parseInt(incrementDuration)) {
        if (endMinutes >= i && endMinutes < i + parseInt(incrementDuration)) {
            if (endMinutes === 59) {
                size =
                    incrementPxSize *
                        ((60 / parseInt(incrementDuration)) * endHours +
                            60 / parseInt(incrementDuration)) -
                    pos;
            } else {
                size =
                    incrementPxSize *
                        ((60 / parseInt(incrementDuration)) * endHours +
                            iteration) -
                    pos;
            }
        }
        iteration++;
    }

    if (size <= 0) {
        size = 0;
    }

    return { pos: pos, size: size };
};
