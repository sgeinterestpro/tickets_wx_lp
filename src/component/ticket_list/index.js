import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtList, AtListItem, AtSwipeAction} from "taro-ui";
import ModalTicketApply from '../modal_ticket_apply'
import {applyNewTicket, deleteTicket, getTickets} from "../../apis";
import './index.scss'

const state_table = {
  'unused': '未使用',
  'expired': '已过期',
  'used': '已使用'
}


export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      modal_ticket_apply_show: false,
      open_index: -1,
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
    this.updateTicketList();
  }


  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  /**
   * 更新票券列表显示
   */
  updateTicketList = () => {
    getTickets().then(res => {
      let ticket_list_new = [];
      res.items.map((item) => {
        ticket_list_new.push(
          {
            id: item.id,
            title: item.title,
            note: state_table[item.state],
            enable: item.state === 'unused',
          })
      });
      this.setState({ticket_list: ticket_list_new});
    })
  };

  /**
   * 券点击事件，跳转到票券详情
   * @param item 票券参数
   */
  onTicketClick = (item) => {
    Taro.navigateTo({
      url: `/pages/ticket_show/index?id=${item.id}&name=${item.name}`
    })
  };

  /**
   * 滑动功能区打开
   * 限制只能打开一个滑动功能区
   * @param index
   */
  onSwipeActionOpened = (index) => {
    console.log('onSwipeActionOpened', index);
    this.setState({open_index: index})
  };

  /**
   * 滑动功能区点击
   * 删除票券
   * @param index
   */
  onSwipeActionClick = (index) => {
    const {ticket_list} = this.state;
    const ticket = ticket_list[index];
    deleteTicket(ticket.id).then((res) => {
      console.log(res);
    });
    this.setState({open_index: -1});
  };

  /**
   * 领取新票券按钮点击
   */
  onBtnApplyClick = () => {
    this.setState({modal_ticket_apply_show: true});
  };

  /**
   * 关闭领券中心弹窗
   * @constructor
   */
  modalTicketApplyClose = () => {
    this.setState({modal_ticket_apply_show: false})
  };

  /**
   * 领取新票券
   * @param data
   * @constructor
   */
  modalTicketApplyConfirm = (data) => {
    applyNewTicket(data).then((res) => {
      if (res.code !== 0) {
        Taro.showModal({content: res.message, showCancel: false});
      } else {
        Taro.showModal({content: '领取成功', showCancel: false});
      }
      this.updateTicketList();
    });
    this.modalTicketApplyClose()
  };


  render() {
    const {ticket_list, modal_ticket_apply_show, open_index} = this.state;

    return (
      <View class='container'>
        <View class='ticket-list'>
          <AtList>
            {ticket_list.length > 0 ? ticket_list.map((item, index) => (
              <AtSwipeAction
                key={index}
                onClick={this.onSwipeActionClick.bind(this, index)}
                onOpened={this.onSwipeActionOpened.bind(this, index)}
                isOpened={index === open_index}
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
          onConfirm={this.modalTicketApplyConfirm.bind(this)}
          onClose={this.modalTicketApplyClose.bind(this)}
        />
        <View class='ticket-apply'>
          <AtButton
            type='secondary'
            circle
            disabled={ticket_list.length >= 3}
            onClick={this.onBtnApplyClick.bind(this)}
          >
            {ticket_list.length >= 3 ? '没有领取额度了' : `本周还可领取${3 - ticket_list.length}张`}
          </AtButton>
        </View>
      </View>
    )
  }
}
