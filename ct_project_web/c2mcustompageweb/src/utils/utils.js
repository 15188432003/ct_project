/**
 * 将number保留bitNum位小数，不够补0
 * @param number
 * @param bitNum
 * @returns {string|number}
 */

export const name2Url = (name) => {
  let url = name
    .replace(/\x20*-\x20*/g, "-")
    .replace(/\x20*_\x20*/g, "_")
    .replace(/\x20+/g, "_");
  return url;
};

export function changeDecimal(number, bitNum = 2) {
  var f_x = parseFloat(number);
  if (isNaN(f_x)) {
    return 0;
  }
  var s_x = number.toString();
  var pos_decimal = s_x.indexOf(".");

  //没有小数点的加上小数点
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    if (bitNum != 0) {
      s_x += ".";
    } else {
      //没有小数点还要保留0位小数
      return s_x;
    }
  }
  if (s_x.length <= pos_decimal + bitNum) {
    //eg:122 保留2位小数
    //return 122.00
    while (s_x.length <= pos_decimal + bitNum) {
      s_x += "0";
    }
  } else {
    //eg:1.222222  保留2位小数
    //return 1.22
    s_x = s_x.substring(0, pos_decimal + bitNum + 1);
  }

  return s_x;
}

// 欧几里得距离计算数组相似度
export function getAvg_XYSimlar(x, y) {
  let sum_XYSimlar = 0;
  for (let i = 0; i < x.length; i++) {
    //两个数的欧几里得距离
    let XYdistiance = Math.sqrt(Math.pow(x[i] - y[i], 2));
    // 欧氏距离定义的相似度, 距离越小相似度越大
    let XYSimlar = 1 / (1 + XYdistiance);
    // 获取相似度和
    sum_XYSimlar = sum_XYSimlar + XYSimlar;
  }
  let avg_XYSimlar = sum_XYSimlar / x.length;
  return avg_XYSimlar;
}

//计算商品交期
/*
                产品“最短交期”      产品“最长交期”      规格累加交期中最长时效      变体“最短交期”    变体“最长交期”      C2M系统前端页面 - Delivery Time    
三种交期都未维护    /                 /                 /                       /               /                 不显示Delivery Time

规格无“累加交期”    M                /                  /                       M               /                  Delivery Time:M Time
                /                 N                  /                        /               N                  Delivery Time:N Time
                M                 N                  /                        M               N                  Delivery Time:M-N Time

规格有“累加交期”  /                 /                   X                       /               X                   Delivery Time:X Time
                M                 N                   X                       /               N+x                  Delivery Time:N+X Time
               /                 N                    X                       /               N+x                  Delivery Time:N+X Time
               M                 /                    X                       /               M+x                  Delivery Time:M+X Time
*/

export const calculate_delivery_time = (product, variantOptions) => {
  // 查找选项最长交期
  console.log(product, variantOptions);
  let delivery_str = "Delivery Time: ";
  let time_str = "Days";
  let delivery_time = null;
  if (
    product.options &&
    product.options.length > 0 &&
    variantOptions &&
    variantOptions.length > 0
  ) {
    variantOptions.forEach((variantOptionsItem, variantOptionsIndex) => {
      if (
        product.options[variantOptionsIndex].values[variantOptionsItem] &&
        product.options[variantOptionsIndex].values[variantOptionsItem]
          .delivery_time
      )
        if (
          product.options[variantOptionsIndex].values[variantOptionsItem]
            .delivery_time > delivery_time
        ) {
          delivery_time =
            product.options[variantOptionsIndex].values[variantOptionsItem]
              .delivery_time;
        }
    });
  }

  // 三种交期都未维护
  if (
    // hasOwn 需要 chrome 版本2021/8 之后才兼容
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("minimum_delivery_date") &&
    !delivery_time
  ) {
    return "";
  }

  //规格无“累加交期”
  if (
    delivery_time == null &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${product.maximum_delivery_date} ${time_str}`;
  }

  if (
    delivery_time == null &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${product.minimum_delivery_date} ${time_str}`;
  }

  if (
    delivery_time == null &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${product.minimum_delivery_date}-${product.maximum_delivery_date} ${time_str}`;
  }

  // 规格有“累加交期”
  if (
    delivery_time != null &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${delivery_time} ${time_str}`;
  }

  if (
    delivery_time != null &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${
      delivery_time + product.maximum_delivery_date
    } ${time_str}`;
  }

  if (
    delivery_time != null &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${
      delivery_time + product.maximum_delivery_date
    } ${time_str}`;
  }

  if (
    delivery_time != null &&
    // eslint-disable-next-line no-prototype-builtins
    !product.hasOwnProperty("maximum_delivery_date") &&
    // eslint-disable-next-line no-prototype-builtins
    product.hasOwnProperty("minimum_delivery_date")
  ) {
    return `${delivery_str}${
      delivery_time + product.minimum_delivery_date
    } ${time_str}`;
  }
};
