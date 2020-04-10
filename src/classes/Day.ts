import Game from "./Game";
import { DayDate } from "./types";

export default class Day {
  date: DayDate;
  games: Array<Game>;

  constructor(date: DayDate) {
    this.date = date;
    this.games = [];
  }

  getExistGames() {
    return this.games.map(game => game.period);
  }

  hasGame(gameid: number) {
    return this.getExistGames().includes(gameid);
  }
}
