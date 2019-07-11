import Taro from '@tarojs/taro'

const getCurrentPageUrl = () => {
    let pages = Taro.getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = currentPage.route;
    return url;
};

export default getCurrentPageUrl;
