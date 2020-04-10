import Day from "../classes/Day";
import Game from "../classes/Game";
import { DayDate } from "../classes/types";
import axios from "axios";

export default function getCarHistoryByDay(year: number, month: number, date: number, addCountFunction: () => void = () => null) {
  return new Promise<Day>(async (resolve, reject) => {
    try {
      axios.get("https://988kjw.com/inc/get.asp?lt=vrpk10a&tt=lotteryList&dt=" + year + "-" + month + "-" + date).then(async response => {
        addCountFunction();
        resolve(
          await parseDayObject(response.data, {
            year: year,
            month: month,
            date: date
          })
        );
        return null;
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

function parseDayObject(data: Array<originGameData>, date: DayDate) {
  return new Promise<Day>((resolve, reject) => {
    try {
      var day = new Day(date);
      data.map(origame => {
        day.games.push(new Game(date, origame.issue, origame.openNum));
        return null;
      });
      day.games.sort((gameA, gameB) => gameA.period - gameB.period);
      resolve(day);
    } catch (err) {
      reject(err);
    }
  });
}

interface originGameData {
  openDateTime: string;
  issue: number;
  openNum: Array<number>;
  sumArr: Array<number>;
  dtArr: Array<number>;
  mimcryArr: any;
  formArr: any;
  sumStrArr: any;
}
