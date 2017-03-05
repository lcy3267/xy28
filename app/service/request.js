import Config from '../config';
import {toastShort} from '../common/ToastUtil'

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
		toastShort('系统出错');
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
export function request(uri, type = "GET", headers = {}, data = ""){
	uri = apiDomain + uri;
	let fetchOption = {
		method: type,
		headers: headers
	};

	if(type === "POST"|| type === "PUT"){
		fetchOption.body = JSON.stringify(data);
	}

	if(__DEV__){
		//console.debug("fetch data from uri:"+ uri);
		//console.log("fetch data from uri:");
		//console.log(uri);
		//console.log("type");
		//console.log(type);
		//console.log("headers:");
		//console.log(headers);
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

export function get(uri, data = null, headers = {}) {
	let newUrl = uri;
	if(data){
		newUrl += '?';
		for (var key of Object.keys(data)) {
			newUrl = `${newUrl}${key}=${data[key]}&`;
		}
	}
	return request(newUrl, "GET", headers);
}

export function put(url,data){
	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	};
	return request(url,"PUT",headers,data);
}

export function post(uri, data = "", headers = {}) {
	if(!headers["Content-type"]){
		headers["Content-type"] = 'application/x-www-form-urlencoded';
	}
	return request(uri, "POST", headers, data);
}


export function remove(uri, headers = {}) {
	return request(uri, "DELETE", headers);
}

export function sendRequest(uri,method,params){
	switch (method){
		case 'get':return get(uri,params);
		case 'post':return post(uri,params);
		case 'put':return put(uri,params);
		case 'delete':return remove(uri);
	}
}