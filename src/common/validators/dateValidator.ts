import { parse, isValid, isDate, isAfter, isBefore } from "date-fns";

export const validateTime = (time: string): boolean => {
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] [ap]m$/i;
  return timeRegex.test(time);
};

export const validateDate = (date: string): boolean => {
  const parsedDate = parse(date, "MM/dd/yyyy", new Date());
  const minDate = new Date(1000, 0, 1); // Set the minimum date to year 1000 AD
  const maxDate = new Date(9999, 11, 31); // Set the maximum date to year 9999 AD

  return (
    isDate(parsedDate) &&
    isValid(parsedDate) &&
    isAfter(parsedDate, minDate) &&
    isBefore(parsedDate, maxDate)
  );
};
