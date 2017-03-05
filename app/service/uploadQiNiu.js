/**
 * Created by chengyuan on 16/11/7.
 */
import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';

Conf.ACCESS_KEY = 'cM-AFFTWHkIZRWbovHlrttKO_gyCS57ENlzYmLQo';
Conf.SECRET_KEY = 'By-1TOfX9_o8HbzFRvXZDwaFMYrs9scByxHLKR33';
const bucket = 'ycy-first';
const host = 'http://img.youcyou.com/';

export default uploadQiNiu = (imgPath,successCallBack)=>{

    let timestamp = new Date().getTime(),
        type = imgPath.split('.')[1],
        key = timestamp+'.'+type;

    let putPolicy = new Auth.PutPolicy2(
        {
            scope: bucket+":"+key
        }
    );

    let uptoken = putPolicy.token();
    let formInput = {
        key : key,
        // formInput对象如何配置请参考七牛官方文档“直传文件”一节
    }

    return Rpc.uploadFile(imgPath, uptoken, formInput)
        .then((response) => response.text())
        .then((responseText) => {
            let result = JSON.parse(responseText);
            let imgUrl = host+result.key;;
            if(successCallBack){
                successCallBack(imgUrl);
            }else{
                console.log('-----');
                console.log(result);
                return imgUrl;
            }
        })
        .catch((err) => {
            console.log(err);
            return 'error';
        });
}

