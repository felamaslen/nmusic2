export function leadingZeroes(number) {
    if (number < 10) {
        return `0${number}`;
    }

    return number.toString();
}

/**
 * format a number of seconds like 15:31 or 01:20:03
 */
export function formatSeconds(secs) {
    if (secs < 60) {
        return `00:${leadingZeroes(secs)}`;
    }

    const abbr = [1, 60, 3600, 86400];

    return abbr
        .reverse()
        .reduce((reduction, period) => {
            if (reduction.secs >= period) {
                const numThisPeriod = Math.floor(reduction.secs / period);

                const remaining = reduction.secs % period;

                reduction.secs = remaining;
                reduction.parts.push(numThisPeriod);
            }
            else if (reduction.parts.length > 0) {
                reduction.parts.push(0);
            }

            return reduction;
        }, { secs, parts: [] })
        .parts
        .map(part => leadingZeroes(part))
        .join(':');
}

