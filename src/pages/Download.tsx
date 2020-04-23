import React from "react";
import { Loader, Progress, Form, FormGroup, ControlLabel, Input, Button, Dropdown, Alert, Message } from "rsuite";
import { DayDate } from "../classes/types";

interface downloadPageProps {
    needtodownload: number;
    downloaded: number;
    downloadGameData: (dayA: DayDate, dayB: DayDate, game: "幸運飛艇" | "VR賽車") => void;
}

export default class Download extends React.Component<downloadPageProps> {
    public state = {
        game: "幸運飛艇",
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
                <div style={{ marginBottom: 36 }}>
                    <h5>1. 選擇想要分析的項目</h5>
                    <Dropdown
                        trigger={"hover"}
                        menuStyle={{ marginLeft: 16, marginRight: 16, width: 120 }}
                        title={this.state.game}
                        activeKey={this.state.game}
                    >
                        <Dropdown.Item eventKey={"幸運飛艇"} onSelect={() => this.setState({ game: "幸運飛艇" })}>
                            幸運飛艇
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"VR賽車"} onSelect={() => this.setState({ game: "VR賽車" })}>
                            VR賽車
                        </Dropdown.Item>
                    </Dropdown>
                </div>
                <div>
                    <h5>2. 輸入想要分析的日期範圍</h5>
                    <Message type="warning" description="警告：範圍太大將導致下載時間太長！" style={{ width: 360, marginTop: 18 }} />
                    <Form style={{ marginTop: 18 }}>
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
                    </Form>
                </div>
                <Button
                    style={{ zIndex: 1, marginTop: 18 }}
                    onClick={() => {
                        if (this.state.game !== "幸運飛艇" && this.state.game !== "VR賽車") {
                            Alert.error("請先選擇要分析的項目");
                        } else {
                            var f = this.state.downloadfrom.split("-");
                            var t = this.state.downloadto.split("-");
                            this.props.downloadGameData(
                                { year: +f[0], month: +f[1], date: +f[2] },
                                { year: +t[0], month: +t[1], date: +t[2] },
                                this.state.game
                            );
                        }
                    }}
                    disabled={this.props.needtodownload !== 0}
                    appearance="primary"
                >
                    開始下載
                </Button>
            </div>
        );
    }
}
