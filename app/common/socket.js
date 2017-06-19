/**
 * Created by chengyuan on 2017/6/14.
 */
import SocketIOClient from "socket.io-client";
import Config from '../config/index';
let socket = {};

export default connectSocket = (dispatch, token)=>{
    if(!socket.id){
        //链接房间
        socket = SocketIOClient(Config.apiDomain+'/app', {jsonp: false});

        socket.emit("login",{token});

        socket.on('newMsg', ()=>{
            dispatch({type: 'user/updateMsg'});
        });

        //心跳包
        socket.palpitationTimer = setInterval(()=>{
            socket.emit("palpitation");
        },5000);

        socket.on('palpitation', (data)=>{
            let { result } = data;
            console.log(result,'-----')
            if(result != 'success'){
                socket.emit("login",{token});
            }
        });
    }else if(socket){
        socket.emit("login",{token});
    }
}