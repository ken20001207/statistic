import React from "react";
import "./App.css";
import { displaygame, DayDate } from "./classes/types";
import GameDatas from "./classes/GameDatas";
import dateCompare from "./methods/dateCompare";
import { Loader, Progress, Form, FormGroup, ControlLabel, Input, Button, Row, Tooltip } from "rsuite";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";
import getCarHistoryByPeriod from "./methods/getCarHistoryByPeriod";
import getDaysCount from "./methods/getDaysCount";

import "rsuite/dist/styles/rsuite-default.css";

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
}

class App extends React.Component<{}, AppStates> {
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
      downloadto: "2020-4-8"
    };
    this.downloadGameData = this.downloadGameData.bind(this);
    this.handleRangeSelect = this.handleRangeSelect.bind(this);
    this.addDownloadedCOunt = this.addDownloadedCOunt.bind(this);
    this.composeDisplayData = this.composeDisplayData.bind(this);
  }

  addDownloadedCOunt() {
    console.log("downloaded!");
    this.setState({ downloaded: this.state.downloaded + 1 });
  }

  downloadGameData(dayA: DayDate, dayB: DayDate) {
    this.setState({ needtodownload: getDaysCount(dayA, dayB) });
    getCarHistoryByPeriod(dayA, dayB, new GameDatas(), this.addDownloadedCOunt).then(data => {
      data.years.sort((yearA, yearB) => yearA.date.year - yearB.date.year);
      data.years.map(year => {
        year.monthes.sort((monthA, monthB) => monthA.date.month - monthB.date.month);
      });
      data.years.map(year => {
        year.monthes.map(montn => {
          montn.days.sort((dayA, dayB) => dayA.date.date - dayB.date.date);
        });
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
        to: lastgame.period % 1000
      });
    });
  }

  composeDisplayData() {
    var fromdate = {
      year: +this.state.fromdate.split("-")[0],
      month: +this.state.fromdate.split("-")[1],
      date: +this.state.fromdate.split("-")[2]
    };
    var todate = {
      year: +this.state.todate.split("-")[0],
      month: +this.state.todate.split("-")[1],
      date: +this.state.todate.split("-")[2]
    };
    var newdisplaydata = new Array<displaygame>();
    this.state.gamedatas.years.map(year => {
      year.monthes.map(month => {
        month.days.map(day => {
          if (dateCompare(day.date, fromdate) >= 0 && dateCompare(day.date, todate) <= 0) {
            day.games.map(game => {
              if (
                (this.state.to < game.period % 1000 && dateCompare(day.date, todate) === 0) ||
                (this.state.from > game.period % 1000 && dateCompare(day.date, fromdate) === 0)
              ) {
                return null;
              } else {
                newdisplaydata.push({
                  date: game.date.date,
                  id: game.period,
                  result: game.result
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
      { id: 10, value: 0 }
    ];
    this.state.data.map(game => {
      displaydata[game.result[this.state.no - 1] - 1].value++;
      return null;
    });
    displaydata.sort((d1, d2) => d2.value - d1.value);
    if (this.state.gamedatas.years.length === 0)
      return (
        <div style={{ padding: 60 }}>
          {this.state.needtodownload !== 0 ? (
            <Loader
              backdrop
              content={
                this.state.downloaded <= 0 ? (
                  "請稍後... 正在準備下載以前的資料"
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-block", width: "70%" }}>
                      <Progress.Line
                        percent={Math.floor((this.state.downloaded * 100) / this.state.needtodownload)}
                        strokeColor="#3385ff"
                        status={this.state.needtodownload === 0 ? "success" : "active"}
                      />
                    </div>
                  </div>
                )
              }
              vertical
            />
          ) : (
            <p />
          )}
          <h1>請輸入想要分析的日期範圍</h1>
          <p>警告：範圍太大將導致下載時間太長！</p>
          <Form style={{ marginTop: 60 }}>
            <FormGroup>
              <ControlLabel>起始日期</ControlLabel>
              <Input name="from" onChange={value => this.setState({ downloadfrom: value })} value={this.state.downloadfrom} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>截止日期</ControlLabel>
              <Input name="to" onChange={value => this.setState({ downloadto: value })} value={this.state.downloadto} />
            </FormGroup>
            <Button
              style={{ zIndex: 1 }}
              onClick={() => {
                var f = this.state.downloadfrom.split("-");
                var t = this.state.downloadto.split("-");
                this.downloadGameData({ year: +f[0], month: +f[1], date: +f[2] }, { year: +t[0], month: +t[1], date: +t[2] });
              }}
              disabled={this.state.needtodownload !== 0}
              appearance="primary"
            >
              開始下載
            </Button>
          </Form>
        </div>
      );
    return (
      <div style={{ padding: 80 }}>
        <Row style={{ marginBottom: 30 }}>
          <p style={{ display: "inline-block" }}>統計獲得第</p>
          <select
            onChange={e => {
              this.setState({
                no: +e.target.value
              });
            }}
          >
            {nos.map(no => {
              return <option value={no}>{no}</option>;
            })}
          </select>
          <p style={{ display: "inline-block" }}>名的次數</p>
        </Row>
        <Row style={{ marginBottom: 30 }}>
          <p style={{ display: "inline-block" }}>統計範圍：從</p>
          <input name="fromdate" style={{ display: "inline-block" }} onChange={this.handleRangeSelect} value={this.state.fromdate} />
          <p style={{ display: "inline-block" }}>號的第</p>
          <input name="from" style={{ display: "inline-block" }} onChange={this.handleRangeSelect} value={this.state.from} />
          <p style={{ display: "inline-block" }}>場到</p>
          <input name="todate" style={{ display: "inline-block" }} onChange={this.handleRangeSelect} value={this.state.todate} />
          <p style={{ display: "inline-block" }}>號的第</p>
          <input name="to" style={{ display: "inline-block" }} onChange={this.handleRangeSelect} value={this.state.to} />
          <p style={{ display: "inline-block" }}>場</p>
        </Row>
        <Row style={{ marginBottom: 30 }}>
          <Button appearance="primary" onClick={this.composeDisplayData}>
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
            bottom: 5
          }}
          stackOffset="sign"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" label={{ position: "top" }} />
        </BarChart>
      </div>
    );
  }
}

export default App;
