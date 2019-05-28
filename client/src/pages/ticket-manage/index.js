import Taro from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {AtButton, AtProgress, AtToast} from "taro-ui";
import './index.scss'
import {ticketState} from "../../config";
import TicketTabBar from '../../component/tab-bar'
import ModalTicketPurchase from '../../component/modal-ticket-purchase'
import {refundTicket, ticketGenerate, ticketPackage} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '票券管理',
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments);
    this.state = {
      toastLoading: false,
      toastText: '加载中...',
      toastStatus: 'loading',
      modalTicketPurchaseShow: false,
      openIndex: -1,
      ticketList: []
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
    ticketPackage().then(res => {
      let ticketListNew = [];
      res.items.map((item) => {
        ticketListNew.push(
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
      this.setState({ticketList: ticketListNew, openIndex: -1, toastLoading: false});
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
    this.setState({openIndex: -1});
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
    this.setState({openIndex: index})
  };

  /**
   * 滑动功能区点击
   * 删除票券
   * @param index
   */
  onSwipeActionClick = (index) => {
    //todo 增加删除确认
    const {ticketList} = this.state;
    const ticket = ticketList[index];
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
        refundTicket(ticket._id).then(res => {
          this.updateTicketList();
          if (res.code !== 0) {
            this.setState({
              toastLoading: false,
              toastText: '删除失败',
              toastStatus: 'error',
            });
            Taro.showModal({content: res.message, showCancel: false});
          } else {
            this.setState({
              toastLoading: true,
              toastText: '删除成功',
              toastStatus: 'success',
            });
          }
        });
        this.setState({
          openIndex: -1,
          toastLoading: true,
          toastText: '删除中...',
          toastStatus: 'loading',
        });
      }
    });
  };

  /**
   * 领取新票券按钮点击
   */
  modalTicketPurchaseShow = () => {
    ticketGenerate(10).then(console.log)
    // this.setState({openIndex: -1, modalTicketPurchaseShow: true});
  };

  /**
   * 领券中心弹窗返回
   * @constructor
   */
  modalTicketPurchaseHide = (res) => {
    console.log('res', res);
    if (res) this.updateTicketList();
    this.setState({modalTicketPurchaseShow: false})
  };

  render() {
    const {ticketList, modalTicketPurchaseShow, openIndex} = this.state;
    const {toastLoading, toastText, toastStatus} = this.state;

    return (
      <View>
        <View class='container'>
          <AtToast isOpened={toastLoading} text={toastText} status={toastStatus} duration={0} hasMask/>
          <ModalTicketPurchase
            isOpened={modalTicketPurchaseShow}
            onHide={this.modalTicketPurchaseHide.bind(this)}
          />
          <View class='tickets-info'>
            <AtProgress className='info-progress' percent={50} isHidePercent status='progress' strokeWidth={20}/>
            <View className='at-row '>
              <View className='at-col info-item'>
                <View className='item-title'>当月剩余数量</View>
                <View className='item-body'>
                  <Text className='item-text'>3058</Text><Text className='item-unit'>张</Text>
                </View>
              </View>
              <View className='at-col info-item'>
                <View className='item-title'>当月领取数量</View>
                <View className='item-body'>
                  <Text className='item-text'>3058</Text><Text className='item-unit'>张</Text>
                </View>
              </View>
            </View>
          </View>
          <View class='ticket-apply'>
            <AtButton
              type='secondary'
              circle
              // disabled={ticketList.length >= 3}
              onClick={this.modalTicketPurchaseShow.bind(this)}
            >
              增发票券
              {/*{ticketList.length >= 3 ? '没有领取额度了' : `本周还可领取${3 - ticketList.length}张`}*/}
            </AtButton>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
