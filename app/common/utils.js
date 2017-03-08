/**
 * Created by ljunb on 16/5/27.
 */

import React, {
    NetInfo,
    Linking
} from 'react-native';

let Util = {
    /*
     * fetch简单封装
     * url: 请求的URL
     * successCallback: 请求成功回调
     * failCallback: 请求失败回调
     * 
     * */
    get: (url, successCallback, failCallback) => {
        console.log("请求地址:" + url);
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            })
            .catch((err) => {
                failCallback(err);
            });
    },

    put: (url,data, successCallback, failCallback) => {

        console.log("put请求地址:" + url);

        var headers = {};

        let fetchOption = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        if(true){
            console.log("fetch data from uri:");
            console.log(url);
           // console.log("headers:");
           // console.log(headers);
            console.log("data:");
            console.log(data);
        }

        fetch(url,fetchOption)
            .then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            })
            .catch((err) => {
                failCallback(err);
            });

    },
};

export default Util;

export function openLink(uri){
    Linking.canOpenURL(uri).then(supported=> {
            if (supported) {
                return Linking.openURL(uri)
            }
        })
        .catch(err=> {
            console.warn('cannot open uri: '+ uri);
        })
}
