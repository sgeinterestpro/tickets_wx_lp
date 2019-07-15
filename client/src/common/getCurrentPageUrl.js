import Taro from "@tarojs/taro"

const getCurrentPageUrl = () => {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage.route;
};

export default getCurrentPageUrl;
