import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtFloatLayout, AtInputNumber} from "taro-ui";
import "../module-index.scss"
import {ticketGenerate} from "../../apis";
import {impOptNotice} from "../../common/getString";

export default class Index extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = {
      generateCount: 0
    }
  }

  onClose = (res) => {
    this.props.onClose(res);
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
        ticketGenerate(generateCount).then(res => {
          if (res.code !== 0) {
            Taro.showModal({title: "提示", content: res.message, showCancel: false}).then();
          } else {
            Taro.showModal({title: "提示", content: "票券增发成功", showCancel: false}).then();
            this.onClose("generate");
          }
        }).catch(err => {
          console.error(err);
          Taro.showModal({title: "错误", content: "票券增发失败", showCancel: false, confirmColor: "#FF0000"}).then();
        });
      }
    })
  };

  render() {
    const {isOpened} = this.props;
    const {generateCount} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      isOpened &&
      <AtFloatLayout isOpened={isOpened} title="增发票券" onClose={this.onClose}>
        <View className="generate body-center">
          <AtInputNumber min={0} max={10000} size step={1} value={generateCount} width={180}
                         onChange={this.handleCountChange.bind(this)}/>
        </View>
        <AtButton type="secondary" circle disabled={!generateCount > 0}
                  onClick={this.handleTicketGenerate.bind(this)}>
          确定
        </AtButton>
      </AtFloatLayout>
    )
  }
}
