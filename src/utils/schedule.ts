type Thunk = () => void;

const legacySchedule = (callback: Thunk) => setTimeout(callback, 0);
const rafSchedule = (callback: Thunk) => requestAnimationFrame(callback);
const queueSchedule = (callback: Thunk) => queueMicrotask(callback);

export const schedule = typeof requestAnimationFrame === "function" ? rafSchedule : legacySchedule;
export const microSchedule = typeof queueMicrotask === "function" ? queueSchedule : schedule;
