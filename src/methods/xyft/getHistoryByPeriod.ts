import GameDatas from "../../classes/GameDatas";
import sameDay from "../utils/sameDay";
import getHistoryByDay from "./getHistoryByDay";
import Year from "../../classes/Year";
import Day from "../../classes/Day";
import Month from "../../classes/Month";
import { DayDate } from "../../classes/types";
import Game from "../../classes/Game";

export default function get_XYFT_HistoryByPeriod(
    from: DayDate,
    to: DayDate,
    oriGameDatas: GameDatas = new GameDatas(),
    addCountFunction: () => void = () => null
) {
    return new Promise<GameDatas>(async (resolve, reject) => {
        try {
            var datep = new Date();
            var dateend = new Date();
            datep.setFullYear(from.year, from.month - 1, from.date);
            dateend.setFullYear(to.year, to.month - 1, to.date);
            dateend.setDate(dateend.getDate() + 1);
            var promises = [];
            while (!sameDay(datep, dateend)) {
                promises.push(
                    await getHistoryByDay(datep.getFullYear(), datep.getMonth() + 1, datep.getDate(), addCountFunction).then((games) =>
                        putGamesIntoGameDatas(oriGameDatas, games)
                    )
                );
                datep.setDate(datep.getDate() + 1);
            }
            Promise.all(promises).then(() => resolve(oriGameDatas));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

function putGamesIntoGameDatas(gamedatas: GameDatas, games: Array<Game>) {
    games.map((game) => {
        /** 確保對應的日期已經存在 */
        if (!gamedatas.hasYear(game.date.year)) {
            gamedatas.years.push(new Year(game.date));
        }
        var thisYear = gamedatas.years.find((year) => year.date.year === game.date.year);
        if (thisYear === undefined) return null;
        if (!thisYear.hasMonth(game.date.month)) {
            thisYear.monthes.push(new Month(game.date));
        }
        var thisMonth = thisYear.monthes.find((month) => month.date.month === game.date.month);
        if (thisMonth === undefined) return null;
        if (!thisMonth.hasDay(game.date.date)) {
            thisMonth.days.push(new Day(game.date));
        }
        var thisDay = thisMonth.days.find((day) => day.date.date === game.date.date);
        if (thisDay === undefined) return null;

        /** 存入該期數據 */
        thisDay.games.push(game);
        return null;
    });
}
