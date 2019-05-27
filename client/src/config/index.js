export const roleList = {
  "user": "组员",
  "admin": "管理员",
  "checker": "一兆韦德"
};
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
export const defaultAuthUrl = "/pages/user-auth/index";
export const defaultRoleUrl = {
  "other": "/pages/user-info/index",
  "user": "/pages/ticket-package/index",
  "admin": "/pages/ticket-manage/index",
  "checker": "/pages/ticker-scan/index"
};
export const ticketState = {
  "unused": "未使用",
  "expired": "已过期",
  "used": "已使用"
};

