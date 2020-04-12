import React from "react";
import { Loader, Progress, Form, FormGroup, ControlLabel, Input, Button } from "rsuite";
import { DayDate } from "../classes/types";

interface downloadPageProps {
    needtodownload: number;
    downloaded: number;
    downloadGameData: (dayA: DayDate, dayB: DayDate) => void;
}

export default class Download extends React.Component<downloadPageProps> {
    public state = {
        downloadfrom: "2020-04-5",
        downloadto: "2020-04-8",
    };

    render() {
        return (
            <div style={{ padding: 60 }}>
                {this.props.needtodownload !== 0 ? (
                    <Loader
                        backdrop
                        content={
                            this.props.downloaded <= 0 ? (
                                "請稍後... 正在準備下載以前的資料"
                            ) : (
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ display: "inline-block", width: "70%" }}>
                                        <Progress.Line
                                            percent={Math.floor((this.props.downloaded * 100) / this.props.needtodownload)}
                                            strokeColor="#3385ff"
                                            status={this.props.needtodownload === 0 ? "success" : "active"}
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
                        <Input
                            name="from"
                            style={{ width: "40%", minWidth: 80 }}
                            onChange={(value) => this.setState({ downloadfrom: value })}
                            value={this.state.downloadfrom}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>截止日期</ControlLabel>
                        <Input
                            style={{ width: "40%", minWidth: 80 }}
                            name="to"
                            onChange={(value) => this.setState({ downloadto: value })}
                            value={this.state.downloadto}
                        />
                    </FormGroup>
                    <Button
                        style={{ zIndex: 1 }}
                        onClick={() => {
                            var f = this.state.downloadfrom.split("-");
                            var t = this.state.downloadto.split("-");
                            this.props.downloadGameData(
                                { year: +f[0], month: +f[1], date: +f[2] },
                                { year: +t[0], month: +t[1], date: +t[2] }
                            );
                        }}
                        disabled={this.props.needtodownload !== 0}
                        appearance="primary"
                    >
                        開始下載
                    </Button>
                </Form>
            </div>
        );
    }
}
