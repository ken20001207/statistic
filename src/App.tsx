import React from "react";
import "./App.css";
import { displaygame, DayDate } from "./classes/types";
import GameDatas from "./classes/GameDatas";
import dateCompare from "./methods/utils/dateCompare";
import { Button, Row, Tooltip, Breadcrumb, Message, Dropdown, Modal, Alert } from "rsuite";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";
import getCarHistoryByPeriod from "./methods/vrpk10a/getHistoryByPeriod";
import getDaysCount from "./methods/utils/getDaysCount";

import "rsuite/dist/styles/rsuite-default.css";
import Download from "./pages/Download";
import get_XYFT_HistoryByPeriod from "./methods/xyft/getHistoryByPeriod";

interface AppStates {
    data: Array<displaygame>;
    no: number;
    from: number;
    to: number;
    fromdate: string;
    todate: string;
    description: JSX.Element[];
    gamedatas: GameDatas;
    downloaded: number;
    needtodownload: number;
    downloadfrom: string;
    downloadto: string;
    selectedNumber: number; // 選擇要查看明細的號碼
}

export default class App extends React.Component<{}, AppStates> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            no: 1,
            data: [],
            from: 0,
            to: 1,
            fromdate: "2020-4-1",
            todate: "2020-4-8",
            description: [],
            gamedatas: new GameDatas(),
            downloaded: -1,
            needtodownload: 0,
            downloadfrom: "2020-4-7",
            downloadto: "2020-4-8",
            selectedNumber: -1,
        };
        this.downloadGameData = this.downloadGameData.bind(this);
        this.handleRangeSelect = this.handleRangeSelect.bind(this);
        this.addDownloadedCOunt = this.addDownloadedCOunt.bind(this);
        this.composeDisplayData = this.composeDisplayData.bind(this);
    }

    addDownloadedCOunt() {
        this.setState({ downloaded: this.state.downloaded + 1 });
    }

    async downloadGameData(dayA: DayDate, dayB: DayDate, game: "幸運飛艇" | "VR賽車") {
        // 清空原數據
        this.setState({ data: [] });

        // 初始化進度條
        this.setState({ needtodownload: getDaysCount(dayA, dayB) + 1 });

        // 下載資料
        var data;
        if (game === "幸運飛艇") {
            data = await get_XYFT_HistoryByPeriod(dayA, dayB, new GameDatas(), this.addDownloadedCOunt);
        } else if (game === "VR賽車") {
            data = await getCarHistoryByPeriod(dayA, dayB, new GameDatas(), this.addDownloadedCOunt);
        }

        // 存入資料
        if (data !== undefined) {
            data.years.sort((yearA, yearB) => yearA.date.year - yearB.date.year);
            data.years.map((year) => {
                year.monthes.sort((monthA, monthB) => monthA.date.month - monthB.date.month);
                return null;
            });
            data.years.map((year) => {
                year.monthes.map((montn) => {
                    montn.days.sort((dayA, dayB) => dayA.date.date - dayB.date.date);
                    return null;
                });
                return null;
            });
            var firstgame = data.years[0].monthes[0].days[0].games[0];
            var lastgame =
                data.years[data.years.length - 1].monthes[data.years[data.years.length - 1].monthes.length - 1].days[
                    data.years[data.years.length - 1].monthes[data.years[data.years.length - 1].monthes.length - 1].days.length - 1
                ].games[
                    data.years[data.years.length - 1].monthes[data.years[data.years.length - 1].monthes.length - 1].days[
                        data.years[data.years.length - 1].monthes[data.years[data.years.length - 1].monthes.length - 1].days.length - 1
                    ].games.length - 1
                ];
            this.setState({
                gamedatas: data,
                needtodownload: 0,
                downloaded: 0,
                fromdate: firstgame.date.year + "-" + firstgame.date.month + "-" + firstgame.date.date,
                todate: lastgame.date.year + "-" + lastgame.date.month + "-" + lastgame.date.date,
                from: firstgame.period % 1000,
                to: lastgame.period % 1000,
            });
        } else {
            Alert.error("下載資料失敗！");
        }
    }

    composeDisplayData() {
        var fromdate = {
            year: +this.state.fromdate.split("-")[0],
            month: +this.state.fromdate.split("-")[1],
            date: +this.state.fromdate.split("-")[2],
        };
        var todate = {
            year: +this.state.todate.split("-")[0],
            month: +this.state.todate.split("-")[1],
            date: +this.state.todate.split("-")[2],
        };
        var newdisplaydata = new Array<displaygame>();
        this.state.gamedatas.years.map((year) => {
            year.monthes.map((month) => {
                month.days.map((day) => {
                    if (dateCompare(day.date, fromdate) >= 0 && dateCompare(day.date, todate) <= 0) {
                        day.games.map((game) => {
                            if (
                                (this.state.to < game.period % 1000 && dateCompare(day.date, todate) === 0) ||
                                (this.state.from > game.period % 1000 && dateCompare(day.date, fromdate) === 0)
                            ) {
                                return null;
                            } else {
                                newdisplaydata.push({
                                    date: game.date.date,
                                    id: game.period,
                                    result: game.result,
                                });
                            }
                            return null;
                        });
                    }
                    return null;
                });
                return null;
            });
            return null;
        });
        this.setState({ data: newdisplaydata });
    }

    handleRangeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        if (e.target.name === "fromdate") {
            this.setState({ fromdate: target.value });
        } else if (e.target.name === "from") {
            this.setState({ from: +target.value });
        } else if (e.target.name === "to") {
            this.setState({ to: +target.value });
        } else if (e.target.name === "todate") {
            this.setState({ todate: e.target.value });
        }
    }

    render() {
        const nos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var displaydata: Array<{ id: number; value: number }> = [
            { id: 1, value: 0 },
            { id: 2, value: 0 },
            { id: 3, value: 0 },
            { id: 4, value: 0 },
            { id: 5, value: 0 },
            { id: 6, value: 0 },
            { id: 7, value: 0 },
            { id: 8, value: 0 },
            { id: 9, value: 0 },
            { id: 10, value: 0 },
        ];
        this.state.data.map((game) => {
            displaydata[game.result[this.state.no - 1] - 1].value++;
            return null;
        });
        displaydata.sort((d1, d2) => d2.value - d1.value);
        var sum = 0;
        displaydata.map((i) => {
            sum += i.value;
            return null;
        });
        if (this.state.gamedatas.years.length === 0) {
            return (
                <Download
                    needtodownload={this.state.needtodownload}
                    downloaded={this.state.downloaded}
                    downloadGameData={this.downloadGameData}
                />
            );
        } else {
            return (
                <div style={{ padding: 40 }}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item onClick={() => this.setState({ gamedatas: new GameDatas() })}>下載數據</Breadcrumb.Item>
                        <Breadcrumb.Item active>數據統計</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row style={{ marginBottom: 30, marginLeft: 18 }}>
                        <p style={{ display: "inline-block" }}>分析起點：</p>
                        <input
                            name="fromdate"
                            style={{ display: "inline-block", marginLeft: 16, marginRight: 16, width: 80 }}
                            onChange={this.handleRangeSelect}
                            value={this.state.fromdate}
                        />
                        <p style={{ display: "inline-block" }}>號的第</p>
                        <input
                            name="from"
                            style={{ display: "inline-block", marginLeft: 16, marginRight: 16, width: 80 }}
                            onChange={this.handleRangeSelect}
                            value={this.state.from}
                        />
                        <p style={{ display: "inline-block" }}>場</p>
                        <p style={{ display: "inline-block" }}>分析終點：</p>
                        <input
                            name="todate"
                            style={{ display: "inline-block", marginLeft: 16, marginRight: 16, width: 80 }}
                            onChange={this.handleRangeSelect}
                            value={this.state.todate}
                        />
                        <p style={{ display: "inline-block" }}>號的第</p>
                        <input
                            name="to"
                            style={{ display: "inline-block", marginLeft: 16, marginRight: 16, width: 80 }}
                            onChange={this.handleRangeSelect}
                            value={this.state.to}
                        />
                        <p style={{ display: "inline-block" }}>場</p>
                    </Row>
                    <Row style={{ marginBottom: 30, marginLeft: 18 }}>
                        <p style={{ display: "inline-block" }}>統計獲得</p>
                        <Dropdown
                            trigger={"hover"}
                            menuStyle={{ marginLeft: 16, marginRight: 16, width: 120 }}
                            title={"第" + this.state.no + "名"}
                            activeKey={this.state.no}
                        >
                            {nos.map((no) => {
                                return (
                                    <Dropdown.Item eventKey={no} onSelect={(value) => this.setState({ no: value })}>
                                        第 {no} 名
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown>
                        <p style={{ display: "inline-block", marginLeft: 18 }}>的次數</p>
                        <Button style={{ display: "inline-block", marginLeft: 16 }} appearance="primary" onClick={this.composeDisplayData}>
                            統計
                        </Button>
                    </Row>

                    <BarChart
                        width={800}
                        height={400}
                        data={displaydata}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        stackOffset="sign"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="value"
                            fill="#8884d8"
                            label={{ position: "top" }}
                            onClick={(data) => this.setState({ selectedNumber: data.id })}
                        />
                    </BarChart>
                    <Message
                        showIcon
                        type="info"
                        description={"目前選擇的統計範圍共開了 " + sum + " 期"}
                        style={{ width: "40%", minWidth: 360, marginTop: 36 }}
                    />
                    <Modal show={this.state.selectedNumber > 0} onHide={() => this.setState({ selectedNumber: -1 })}>
                        <Modal.Header>
                            <Modal.Title>出現場次明細</Modal.Title>
                            <p>
                                以下是 {this.state.selectedNumber} 號在 {this.state.fromdate} 的第 {this.state.from} 期至{" "}
                                {this.state.todate} 的第 {this.state.to} 期所得到第 {this.state.no} 名的期數
                            </p>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.data.map((game) => {
                                if (game.result[this.state.no - 1] === this.state.selectedNumber) return <p>{game.id}</p>;
                                return null;
                            })}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.setState({ selectedNumber: -1 })} appearance="subtle">
                                關閉
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
}
