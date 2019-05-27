import Taro, {Component} from '@tarojs/taro'
import {Button, Picker, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from 'taro-ui'
import './index.scss'
import {getWeekDay, getNowDay} from "../../common/getWeek";
import {applyNewTicket} from "../../apis";
import {ClassType} from "../../common/conv";

export default class Index extends Component {

  constructor() {
    super(...arguments);
    const date = new Date();
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    month = (month.length === 1) ? '0' + month : month;
    day = (day.length === 1) ? '0' + day : day;
    this.state = {
      toast_loading: false,
      toast_text: '加载中...',
      toast_status: 'loading',
      eventShow: ClassType.getNameList(),
      eventValue: ClassType.getCodeList(),
      eventSelect: 1,
      dateSel: [year, month, day].join('-')
    }
  }

  onChange = e => {
    this.setState({
      eventSelect: e.detail.value
    })
  };

  onDateChange = e => {
    const val = e.detail.value;
    const dateSel = Array.isArray(val) ? val.join('-') : val;
    this.setState({dateSel})
  };

  onConfirm = () => {
    const {onHide} = this.props;
    const {eventShow, eventValue, eventSelect, dateSel} = this.state;
    const data = {
      class: eventValue[eventSelect],
      title: eventShow[eventSelect],
      date: dateSel,
    };
    this.setState({toast_loading: true, toast_text: '领取中...', toast_status: 'loading'});
    applyNewTicket(data).then(res => {
      this.setState({toast_loading: false});
      if (res.code !== 0) {
        Taro.showModal({content: res.message, showCancel: false});
      } else {
        Taro.showModal({content: '领取成功', showCancel: false});
        onHide(true);
      }
    });
  };

  onClose = () => this.props.onHide(false);


  render() {
    const {isOpened} = this.props;
    const {eventShow, eventSelect, dateSel} = this.state;
    const {toast_loading, toast_text, toast_status} = this.state;
    const dateStart = getNowDay();
    const dateEnd = getWeekDay(6);
    return (
      isOpened &&
      <View class='container'>
        <AtToast isOpened={toast_loading} text={toast_text} status={toast_status} duration={0} hasMask/>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>领券中心</AtModalHeader>
          <AtModalContent>
            <View className='page-section'>
              <View className='page-section-title'>
                <Text>项目选择</Text>
              </View>
              <View>
                <Picker mode='selector' range={eventShow} value={eventSelect} onChange={this.onChange.bind(this)}>
                  <View className='picker'>
                    当前选择：{eventShow[eventSelect]}
                  </View>
                </Picker>
              </View>
            </View>
            <View className='page-section'>
              <View className='page-section-title'>
                <Text>日期选择</Text>
              </View>
              <View>
                <Picker mode='date' start={dateStart} end={dateEnd} value={dateSel}
                        onChange={this.onDateChange.bind(this)}>
                  <View className='picker'>当前选择：{dateSel}</View>
                </Picker>
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onClose.bind(this)}>取消</Button>
            <Button onClick={this.onConfirm.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
