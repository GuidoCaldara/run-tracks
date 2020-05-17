import { secondsToTime } from "./secondsToTime";
const prettyPrintDuration = (duration) => {
  if (duration === Infinity) return false;

  const timeArray = secondsToTime(duration);
  let time;
  if (timeArray[0] === 0) {
    return `${timeArray[1]
      .toString()
      .padStart(2, "0")}:${timeArray[2].toString().padStart(2, "0")}`;
  } else {
    return `${timeArray[0]}:${timeArray[1]
      .toString()
      .padStart(2, "0")}:${timeArray[2].toString().padStart(2, "0")}`;
  }
  return "";
};

const prettyPrintDurationWithUnits = (duration) => {
  const durationArray = prettyPrintDuration(duration).split(":");
  const units = ["h", "m", "s"];
  return durationArray.map((n, i) => {
    if (durationArray.length > 2) {
      return n + units[i] + " ";
    } else {
      return n + units[i + 1] + " ";
    }
  });
};

export { prettyPrintDuration, prettyPrintDurationWithUnits };
