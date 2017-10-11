export function handleNaN(value, defaultValue = 0) {
    if (isNaN(value) || typeof value === 'undefined') {
        return defaultValue;
    }

    return value;
}

