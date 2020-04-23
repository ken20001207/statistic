import { DayDate } from "../../classes/types";

export default function dateCompare(dateA: DayDate, dateB: DayDate) {
    if (dateA.year > dateB.year) return 1;
    if (dateA.year < dateB.year) return -1;
    if (dateA.month > dateB.month) return 1;
    if (dateA.month < dateB.month) return -1;
    if (dateA.date > dateB.date) return 1;
    if (dateA.date < dateB.date) return -1;
    return 0;
}
