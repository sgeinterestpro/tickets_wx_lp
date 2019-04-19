import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import TabBar from '../../component/tabbar/index'
import './index.scss'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '券'
  }

  constructor() {
    super(...arguments)

    this.state = {
      list: [
        {
          id: 'Ticket_Scan',
          title: '扫描',
          content: '使用优惠券',
        },
        {
          id: 'Ticket_List',
          title: '所有券',
          content: '查看所有的券',
        }
      ]
    }
  }

  onShareAppMessage() {
    return {
      title: 'Tickets',
      path: '/pages/index/index',
    }
  }

  gotoPanel = e => {
    const {id} = e.currentTarget.dataset
    Taro.navigateTo({
      url: `/pages/${id.toLowerCase()}/index`
    })
  }

  render() {
    const {list} = this.state

    return (
      <View className='page page-index'>
        {/*<View className='logo'>*/}
        {/*  <Image src={logoImg} className='img' mode='widthFix' />*/}
        {/*</View>*/}
        <View className='page-title'>Tickets</View>
        <View className='module-list'>
          {list.map((item, index) => (
            <View
              className='module-list__item'
              key={index}
              data-id={item.id}
              data-name={item.title}
              data-list={item.subpages}
              onClick={this.gotoPanel}
            >
              <View className='module-list__item-title'>{item.title}</View>
              <View className='module-list__item-content'>{item.content}</View>
            </View>
          ))}
        </View>
        <TabBar />
      </View>
    )
  }
}
