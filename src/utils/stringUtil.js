/**
 * 字符串相关函数
 */

/**
  * 在状态数组中找到某个状态对应的描述
  * @param {*} optionList 状态列表，每项包含(value和label)
  * @param {*} value 具体值
  * @return 返回当前值对应的描述
  */
export function mappingState(optionList, value) {
  let result = '';
  const state = optionList.filter((item) => {
    if(value == '0') {
      return item.value == '0';
    } else {
      return item.value == value;
    }
  });

  if (state.length > 0) {
    result = state[0].label;
  } else {
    result = ``;
  }
  return result;
}

export function trimLeft(val) {
  if (val) {
    return val.replace(/(^\s*)/g, '');
  } else {
    return val;
  }
}

export function trimRight(val) {
  if (val) {
    return val.replace(/(\s*$)/g, '');
  } else {
    return val;
  }
}

export function trim(val) {
  if (val) {
    return val.replace(/(^\s*) | (\s*$)/g, '');
  } else {
    return val;
  }
}

export function GetUrlRelativePath() {
  let url = document.location.toString();
  let arrUrl = url.split("//");
  let start = arrUrl[1].indexOf("/");
  let relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
  if(relUrl.indexOf("?") != -1){
    relUrl = relUrl.split("?")[0];
  }
  return relUrl;
}
