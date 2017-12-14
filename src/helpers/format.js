export function leadingZeroes(number) {
    if (number < 10) {
        return `0${number}`;
    }

    return number.toString();
}

/**
 * format a number of seconds like 15:31 or 01:20:03
 */
export function formatSeconds(seconds) {
    if (seconds < 60) {
        return `00:${leadingZeroes(seconds)}`;
    }

    const abbr = [1, 60, 3600, 86400];

    return abbr
        .reverse()
        .reduce(({ secs, parts }, period) => {
            if (secs >= period) {
                const numThisPeriod = Math.floor(secs / period);

                const remaining = secs % period;

                return {
                    secs: remaining,
                    parts: [...parts, numThisPeriod]
                };
            }

            if (parts.length > 0) {
                return { secs, parts: [...parts, 0] };
            }

            return { secs, parts };

        }, { secs: seconds, parts: [] })
        .parts
        .map(part => leadingZeroes(part))
        .join(':');
}

