const convertDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const h = date.getHours();
  const m = date.getMinutes();

  return `${date.toLocaleDateString(
    "en-US",
    options
  )} at ${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`; // Saturday, September 17, 2016
};

export { convertDate };
