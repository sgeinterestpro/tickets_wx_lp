/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、用户信息显示
 * 2、用户信息修改功能
 * 3、用户角色切换
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtAvatar, AtButton, AtCheckbox, AtForm, AtInput} from "taro-ui"
import "./index.scss"
import {roleAllList, ticketClass} from "../../config";
import {memberDelete, memberEdit, memberFind} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "用户信息",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      editShow: false,
      userInfoOld: {},
      userInfo: {},
      roleList: [],
      sportList: []
    };
    this.roleOption = Object.keys(roleAllList).map((key) => ({
      value: key,
      label: roleAllList[key]
    }));
  }

  componentDidMount() {
    const {id} = this.$router.params;
    const {roleList} = this.state;
    memberFind(id).then((res) => {
      if (res.code !== 0) {
      } else {
        const userInfo = res.data || {};
        const roleKeyList = userInfo.role;
        for (let roleKey of roleKeyList) {
          if (roleAllList[roleKey]) {
            roleList[roleKey] = roleAllList[roleKey]
          }
        }
        let sportList = [];
        if (!(userInfo["sports"] && userInfo["sports"].length > 0)) {
          sportList = Object.keys(ticketClass)
        }
        this.setState({userInfo, roleList, sportList})
      }
    })
  }

  handleDeleteUser = (id) => {
    Taro.showModal({
      title: "删除该用户账户？",
      content: "用户账户删除后该用户将无法登录并使用本系统，点击删除后将无法撤销删除操作，请确认是否继续删除用户账户？",
      confirmText: "取消",
      confirmColor: "#000000",
      cancelText: "删除",
      cancelColor: "#FF0000"
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        memberDelete(id).then(res => {
          if (res.code !== 0) {
            this.setState({
              tOpened: false,
              tText: "用户账户删除失败",
              tStatus: "error",
            });
            Taro.showModal({content: res.message, showCancel: false}).then();
          } else {
            this.setState({
              tOpened: true,
              tText: "用户账户删除成功",
              tStatus: "success",
            });
            Taro.navigateBack().then();
          }
        });
        this.setState({
          openIndex: -1,
          tOpened: true,
          tText: "用户账户删除中...",
          tStatus: "loading",
        });
      }
    });
  }

  handleSuspendUser = (id) => {
    Taro.showModal({
      title: "停用该用户账户？",
      content: "用户账户停用后该用户将无法登录并使用本系统，请确认是否继续停用用户账户？",
      confirmText: "取消",
      confirmColor: "#000000",
      cancelText: "停用",
      cancelColor: "#FF0000"
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        memberDelete(id).then(res => {
          if (res.code !== 0) {
            this.setState({
              tOpened: false,
              tText: "用户账户停用失败",
              tStatus: "error",
            });
            Taro.showModal({content: res.message, showCancel: false}).then();
          } else {
            this.setState({
              tOpened: true,
              tText: "用户账户停用成功",
              tStatus: "success",
            });
            Taro.navigateBack().then();
          }
        });
        this.setState({
          openIndex: -1,
          tOpened: true,
          tText: "用户账户停用中...",
          tStatus: "loading",
        });
      }
    });
  }

  handleResumeUser = (id) => {
    Taro.showModal({
      title: "恢复该用户账户？",
      content: "用户账户恢复后该用户可以正常登录并使用本系统，请确认是否继续恢复用户账户？",
      confirmText: "取消",
      confirmColor: "#000000",
      cancelText: "恢复",
      cancelColor: "#0000FF"
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        memberDelete(id).then(res => {
          if (res.code !== 0) {
            this.setState({
              tOpened: false,
              tText: "用户账户恢复失败",
              tStatus: "error",
            });
            Taro.showModal({content: res.message, showCancel: false}).then();
          } else {
            this.setState({
              tOpened: true,
              tText: "用户账户恢复成功",
              tStatus: "success",
            });
            Taro.navigateBack().then();
          }
        });
        this.setState({
          openIndex: -1,
          tOpened: true,
          tText: "用户账户恢复中...",
          tStatus: "loading",
        });
      }
    });
  }

  handleEnableEdit = () => {
    const {userInfo} = this.state;
    this.setState({editShow: true, userInfoOld: Object.assign({}, userInfo)})
  };
  handleDisableEdit = () => {
    const {userInfoOld} = this.state;
    this.setState({editShow: false, userInfo: userInfoOld})
  };


  handleInfoChange = (key, value) => {
    const {userInfo} = this.state;
    // console.debug(key, value);
    userInfo[key] = value;
    this.setState({userInfo})
  };

  onSubmit = () => {
    const {userInfo} = this.state;
    memberEdit(userInfo).then(res => {
      if (res.code !== 0) {
        console.error(res);
        Taro.showToast({title: res.message, icon: "none", duration: 2000}).then();
      } else {
        this.setState({editShow: false})
      }
    }).catch(err => console.exception(err))
  };

  render() {
    const {editShow, userInfo, sportList} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <View class="user-card">
          <View class="avatar">
            <AtAvatar image={userInfo["avatarUrl"] || 'https://jdc.jd.com/img/200'}/>
            {/*<AtAvatar openData={{type: "userAvatarUrl"}}/>*/}
          </View>
          <View class="info">
            <View>{userInfo["nickName"] || "用户未绑定或未授权微信信息"}</View>
            {/*<OpenData type="userNickName"/>*/}
          </View>
        </View>
        {!editShow ? <View>
            <View class="block">
              <View class="list">
                <View class="list-item">姓名：{userInfo["real_name"]}</View>
                <View class="list-item">电话：{userInfo["phone"]}</View>
                {/*<View class="list-item">工号：{userInfo["work_no"]}</View>*/}
                <View class="list-item">邮箱：{userInfo["email"]}</View>
                <View class="list-item">
                  角色：{(userInfo["role"] || []).map((role) => roleAllList[role] || '未知').join(',')}
                </View>
                <View class="list-item">
                  项目：{sportList.map((sport) => ticketClass[sport] || '未知').join(',')}
                </View>
              </View>
            </View>
            <View class="button-full">
              <AtButton
                type="secondary"
                circle
                onClick={this.handleEnableEdit.bind(this)}
              >
                编辑用户
              </AtButton>
            </View>
            {/* 20201014 移除删除功能，改为停用和恢复，保证数据完整性*/}
            {/*<View class="button-full button-danger">*/}
            {/*  <AtButton*/}
            {/*    type="secondary"*/}
            {/*    circle*/}
            {/*    onClick={this.handleDeleteUser.bind(this, userInfo['init_id'])}*/}
            {/*  >*/}
            {/*    删除用户账户*/}
            {/*  </AtButton>*/}
            {/*</View>*/}

            {userInfo["state"] === "suspend" ? <View class="button-full">
                <AtButton
                  type="secondary"
                  circle
                  onClick={this.handleResumeUser.bind(this, userInfo['init_id'])}
                >
                  恢复用户账户
                </AtButton>
              </View> :
              <View class="button-full button-danger">
                <AtButton
                  type="secondary"
                  circle
                  onClick={this.handleSuspendUser.bind(this, userInfo['init_id'])}
                >
                  停用用户账户
                </AtButton>
              </View>}
          </View> :
          <View class="block">
            <AtForm
              className="form"
              onSubmit={this.onSubmit.bind(this)}
              onReset={this.handleDisableEdit.bind(this)}
            >
              <AtInput class="form-item" name="real_name" title="用户姓名" type="text" placeholder="请输入用户姓名"
                       value={userInfo["real_name"]}
                       onChange={this.handleInfoChange.bind(this, "real_name")}/>
              <AtInput class="form-item" name="email" title="电子邮件" type="text" placeholder="请输入电子邮件"
                       value={userInfo["email"]}
                       onChange={this.handleInfoChange.bind(this, "email")}/>
              <AtInput class="form-item" name="phone" title="手机号码" type="text" placeholder="请输入手机号码"
                       value={userInfo["phone"]}
                       onChange={this.handleInfoChange.bind(this, "phone")}/>
              {/*<View class="form-item">*/}
              {/*  <View class="key">*/}
              {/*    运动项目*/}
              {/*  </View>*/}
              {/*  <View class="value">*/}
              {/*    <AtCheckbox*/}
              {/*      options={this.sportsOption}*/}
              {/*      selectedList={userInfo["sports"]}*/}
              {/*      onChange={this.handleChange.bind(this, "sports")}*/}
              {/*    />*/}
              {/*  </View>*/}
              {/*</View>*/}
              <View class="form-item">
                <View class="key">
                  用户角色
                </View>
                <View class="value">
                  <AtCheckbox
                    options={this.roleOption}
                    selectedList={userInfo["role"]}
                    onChange={this.handleInfoChange.bind(this, "role")}
                  />
                </View>
              </View>
              <View class="buttons">
                <AtButton className="button" formType="reset">取消</AtButton>
                <AtButton className="button" formType="submit">提交</AtButton>
              </View>
            </AtForm>
          </View>
        }
      </View>
    )
  }
}
