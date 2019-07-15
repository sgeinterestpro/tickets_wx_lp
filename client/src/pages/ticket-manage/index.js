import Taro from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {AtButton, AtLoadMore, AtProgress, AtToast} from "taro-ui";
import './index.scss'
import TicketTabBar from '../../component/tab-bar'
import ModalTicketPurchase from '../../component/modal-ticket-purchase'
import {ticketGenerate, ticketLog, ticketUsage} from "../../apis";
import {ticketOption} from "../../config";
// import {ticketClass, ticketState} from "../../config";

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
      tOpened: false,
      tText: '加载中...',
      tStatus: 'loading',
      modalTicketPurchaseShow: false,
      openIndex: -1,
      defaultCount: 0,
      activeCount: 0,
      ticketList: [],
      status: 'more'
    }
  }

  componentDidShow() {
    Taro.startPullDownRefresh();
  }

  onPullDownRefresh() {
    this.updateTicketList();
    this.updateTicketLog();
  }

  /**
   * 更新票券列表显示
   */
  updateTicketList = () => {
    ticketUsage().then(res => {
      console.log(res);
      if (res.code === 0) {
        this.setState({
          defaultCount: res.data.default,
          activeCount: res.data.active
        });
      }
      Taro.stopPullDownRefresh();
      Taro.showToast({title: '加载成功', icon: 'none', duration: 500});
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: '加载失败', icon: 'none', duration: 500});
    });
  };
  /**
   * 更新票券列表记录
   */
  updateTicketLog = () => {
    ticketLog().then(res => {
      let ticketListNew = [];
      res.items.map((item) => {
        ticketListNew.push(item)
      });
      Taro.stopPullDownRefresh();
      Taro.showToast({title: '加载成功', icon: 'none', duration: 500});
      this.setState({ticketList: ticketListNew, openIndex: -1, tOpened: false});
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: '加载失败', icon: 'none', duration: 500});
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

  handleClick = () => {
    // 开始加载
    this.setState({
      status: 'loading'
    })
    // 模拟异步请求数据
    setTimeout(() => {
      // 没有更多了
      this.setState({
        status: 'noMore'
      })
    }, 2000)
  }

  render() {
    const {modalTicketPurchaseShow} = this.state;
    const {tOpened, tText, tStatus} = this.state;
    const {defaultCount, activeCount} = this.state;
    const {ticketList} = this.state;
    const percent = 100 * (defaultCount / ((activeCount + defaultCount) || 1));
    return (
      <View>
        <View class='container'>
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={0} hasMask/>
          <ModalTicketPurchase
            isOpened={modalTicketPurchaseShow}
            onHide={this.modalTicketPurchaseHide.bind(this)}
          />
          <View class='tickets-info'>
            <AtProgress className='info-progress' percent={percent} isHidePercent status='progress' strokeWidth={20}/>
            <View className='at-row '>
              <View className='at-col info-item'>
                <View className='item-title'>当月剩余数量</View>
                <View className='item-body'>
                  <Text className='item-text'>{defaultCount}</Text><Text className='item-unit'>张</Text>
                </View>
              </View>
              <View className='at-col info-item'>
                <View className='item-title'>当月领取数量</View>
                <View className='item-body'>
                  <Text className='item-text'>{activeCount}</Text><Text className='item-unit'>张</Text>
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
          <View class='ticket-log'>
            <View class='list'>
              {ticketList.length > 0 ?
                <View>
                  {ticketList.map((item, index) => (
                    <View key={index} class='item'>
                      <View class='time'>{item.time}</View>
                      <View class='text'>{`${item.real_name} ${ticketOption[item.option]} ${item.ticket_id}`}</View>
                    </View>
                  ))}
                  <AtLoadMore
                    className={'load-more'}
                    onClick={this.handleClick.bind(this)}
                    status={this.state.status}
                  />
                </View>
                :
                <View class='item'>没有记录</View>
              }
            </View>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
