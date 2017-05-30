/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
export const formatDateString = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = parseInt(date.getMonth()) + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const formatStringWithHtml = (originString) => {
  const newString = originString.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return newString;
};

export const GetDateStr = (AddDayCount)=>{
  var dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth()+1;//获取当前月份的日期
  var d = dd.getDate();
  return y+"-"+m+"-"+d;
}

export const formatDate =  (date,fmt) => {
  //console.log(this);
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
};

export const getDate = (date)=>{
  date = new Date(date);
  return formatDate(date,'yyyy-MM-dd hh:mm');
}


export const formatAgreedDate = (date) =>{
  let a = date.split(" ");
  return a[0]+"T"+a[1]+":00+08:00";
};

//获取前端展示的时间,如2016-11-02 17:33
export function getFrontDate(backDate){
  let newDate = new Date(backDate);
  return formatDate(newDate,'yyyy-MM-dd hh:mm');
}

export function getFrontDateOnly(backDate){
  let newDate = new Date(backDate);
  return formatDate(newDate,'yyyy-MM-dd');
}

export function getFrontTimeOnly(backDate){
  let newDate = new Date(backDate);
  return formatDate(newDate,'hh:mm');
}

export function dataFormat(date) {
  let newDate = new Date(date);
  newDate = formatDate(newDate,'MM-dd hh:mm');
  let dataArr = newDate.split(' ');
  return dataArr;
}

export function compareDate(date){
  //console.log(date);
  var result;
  var timestamp = Date.parse(new Date());
  timestamp = timestamp/1000;
  //console.log('当前时间戳'+timestamp);
  var timestamp2 = Date.parse(new Date(date));
  timestamp2 = timestamp2 / 1000;
  if(timestamp>timestamp2){
    result = true;
  }else{
    result = false;
  }
  //console.log(stringTime + "的时间戳为：" + timestamp2)
  return result;
}
