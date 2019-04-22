import Taro from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import {AtDivider, AtList, AtListItem} from 'taro-ui';
import './index.scss'
import bg from '../../img/bg.png'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '票券助手',
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments)

    this.state = {
      current: 0
    }
  }


  onShareAppMessage() {
    return {
      title: 'Tickets',
      path: '/pages/index/index',
    }
  }

  tabList = [
    {id: 'Ticket_List', title: '票券夹', iconType: 'tags', text: 'new'},
    {id: 'Ticket_Scan', title: '使用', iconType: 'search'},
    {id: 'Ticket_User', title: '我', iconType: 'user', text: '100', max: '99'}
  ];

  handleClick = current => {
    this.setState({current})
  };

  render() {
    const {current} = this.state;

    return (
      <View className='page page-index'>
        <View className='module-list at-row'>
          <Image className='module-list__bg' mode='widthFix' src={bg}/>
          <View className='module-list__item at-col'>
            <View className='module-list__item__icon at-icon at-icon-shopping-bag'/>
            <View className='module-list__item__title'>领取</View>
          </View>
          <View className='module-list__item at-col'>
            <View className='module-list__item__icon at-icon at-icon-search'/>
            <View className='module-list__item__title'>使用</View>
          </View>
        </View>
        <View className='ticket-link'>
          <AtListItem className='ticket-link__item' title='我的票券' hasBorder={false} arrow='right'
                      iconInfo={{size: 25, color: '#78A4FA', value: 'tags',}}/>
        </View>
        <View className='ticket-list'>
          <View className='ticket-list__title'>可用票券</View>
          <AtList hasBorder={false}>
            <AtListItem
              arrow='right'
              title='羽毛球'
              note='凭此券可使用羽毛球馆2小时'
              extraText='去使用'
            />
            <AtListItem
              arrow='right'
              title='游泳券'
              note='凭此券可使用游泳馆2小时'
              extraText='去使用'
              hasBorder={false}
            />
            {/*<AtDivider content='没有更多了'/>*/}
          </AtList>
        </View>
      </View>
    )
  }
}
