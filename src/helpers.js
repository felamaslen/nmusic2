export function handleNaN(value, defaultValue = 0) {
    if (isNaN(value) || typeof value === 'undefined') {
        return defaultValue;
    }

    return value;
}

export function drawLinearVisualiser(ctx, width, height, data) {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(0, height);

    if (data && data.length) {
        const sliceWidth = width / data.length;

        data.forEach((point, key) => {
            const xPix = sliceWidth * key;
            const yPix = height * (1 - point / 256);

            if (key === 0) {
                ctx.moveTo(xPix, yPix);
            }
            else {
                ctx.lineTo(xPix, yPix);
            }
        });
    }

    ctx.lineTo(width, height);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'orange';
    ctx.stroke();
}

