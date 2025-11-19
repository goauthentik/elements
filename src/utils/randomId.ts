// I solmenly swear that I will not use this function for security-critical ids.
export function randomId(length = 8) {
    let dt = new Date().getTime();
    return "x".repeat(length).replace(/x/g, (c) => {
        // eslint-disable-next-line sonarjs/pseudo-random
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}
