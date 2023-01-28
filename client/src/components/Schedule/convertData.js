export const getTime = (cur, thirtyMinSize) => {
    const thirtyMinIncrementsMultiple = 30 / thirtyMinSize;
    const numOfThirtyMinIncrements = cur * thirtyMinIncrementsMultiple;
    const hr = Math.floor(numOfThirtyMinIncrements / 60);
    const min = ((numOfThirtyMinIncrements / 30) % 2) * 30;
    return `${hr.toString().length <= 1 ? "0" + hr : hr}:${
        min <= 25 ? "00" : "30"
    }`;
    // hr: 00-23
    // min: 00-59
};

export const getPosAndSize = (cur, thirtyMinSize, incrementSize) => {
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
    for (let i = 0; i < 60; i += parseInt(incrementSize)) {
        if (startMinutes >= i && startMinutes < i + parseInt(incrementSize)) {
            pos =
                thirtyMinSize *
                ((60 / parseInt(incrementSize)) * startHours + iteration);
        }
        iteration++;
    }

    iteration = 0;
    for (let i = 0; i < 60; i += parseInt(incrementSize)) {
        if (endMinutes >= i && endMinutes < i + parseInt(incrementSize)) {
            if (endMinutes === 59) {
                size =
                    thirtyMinSize *
                        ((60 / parseInt(incrementSize)) * endHours +
                            60 / parseInt(incrementSize)) -
                    pos;
            } else {
                size =
                    thirtyMinSize *
                        ((60 / parseInt(incrementSize)) * endHours +
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
