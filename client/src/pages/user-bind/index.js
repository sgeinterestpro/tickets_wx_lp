/**
 * muumlover@2019-05-27
 * 用户授权页面
 * 1、用户授权按钮
 * 2、TODO 用户信息获取
 */
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtInput, AtToast} from 'taro-ui'
import './index.scss'
import {userBind} from "../../apis";

export default class Index extends Taro.Component {

  config = {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '授权页面',
  };

  constructor() {
    super(...arguments);
    this.state = {
      email_value: 'wangsen@primeton.com',
      email_valid: false,
      tOpened: false,
      tText: '加载中...',
      tStatus: 'loading',
      tDuration: 3000,
    }
  }


  handleChange = (email_value) => {
    this.setState({email_value});
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(email_value)) {
      this.setState({email_valid: false});
    } else {
      this.setState({email_valid: true});
    }
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return email_value
  };

  submitEmail = () => {
    const {email_value, email_valid} = this.state;
    if (!email_valid) {
      Taro.showToast({
        title: '请勿提交非法电子邮件地址',
        icon: 'none'
      });
      return;
    }
    this.setState({tOpened: true, tText: '正在发送邮件', tStatus: 'loading', tDuration: 0});
    userBind({
      email: email_value
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        this.setState({tOpened: true, tText: '邮件发送成功', tStatus: 'success', tDuration: 3000});
      } else {
        this.setState({tOpened: true, tText: res.message, tStatus: 'error', tDuration: 3000});
      }
    }).catch(err => {
      this.setState({tOpened: true, tText: '服务器繁忙', tStatus: 'error', tDuration: 3000});
    });
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  render() {
    const {email_value, email_valid} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;
    return (
      <View class='container'>
        <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                 onClose={this.onToastClose.bind(this)}/>
        <View class='input'>
          <AtInput
            clear
            error={!email_valid}
            type='text'
            maxLength='99'
            placeholder='请输入邮箱'
            value={email_value}
            onChange={this.handleChange.bind(this)}
          />
        </View>
        <View class='button'>
          <AtButton
            type='primary'
            size='normal'
            disabled={!email_valid}
            onClick={this.submitEmail.bind(this)}
          >
            发送验证邮件
          </AtButton>
        </View>
      </View>
    )
  }
}
