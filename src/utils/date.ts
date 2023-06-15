export function getCurrentDate() {
  return new Date();
}

export function parseTime(
  timeString: string,
  presentDateString: string
): Date | undefined {
  const presentDate = new Date(presentDateString);
  if (isNaN(presentDate.getTime())) {
    return undefined;
  }

  const timeComponents = timeString.split(" ");
  if (timeComponents.length !== 2) {
    return undefined;
  }

  const [hourString, minuteString] = timeComponents[0].split(":");
  let hour = parseInt(hourString, 10);
  const minute = parseInt(minuteString, 10);
  if (isNaN(hour) || isNaN(minute)) {
    return undefined;
  }

  const meridian = timeComponents[1].toLowerCase();
  if (meridian !== "am" && meridian !== "pm") {
    return undefined;
  }

  if (meridian === "pm") {
    hour += 12;
  }

  const date = presentDate.getDate();
  const month = presentDate.getMonth();
  const year = presentDate.getFullYear();

  return new Date(year, month, date, hour, minute);
}
