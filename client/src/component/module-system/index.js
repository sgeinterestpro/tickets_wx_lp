import Taro from "@tarojs/taro"
import {Button} from "@tarojs/components"
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from "taro-ui";
import "../module-index.scss"

export default class Index extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = {
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

  render() {
    const {tOpened, tText, tStatus, tDuration} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <AtModal closeOnClickOverlay={false} isOpened={true} onClose={this.onClose}>
        <AtModalHeader>系统设置</AtModalHeader>
        <AtModalContent>
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                   onClose={this.onToastClose.bind(this)}/>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.onClose.bind(this, "")}>取消</Button>
          <Button onClick={this.onClose.bind(this, "")}>确定</Button>
        </AtModalAction>
      </AtModal>
    )
  }
}
