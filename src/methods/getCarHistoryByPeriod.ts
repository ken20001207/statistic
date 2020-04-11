import GameDatas from "../classes/GameDatas";
import sameDay from "./sameDay";
import getCarHistoryByDay from "./getCarHistoryByDay";
import Year from "../classes/Year";
import Day from "../classes/Day";
import Month from "../classes/Month";
import { DayDate } from "../classes/types";

export default function getCarHistoryByPeriod(
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
                    await getCarHistoryByDay(datep.getFullYear(), datep.getMonth() + 1, datep.getDate(), addCountFunction).then((day) =>
                        putDayIntoGameDatas(oriGameDatas, day)
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

function putDayIntoGameDatas(gamedatas: GameDatas, day: Day) {
    if (!gamedatas.hasYear(day.date.year)) {
        gamedatas.years.push(new Year(day.date));
    }
    var thisYear = gamedatas.years.find((year) => year.date.year === day.date.year);
    if (thisYear === undefined) return;
    if (!thisYear.hasMonth(day.date.month)) {
        thisYear.monthes.push(new Month(day.date));
    }
    var thisMonth = thisYear.monthes.find((month) => month.date.month === day.date.month);
    if (thisMonth === undefined) return;
    if (!thisMonth.hasDay(day.date.date)) {
        thisMonth.days.push(day);
    }
}
