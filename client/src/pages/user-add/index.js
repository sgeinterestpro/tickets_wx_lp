/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、用户信息显示
 * 2、用户信息修改功能
 * 3、用户角色切换
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtCheckbox, AtForm, AtInput} from "taro-ui"
import "./index.scss"
import {roleAllList, ticketClass} from "../../config";
import {userAdd, userFind} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "新增用户",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      roleList: {},
      userInfo: {}
    };

    this.sportsOption = Object.keys(ticketClass).map((key) => ({
      value: key,
      label: ticketClass[key]
    }));

    this.roleOption = Object.keys(roleAllList).map((key) => ({
      value: key,
      label: roleAllList[key]
    }));
  }

  componentDidMount() {
    const {id} = this.$router.params;
    const {roleList} = this.state;
    userFind(id).then((res) => {
      if (res.code !== 0) {
      } else {
        const userInfo = res.data || {};
        const roleKeyList = userInfo.role;
        for (let roleKey of roleKeyList) {
          if (roleAllList[roleKey]) {
            roleList[roleKey] = roleAllList[roleKey]
          }
        }
        this.setState({roleList, userInfo})
      }
    })
  }

  handleChange = (key, value) => {
    const {userInfo} = this.state;
    // console.debug(key, value);
    userInfo[key] = value;
    this.setState({userInfo})
  };
  onSubmit = () => {
    const {userInfo} = this.state;
    userAdd(userInfo).then(res => {
      if (res.code !== 0) {
        console.error(res);
        Taro.showToast({title: res.message, icon: "none", duration: 2000});
      } else {
        Taro.navigateBack();
      }
    }).catch(err => console.exception(err))
  };
  onReset = () => {
    const {userInfo} = this.state;
    for (const key of Object.keys(userInfo)) {
      if (Array.isArray(userInfo[key])) userInfo[key] = [];
      else userInfo[key] = null;
    }
    this.setState({userInfo})
  };

  render() {
    const {userInfo} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="container">
        <View class="main">
          <View class="title">
            新增用户
          </View>
          <AtForm
            className="form"
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
          >
            <AtInput name="real_name" title="姓名" type="text" placeholder="请输入姓名" value={userInfo["real_name"]}
                     onChange={this.handleChange.bind(this, "real_name")}/>
            <AtInput name="work_no" title="工号" type="text" placeholder="请输入工号" value={userInfo["work_no"]}
                     onChange={this.handleChange.bind(this, "work_no")}/>
            <AtInput name="email" title="邮箱" type="text" placeholder="请输入邮箱" value={userInfo["email"]}
                     onChange={this.handleChange.bind(this, "email")}/>
            <AtInput name="phone" title="手机号码" type="text" placeholder="请输入手机号码" value={userInfo["phone"]}
                     onChange={this.handleChange.bind(this, "phone")}/>
            <View class="form-item">
              <View class="key">
                运动项目
              </View>
              <View class="value">
                <AtCheckbox
                  options={this.sportsOption}
                  selectedList={userInfo["sports"]}
                  onChange={this.handleChange.bind(this, "sports")}
                />
              </View>
            </View>
            <View class="form-item">
              <View class="key">
                用户角色
              </View>
              <View class="value">
                <AtCheckbox
                  options={this.roleOption}
                  selectedList={userInfo["role"]}
                  onChange={this.handleChange.bind(this, "role")}
                />
              </View>
            </View>
            <View class="buttons">
              <AtButton className="button" formType="reset">重置</AtButton>
              <AtButton className="button" formType="submit">提交</AtButton>
            </View>
          </AtForm>
        </View>
      </View>
    )
  }
}
