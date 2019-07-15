/**
 * muumlover@2019-05-27
 * 配置文件
 */

/**
 * 角色列表
 * @type {{admin: string, checker: string, user: string}}
 */
export const roleAllList = {
  "user": "组员",
  "admin": "管理员",
  "checker": "一兆韦德"
};
/**
 * 每个角色的可访问页面
 * @type {{other: {iconType: string, id: string, title: string, url: string}[], admin: *[], checker: *[], user: *[]}}
 */
export const roleTabUrls = {
  "other": [
    {"id": "UserInfo", "url": "/pages/user-info/index", "title": "用户中心", "iconType": "user"}
  ],
  "user": [
    {"id": "TicketList", "url": "/pages/ticket-package/index", "title": "票券夹", "iconType": "tags"},
    {"id": "UserInfo", "url": "/pages/user-info/index", "title": "用户中心", "iconType": "user"}
  ],
  "admin": [
    {"id": "TicketManage", "url": "/pages/ticket-manage/index", "title": "票券管理", "iconType": "money"},
    {"id": "UserManage", "url": "/pages/user-manage/index", "title": "用户管理", "iconType": "folder"},
    {"id": "UserInfo", "url": "/pages/user-info/index", "title": "用户中心", "iconType": "user"}
  ],
  "checker": [
    {"id": "TicketScan", "url": "/pages/ticket-scan/index", "title": "票券使用", "iconType": "search"},
    {"id": "UserInfo", "url": "/pages/user-info/index", "title": "用户中心", "iconType": "user"}
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
/**
 * 运动项目类型代码显示
 * @type {{"100": string, "101": string, "102": string, "103": string, "104": string}}
 */
export const ticketClass = {
  'badminton': '羽毛球',
  'basketball': '篮球',
  'football': '足球',
  'swim': '游泳',
  'yoga': '瑜伽',
};
/**
 * 票券状态代码显示
 * @type {{expired: string, unused: string, used: string}}
 */
export const ticketState = {
  "unused": "未使用",
  "expired": "已过期",
  "used": "已使用"
};

export const ticketOption = {
  "purchase": "领取",
  "refund": "退还",
  "checked": "使用"
};

