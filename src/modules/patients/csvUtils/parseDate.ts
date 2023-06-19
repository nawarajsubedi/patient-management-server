export function parseDate(dateString: string): Date | undefined {
  const dateComponents = dateString.split("/");
  if (dateComponents.length !== 3) {
    return undefined;
  }

  const month = parseInt(dateComponents[0], 10) - 1;
  const day = parseInt(dateComponents[1], 10); // month is 0-based in Date constructor
  const year = parseInt(dateComponents[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return undefined;
  }

  return new Date(year, month, day);
}

export function parseDateDod(dateString: string): Date | undefined {
  const dateComponents = dateString.split("/");
  if (dateComponents.length !== 3) {
    return undefined;
  }

  const day = parseInt(dateComponents[0], 10);
  const month = parseInt(dateComponents[1], 10) - 1; // month is 0-based in Date constructor
  const year = parseInt(dateComponents[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return undefined;
  }

  return new Date(year, month, day);
}
