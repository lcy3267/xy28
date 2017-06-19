/**
 * Created by chengyuan on 16/11/7.
 */
import {Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';

Conf.ACCESS_KEY = 'Rd3aSJUqZt08Bf4uzWCHCCbWnvi6QQvo6IQmDQxZ';
Conf.SECRET_KEY = 'ncrGFoReho9sSnV1gIfow_kx4iB-GWHef6GV3WSj';
const bucket = 'xy28';
const host = 'http://orssjk9xe.bkt.clouddn.com/';


export default uploadQiNiu = async(imgPath,successCallBack)=>{


    let timestamp = new Date().getTime(),
        type = imgPath.split('.')[1],
        key = timestamp+'.'+type;

    let putPolicy = new Auth.PutPolicy2(
        {
            scope: bucket+":"+key
        }
    );

    let uptoken = putPolicy.token();

    const formData = new FormData();
    formData.append('token', uptoken);
    formData.append('file', {uri: imgPath, type: 'application/octet-stream', name: key});
    formData.append('key', key);

    return fetch('http://upload.qiniu.com',{
        method: 'POST',
        body: formData,
    })
    .then((response) => response.text() )
    .then((responseData)=>{
        return host+JSON.parse(responseData).key;
    });
}


