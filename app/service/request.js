import Config from '../config';
import { Toast } from 'antd-mobile';
import * as Storage from '../service/storage';
import {storageKey} from '../config';

const apiDomain = Config.apiDomain;
const timeout = 15000;

function filterJSON(res) {
	let result = JSON.parse(res);
	console.log('返回数据');
	console.log(result);
	return result;
}

function filterStatus(res) {
	if (res.ok) {
		return res;
	} else {
		Toast.info('系统出错');
		throw new Error('server handle error');
	}
}

//设置请求的超时时间
function timeoutFetch(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("fetch time out"));
    }, ms);
	  //成功
    promise.then(
      (res) => {
		  clearTimeout(timer);
        resolve(res);
      },
		//失败
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  })
}
//成功则返回json数据
//失败则抛出错误
export async function request(uri, type = "GET", data = ""){
	uri = apiDomain + uri;

	let token = await Storage.getItem(storageKey.token);

	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Token': token
	};

	let fetchOption = {
		method: type,
		headers: headers
	};


	if(type === "POST"|| type === "PUT"){
		fetchOption.body = JSON.stringify(data);
	}else if(type == "GET"){
		if(data){
			uri += '?';
			for (var key of Object.keys(data)) {
				uri = `${uri}${key}=${data[key]}&`;
			}
		}
	}

	if(__DEV__){
		console.debug("fetch data from uri:"+ uri);
		console.log("data:");
		console.log(data);
	}

	return timeoutFetch(timeout, fetch(uri, fetchOption))
		.then(filterStatus)
		.then((response) => response.text())
		.then(filterJSON)
		.catch(function (error) {
			console.log("请求出错啦");
			console.log(error);
			//throw error;
			return false;
		});
}

export function get(uri, data = null) {
	return request(uri, "GET", data);
}

export function put(url,data){
	return request(url,"PUT",data);
}

export function post(uri, data = "") {
	return request(uri, "POST", data);
}


export function remove(uri) {
	return request(uri, "DELETE");
}

export function sendRequest(uri,params=null){
	var method = uri.split(" ")[0];
	uri = uri.split(" ")[1];
	let rs;
	switch (method.toLowerCase()){
		case 'get': rs = get(uri,params);break;
		case 'post': rs = post(uri,params);break;
		case 'put': rs = put(uri,params);break;
		case 'delete': rs = remove(uri);break;
	}
	return rs;
}