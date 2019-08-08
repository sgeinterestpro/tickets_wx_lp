/**
 * muumlover@2019-05-27
 * 配置文件
 */

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
  "badminton":
    "https://i.loli.net/2019/08/08/NjoBlAgLTumqM1D.png",
  "basketball":
    "https://i.loli.net/2019/08/08/2PawFm9ysYNVD8T.png",
  "football":
    "https://i.loli.net/2019/08/08/gmDIlz83qvsQFSW.png",
  "swim":
    "https://i.loli.net/2019/08/08/LAxzrWZ2ghEsm1w.png",
  "yoga":
    "https://i.loli.net/2019/08/08/ukd7i1Nft6IDUgE.png",
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
}, {
  "api": "ReportUsedDay",
  "title": "领用登记日报表",
  "type": "day span",
}, {
  "api": "ReportUsedMonth",
  "title": "领用登记月报表",
  "type": "month span",
}, {
  "api": "ReportUsedSportMonth",
  "title": "活动券分项领用月报表",
  "type": "month",
}
];
const allRoleTabUrls = {
  ScanHistory: {
    "id": "ScanHistory",
    "url": "/pages/scan-history/index",
    "title": "扫描历史",
    "image": "https://i.loli.net/2019/08/08/hKdLTinVX1GwcOW.png",
    "selectedImage": "https://i.loli.net/2019/08/08/rb2zVtJikRosm1x.png",
  },
  TicketList: {
    "id": "TicketList",
    "url": "/pages/ticket-package/index",
    "title": "票券夹",
    "image": "https://i.loli.net/2019/08/08/aC2e9tODxJQN7UE.png",
    "selectedImage": "https://i.loli.net/2019/08/08/B6EidyT4f7NSXlL.png",
  },
  TicketManage: {
    "id": "TicketManage",
    "url": "/pages/ticket-manage/index",
    "title": "票券管理",
    "image": "https://i.loli.net/2019/08/08/UrFGWdbCX3BlmD2.png",
    "selectedImage": "https://i.loli.net/2019/08/08/vcuFAHbZMaEXKhz.png",
  },
  TicketScan: {
    "id": "TicketScan",
    "url": "/pages/ticket-scan/index",
    "title": "票券扫描",
    "image": "https://i.loli.net/2019/08/08/uRKQDE7pMlgtOvF.png",
    "selectedImage": "https://i.loli.net/2019/08/08/vV4s3mL7uxFGwIb.png",
  },
  UserManage: {
    "id": "UserManage",
    "url": "/pages/user-manage/index",
    "title": "用户管理",
    "image": "https://i.loli.net/2019/08/08/N3hn5xOVP4R9kzY.png",
    "selectedImage": "https://i.loli.net/2019/08/08/ZHmKcYgn6pASoyz.png",
  },
  UserInfo: {
    "id": "UserInfo",
    "url": "/pages/user-info/index",
    "title": "用户中心",
    "image": "https://i.loli.net/2019/08/08/w9Ph5CsHEW3aGJp.png",
    "selectedImage": "https://i.loli.net/2019/08/08/fM453Q9aWw8cDZq.png",
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
    allRoleTabUrls.TicketList,
    allRoleTabUrls.UserInfo,
  ],
  "admin": [
    allRoleTabUrls.TicketManage,
    allRoleTabUrls.UserManage,
    allRoleTabUrls.UserInfo,
  ],
  "checker": [
    allRoleTabUrls.TicketScan,
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
  "other": "/pages/user-info/index",
  "user": "/pages/ticket-package/index",
  "admin": "/pages/ticket-manage/index",
  "checker": "/pages/ticket-scan/index"
};

