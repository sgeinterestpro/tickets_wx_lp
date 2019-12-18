import Taro from "@tarojs/taro"
import {Button, View} from "@tarojs/components"
import {AtInputNumber, AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from "taro-ui";
import "../module-index.scss"
import {ticketGenerate} from "../../apis";
import {impOptNotice} from "../../common/getString";

export default class Index extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = {
      generateCount: 0,
      tOpened: false,
      tText: "加载中...",
      tStatus: "loading",
      tDuration: 3000,
    }
  }

  onClose = (res) => {
    this.props.onClose(res);
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  /**
   * 增发数量修改
   */
  handleCountChange = (generateCount) => {
    this.setState({generateCount: parseInt(generateCount)})
  };

  /**
   * 确定增发
   */
  handleTicketGenerate = () => {
    const {generateCount} = this.state;
    Taro.showModal({
      title: "系统提示",
      content: impOptNotice("增发" + generateCount + "张票券")
    }).then(res => {
      if (res.confirm) {
        this.setState({tOpened: true, tText: "正在执行操作", tStatus: "loading", tDuration: 0});
        ticketGenerate(generateCount).then(res => {
          this.onToastClose();
          if (res.code === 0) {
            Taro.showModal({title: "成功", content: res.message, showCancel: false}).then();
            this.onClose("generate");
          } else {
            Taro.showModal({title: "失败", content: res.message, showCancel: false}).then();
          }
        }).catch(err => {
          console.error(err);
          this.onToastClose();
          Taro.showModal({title: "错误", content: "票券增发失败", showCancel: false, confirmColor: "#FF0000"}).then();
        });
      }
    })
  };

  render() {
    const {generateCount} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <AtModal closeOnClickOverlay={false} isOpened={true} onClose={this.onClose}>
        <AtModalHeader>增发票券</AtModalHeader>
        <AtModalContent>
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                   onClose={this.onToastClose.bind(this)}/>
          <View className="generate body-center">
            <AtInputNumber
              type="number"
              value={generateCount}
              min={0}
              max={10000}
              step={1}
              size="80"
              width={180}
              onChange={this.handleCountChange.bind(this)}
            />
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.onClose.bind(this, "")}>取消</Button>
          <Button
            disabled={!generateCount > 0}
            onClick={this.handleTicketGenerate.bind(this)}
          >
            确定
          </Button>
        </AtModalAction>
      </AtModal>
    )
  }
}
