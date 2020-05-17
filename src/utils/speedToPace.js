const speedToPace = (speed) => {
  if (speed < 0.1 || speed == undefined || speed == null) return "00:00";
  let kmH = Math.floor(3600 * speed);
  kmH = (kmH / 1000).toFixed(1);
  const secKm = Math.floor(3600 / kmH);
  const min = secKm / 60 > 1 ? Math.floor(secKm / 60) : 0;
  const sec = secKm % 60;
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

export { speedToPace };
