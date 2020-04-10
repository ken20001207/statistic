import Month from "./Month";
import { YearDate } from "./types";

export default class Year {
  date: YearDate;
  monthes: Array<Month>;

  constructor(date: YearDate) {
    this.date = { year: date.year };
    this.monthes = [];
  }

  getExistMonthes() {
    return this.monthes.map(month => month.date.month);
  }

  hasMonth(month: number) {
    return this.getExistMonthes().indexOf(month) !== -1;
  }
}
