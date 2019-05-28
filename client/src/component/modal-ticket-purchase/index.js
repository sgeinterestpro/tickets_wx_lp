/**
 * muumlover@2019-05-27
 * 票券领取对话框
 * 1、显示日期和可领取项目
 */
import Taro, {Component} from '@tarojs/taro'
import {Button, Picker, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from 'taro-ui'
import './index.scss'
import {ticketClass} from "../../config";
import {getNowDay, getWeekDay} from "../../common/getWeek";
import {purchaseTicket} from "../../apis";

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
      toastLoading: false,
      toastText: '加载中...',
      toastStatus: 'loading',
      eventShow: Object.values(ticketClass),
      eventValue: Object.keys(ticketClass),
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
    this.setState({toastLoading: true, toastText: '领取中...', toastStatus: 'loading'});
    purchaseTicket(data).then(res => {
      this.setState({toastLoading: false});
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
    const {toastLoading, toastText, toastStatus} = this.state;
    const dateStart = getNowDay();
    const dateEnd = getWeekDay(6);
    return (
      isOpened &&
      <View class='container'>
        <AtToast isOpened={toastLoading} text={toastText} status={toastStatus} duration={0} hasMask/>
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
