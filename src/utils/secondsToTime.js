const secondsToTime = (secondPassed) => {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  if (secondPassed < 60) {
    seconds = secondPassed;
  } else if (secondPassed < 3600) {
    seconds = secondPassed % 60;
    minutes = Math.floor(secondPassed / 60);
  } else {
    hours = Math.floor(secondPassed / 3600);
    let sec = secondPassed % 3600;
    if (sec > 59) {
      seconds = sec % 60;
      minutes = Math.floor(sec / 60);
    }
  }
  return [hours, minutes, seconds];
};

export { secondsToTime };
