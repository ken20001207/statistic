import Year from "./Year";

export default class GameDatas {
  years: Array<Year>;
  constructor() {
    this.years = [];
  }

  getExistYears() {
    return this.years.map(year => year.date.year);
  }

  hasYear(year: number) {
    return this.getExistYears().includes(year);
  }
}
