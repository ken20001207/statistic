import Game from "../../classes/Game";
import axios from "axios";

export default function getCarHistoryByDay(year: number, month: number, date: number, addCountFunction: () => void = () => null) {
    return new Promise<Array<Game>>(async (resolve, reject) => {
        try {
            axios
                .get("https://988kjw.com/inc/get.asp?lt=vrpk10a&tt=lotteryList&dt=" + year + "-" + month + "-" + date)
                .then(async (response) => {
                    addCountFunction();
                    resolve(await parseGameArray(response.data));
                    return null;
                });
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

function parseGameArray(data: Array<originGameData>) {
    return new Promise<Array<Game>>((resolve, reject) => {
        try {
            var Games: Array<Game> = [];
            data.map((origame) => {
                var d = {
                    year: +origame.issue.toString().substr(0, 4),
                    month: +origame.issue.toString().substr(4, 2),
                    date: +origame.issue.toString().substr(6, 2),
                };
                Games.push(new Game(d, origame.issue, origame.openNum));
                return null;
            });
            Games.sort((gameA, gameB) => gameA.period - gameB.period);
            resolve(Games);
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
