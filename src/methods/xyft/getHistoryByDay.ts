import Game from "../../classes/Game";
import axios from "axios";

export default function getHistoryByDay(year: number, month: number, date: number, addCountFunction: () => void = () => null) {
    return new Promise<Array<Game>>(async (resolve, reject) => {
        try {
            axios
                .get("https://www.1396r.com/xyft/kaijiang?date=" + year + "-" + month + "-" + date, {
                    headers: {
                        a: "b",
                    },
                })
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

function parseGameArray(data: string) {
    return new Promise<Array<Game>>((resolve, reject) => {
        try {
            var Games: Array<Game> = [];
            var lines = data.split("\n");
            var d = {
                year: 0,
                month: 0,
                date: 0,
            };
            var period = 0;
            var result = new Array<number>();
            lines.map((line) => {
                if (line.includes('<td><i class="font_gray666">')) {
                    // line = <td><i class="font_gray666">20200417-123</i>&nbsp;&nbsp;<i class="font_gray999">23:19</i></td>
                    d.year = +line.split("-")[0].split(">")[2].substr(0, 4);
                    d.month = +line.split("-")[0].split(">")[2].substr(4, 2);
                    d.date = +line.split("-")[0].split(">")[2].substr(6, 2);
                    period = +line.split("-")[1].split("<")[0];
                } else if (line.includes("data-number=")) {
                    result.push(+line.split(">")[1].split("<")[0]);
                    if (result.length === 10) {
                        Games.push(new Game(d, period, result));
                        result = [];
                    }
                }
                return null;
            });
            Games.sort((gameA, gameB) => gameA.period - gameB.period);
            resolve(Games);
        } catch (err) {
            reject(err);
        }
    });
}
