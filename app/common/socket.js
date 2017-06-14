/**
 * Created by chengyuan on 2017/6/14.
 */
import SocketIOClient from "socket.io-client";
import Config from '../config/index';
let socket = {};

export default connectSocket = (dispatch, token)=>{
    console.log('----------',dispatch);
    if(!socket.id){
        //链接房间
        socket = SocketIOClient(Config.apiDomain+'/app', {jsonp: false});

        socket.emit("login",{token});

        socket.on('login',()=>{
            console.log('connetd success');
        });

        socket.on('newMsg', ()=>{
            dispatch({type: 'user/updateMsg'});
        });
    }
}