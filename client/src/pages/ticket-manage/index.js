import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtList, AtListItem, AtSwipeAction, AtToast} from "taro-ui";
import './index.scss'
import {ticketState} from "../../config";
import TicketTabBar from '../../component/tab-bar'
import ModalTicketPurchase from '../../component/modal-ticket-purchase'
import {deleteTicket, getTicketList} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '票券列表',
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments);
    this.state = {
      toast_loading: false,
      toast_text: '加载中...',
      toast_status: 'loading',
      modal_ticket_purchase_show: false,
      open_index: -1,
      ticket_list: []
    }
  }

  componentDidShow() {
    Taro.startPullDownRefresh();
  }

  onPullDownRefresh() {
    this.updateTicketList();
  }

  /**
   * 更新票券列表显示
   */
  updateTicketList = () => {
    getTicketList().then(res => {
      let ticket_list_new = [];
      res.items.map((item) => {
        ticket_list_new.push(
          {
            _id: item._id,
            title: item.title,
            date: item.date,
            state: ticketState[item.state],
            enable: item.state === 'unused',
          })
      });
      Taro.stopPullDownRefresh();
      Taro.showToast({title: '加载成功', icon: 'none', duration: 500});
      this.setState({ticket_list: ticket_list_new, open_index: -1, toast_loading: false});
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: '加载失败', icon: 'none', duration: 500});
    });
  };

  /**
   * 券点击事件，跳转到票券详情
   * @param item 票券参数
   */
  onTicketClick = (item) => {
    this.setState({open_index: -1});
    Taro.navigateTo({
      url: `/pages/ticket-show/index?id=${item._id}`
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
    //todo 增加删除确认
    const {ticket_list} = this.state;
    const ticket = ticket_list[index];
    Taro.showModal({
      title: '删除确认',
      content: '是否删除该票券？',
      confirmText: '取消',
      confirmColor: '#000000',
      cancelText: '删除',
      cancelColor: '#FF0000'
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        console.log(ticket._id);
        deleteTicket(ticket._id).then(res => {
          this.updateTicketList();
          if (res.code !== 0) {
            this.setState({
              toast_loading: false,
              toast_text: '删除失败',
              toast_status: 'error',
            });
            Taro.showModal({content: res.message, showCancel: false});
          } else {
            this.setState({
              toast_loading: true,
              toast_text: '删除成功',
              toast_status: 'success',
            });
          }
        });
        this.setState({
          open_index: -1,
          toast_loading: true,
          toast_text: '删除中...',
          toast_status: 'loading',
        });
      }
    });
  };

  /**
   * 领取新票券按钮点击
   */
  modalTicketPurchaseShow = () => {
    this.setState({open_index: -1, modal_ticket_purchase_show: true});
  };

  /**
   * 领券中心弹窗返回
   * @constructor
   */
  modalTicketPurchaseHide = (res) => {
    console.log('res', res);
    if (res) this.updateTicketList();
    this.setState({modal_ticket_purchase_show: false})
  };

  render() {
    const {ticket_list, modal_ticket_purchase_show, open_index} = this.state;
    const {toast_loading, toast_text, toast_status} = this.state;

    return (
      <View>
        <View class='container'>
          <AtToast isOpened={toast_loading} text={toast_text} status={toast_status} duration={0} hasMask/>
          <ModalTicketPurchase
            isOpened={modal_ticket_purchase_show}
            onHide={this.modalTicketPurchaseHide.bind(this)}
          />
          <View class='ticket-list'>
            <AtList>
              {ticket_list.length > 0 ?
                ticket_list.map((item, index) => (
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
                      note={item.date}
                      disabled={!item.enable}
                      extraText={item.state}
                      arrow='right'
                      thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
                      onClick={this.onTicketClick.bind(this, item)}
                    />
                  </AtSwipeAction>
                )) :
                <AtListItem className='item' title='本周还未领取优惠券'/>
              }
            </AtList>
          </View>
          <View class='ticket-apply'>
            <AtButton
              type='secondary'
              circle
              disabled={ticket_list.length >= 3}
              onClick={this.modalTicketPurchaseShow.bind(this)}
            >
              {ticket_list.length >= 3 ? '没有领取额度了' : `本周还可领取${3 - ticket_list.length}张`}
            </AtButton>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
