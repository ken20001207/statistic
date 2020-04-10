import { DayDate } from "./types";

export default class Game {
  date: DayDate;
  period: number;
  result: Array<number>;

  constructor(date: DayDate, period: number, result: Array<number>) {
    this.date = date;
    this.period = period;
    this.result = result;
  }
}
