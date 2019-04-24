import {Component} from '@tarojs/taro'
import {Button, Picker, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtModalContent, AtModalHeader} from 'taro-ui'
import getWeek from "../../common/getWeek";
import './index.scss'

export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      eventShow: ['羽毛球', '乒乓球', '游泳'],
      eventValue: ['badminton', 'pingpang', 'swim'],
      eventSelect: 1,
      dateSel: '2018-04-22'
    }
  }

  onChange = e => {
    this.setState({
      eventSelect: e.detail.value
    })
  }

  onDateChange = e => {
    const val = e.detail.value;
    const dateSel = Array.isArray(val) ? val.join('-') : val;
    this.setState({dateSel})
  }

  onConfirm = () => {
    const {onConfirm} = this.props;
    const {eventShow, eventValue, eventSelect, dateSel} = this.state;
    onConfirm({
      class: eventValue[eventSelect],
      title: eventShow[eventSelect],
      date: dateSel,
    });
  };

  render() {
    const {onClose, isOpened} = this.props;
    const {eventShow, eventSelect, dateSel} = this.state;
    const dateStart = getWeek(0);
    const dateEnd = getWeek(6);
    return (
      <View class='container'>
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
            <Button onClick={onClose.bind(this)}>取消</Button>
            <Button onClick={this.onConfirm.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
