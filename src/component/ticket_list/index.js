import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtList, AtListItem, AtSwipeAction} from "taro-ui";
import ModalTicketApply from '../modal_ticket_apply'
import {applyNewTicket, getTickets} from "../../apis";
import './index.scss'

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      modal_ticket_apply_show: false,
      ticket_list: [
        {
          id: 'sport_201904150002',
          title: '羽毛球',
          note: '已使用',
          enable: false,
        },
        {
          id: 'sport_201904150003',
          title: '游泳',
          note: '已过期',
          enable: false,
        },
      ]
    }
  }

  componentWillMount() {
  }


  componentDidMount() {
    getTickets()
  }


  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  /**
   * 券点击事件，跳转到票券详情
   * @param item 票券参数
   */
  onTicketClick = (item) => {
    Taro.navigateTo({
      url: `/pages/ticket_show/index?id=${item.id}&name=${item.name}`
    })
  };
  onSwipeActionClick = (index) => {
    let {ticket_list} = this.state;
    ticket_list.splice(index, 1);
    this.setState({ticket_list})
  };
  onSwipeActionOpened = () => {
  };

  onReceiveClick = () => {
    this.setState({modal_ticket_apply_show: true});
  };
  ModalTicketApplyConfirm = (data) => {
    applyNewTicket(data).then(() => {
      Taro.showModal({content: '领取成功', showCancel: false});
      getTickets()
    });
    this.ModalTicketApplyClose()
  }
  ModalTicketApplyClose = () => {
    this.setState({modal_ticket_apply_show: false})
  }


  render() {
    const {ticket_list, modal_ticket_apply_show} = this.state;

    return (
      <View class='container'>
        <View class='ticket-list'>
          <AtList>
            {ticket_list.length > 0 ? ticket_list.map((item, index) => (
              <AtSwipeAction
                key={index}
                onClick={this.onSwipeActionClick.bind(this, index)}
                onOpened={this.onSwipeActionOpened.bind(this, index)}
                isOpened={item.isSwipeActionOpened}
                disabled={!item.enable}
                autoClose
                options={[{text: '删除', style: {backgroundColor: '#FF4949'}}]}
              >
                <AtListItem
                  className='item'
                  title={item.title}
                  note={item.note}
                  disabled={!item.enable}
                  extraText='去使用'
                  arrow='right'
                  thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
                  onClick={this.onTicketClick.bind(this, item)}
                />
              </AtSwipeAction>
            )) : <AtListItem
              className='item'
              title='本周还未领取优惠券'
            />}
          </AtList>
        </View>
        <ModalTicketApply
          isOpened={modal_ticket_apply_show}
          onConfirm={this.ModalTicketApplyConfirm.bind(this)}
          onClose={this.ModalTicketApplyClose.bind(this)}
        />
        <View class='ticket-apply'>
          <AtButton
            type='secondary'
            circle
            disabled={ticket_list.length >= 3}
            onClick={this.onReceiveClick.bind(this)}
          >
            {ticket_list.length >= 3 ? '没有领取额度了' : `本周还可领取${3 - ticket_list.length}张`}
          </AtButton>
        </View>
      </View>
    )
  }
}
