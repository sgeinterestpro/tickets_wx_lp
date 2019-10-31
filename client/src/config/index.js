/**
 * muumlover@2019-05-27
 * 配置文件
 */
import scanHistory from "../img/tabbar/scan-history.png"
import scanHistoryActive from "../img/tabbar/scan-history-active.png"
import ticketPackage from "../img/tabbar/ticket-package.png"
import ticketPackageActive from "../img/tabbar/ticket-package-active.png"
import ticketManage from "../img/tabbar/ticket-manage.png"
import ticketManageActive from "../img/tabbar/ticket-manage-active.png"
import ticketScan from "../img/tabbar/ticket-scan.png"
import ticketScanActive from "../img/tabbar/ticket-scan-active.png"
import userManage from "../img/tabbar/user-manage.png"
import userManageActive from "../img/tabbar/user-manage-active.png"
import userInfo from "../img/tabbar/user-info.png"
import userInfoActive from "../img/tabbar/user-info-active.png"

import badminton from "../img/ticket/badminton.png"
import basketball from "../img/ticket/basketball.png"
import football from "../img/ticket/football.png"
import swim from "../img/ticket/swim.png"
import yoga from "../img/ticket/yoga.png"

/**
 * 用户绑定页面
 * @type {string}
 */
export const qrCodeBase = "http://ticket.sge-tech.com/qr";
/**
 * 运动项目类型代码显示
 * @type {{basketball: string, yoga: string, badminton: string, football: string, swim: string}}
 */
export const ticketClass = {
  "badminton": "羽毛球",
  "basketball": "篮球",
  "football": "足球",
  "swim": "游泳",
  "yoga": "瑜伽",
};
export const ticketIcon = {
  "badminton": badminton,
  "basketball": basketball,
  "football": football,
  "swim": swim,
  "yoga": yoga,
};
/**
 * 票券状态代码显示
 * @type {{valid: string, expired: string, verified: string}}
 */
export const ticketState = {
  "valid": "未使用",
  "expired": "已过期",
  "verified": "已使用"
};

export const ticketOption = {
  "purchase": "领取",
  "refund": "删除",
  "checked": "使用"
};
/**
 * 角色列表
 * @type {{admin: string, checker: string, user: string}}
 */
export const roleAllList = {
  "user": "组员",
  "admin": "管理员",
  "checker": "一兆韦德"
};
export const reportList = [{
  "api": "ReportUsedDtl",
  "title": "领用登记明细表",
  "type": "day",
  "span": false,
}, {
  "api": "ReportUsedDay",
  "title": "领用统计日报表",
  "type": "day",
  "span": true,
}, {
  "api": "ReportUsedMonth",
  "title": "领用统计月报表",
  "type": "month",
  "span": true,
}, {
  "api": "ReportDayCheck",
  "title": "勾稽关系统计表",
  "type": "day",
  "span": true,
// }, {
//   "api": "ReportUsedSportMonth",
//   "title": "活动券分项领用月报表",
//   "type": "month",
//   "span": false,
}
];
const allRoleTabUrls = {
  ScanHistory: {
    "id": "ScanHistory",
    "url": "/pages/scan-history/index",
    "title": "扫描历史",
    "image": scanHistory,
    "selectedImage": scanHistoryActive,
  },
  TicketPackage: {
    "id": "TicketPackage",
    "url": "/pages/ticket-package/index",
    "title": "票券夹",
    "image": ticketPackage,
    "selectedImage": ticketPackageActive,
  },
  TicketGather: {
    "id": "TicketGather",
    "url": "/pages/ticket-gather/index",
    "title": "票券扫描",
    "image": ticketScan,
    "selectedImage": ticketScanActive,
  },
  TicketManage: {
    "id": "TicketManage",
    "url": "/pages/ticket-manage/index",
    "title": "票券管理",
    "image": ticketManage,
    "selectedImage": ticketManageActive,
  },
  TicketScan: {
    "id": "TicketScan",
    "url": "/pages/ticket-scan/index",
    "title": "票券扫描",
    "image": ticketScan,
    "selectedImage": ticketScanActive,
  },
  TicketSignIn: {
    "id": "TicketSignIn",
    "url": "/pages/ticket-sign-in/index",
    "title": "运动打卡",
    "image": ticketScan,
    "selectedImage": ticketScanActive,
  },
  TicketHistory: {
    "id": "TicketHistory",
    "url": "/pages/ticket-history/index",
    "title": "打卡记录",
    "image": ticketPackage,
    "selectedImage": ticketPackageActive,
  },
  UserManage: {
    "id": "UserManage",
    "url": "/pages/user-manage/index",
    "title": "用户管理",
    "image": userManage,
    "selectedImage": userManageActive,
  },
  UserInfo: {
    "id": "UserInfo",
    "url": "/pages/user-info/index",
    "title": "个人中心",
    "image": userInfo,
    "selectedImage": userInfoActive,
  },
};
/**
 * 每个角色的可访问页面
 * @type {{other: {iconType: string, id: string, title: string, url: string}[], admin: *[], checker: *[], user: *[]}}
 */
export const roleTabUrls = {
  "other": [
    allRoleTabUrls.UserInfo
  ],
  "user": [
    allRoleTabUrls.TicketSignIn,
    // allRoleTabUrls.TicketHistory,
    allRoleTabUrls.UserInfo,
  ],
  "admin": [
    allRoleTabUrls.TicketManage,
    allRoleTabUrls.UserManage,
    allRoleTabUrls.UserInfo,
  ],
  "checker": [
    allRoleTabUrls.TicketGather,
    allRoleTabUrls.ScanHistory,
    allRoleTabUrls.UserInfo,
  ]
};
/**
 * 用户绑定页面
 * @type {string}
 */
export const defaultBindUrl = "/pages/user-bind/index";
/**
 * 用户授权页面
 * @type {string}
 */
export const defaultAuthUrl = "/pages/user-auth/index";
/**
 * 每个角色的默认页面路径
 * @type {{other: string, admin: string, checker: string, user: string}}
 */
export const defaultRoleUrl = {
  "other": roleTabUrls["other"][0].url,
  "user": roleTabUrls["user"][0].url,
  "admin": roleTabUrls["admin"][0].url,
  "checker": roleTabUrls["checker"][0].url,
};

