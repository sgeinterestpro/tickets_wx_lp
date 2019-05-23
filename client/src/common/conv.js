const class_table = {
  100: '羽毛球',
  101: '篮球',
  102: '足球',
  103: '游泳',
  104: '瑜伽',
};
const ClassType = {
  getCodeList: () => {
    return Object.keys(class_table)
  },
  getNameList: () => {
    return Object.values(class_table)
  },
  getName: (code) => {
    return class_table[code]
  }

};

export {ClassType}
