import { DayDate } from "../classes/types";

export default function getDaysCount(dayA: DayDate, dayB: DayDate) {
  var days = 0;
  if (dayB.month === dayA.month) {
    days += dayB.date - dayA.date;
  } else {
    days += dayB.date;
    days += dayA.date;
  }
  if (dayB.year === dayA.year) {
    days += (dayB.month - dayA.month) * 31;
  } else {
    days += dayB.month * 30;
    days += dayA.month * 30;
  }
  return days;
}
