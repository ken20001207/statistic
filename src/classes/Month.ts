import Day from "./Day";
import { MonthDate } from "./types";

export default class Month {
  date: MonthDate;
  days: Array<Day>;

  constructor(date: MonthDate) {
    this.date = { year: date.year, month: date.month };
    this.days = [];
  }

  getExistDays() {
    return this.days.map(day => day.date.date);
  }

  hasDay(date: number) {
    return this.getExistDays().indexOf(date) !== -1;
  }
}
