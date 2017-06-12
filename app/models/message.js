import api from '../config/api';
import {sendRequest} from '../service/request';
import * as Storage from '../service/storage';
import {storageKey} from '../config';

export default {
    namespace: 'message',

    state: {
        systemMsgList: [],
        userMsgList: [],
        hasNoReadMsg: false,
    },

    effects: {
        *messageList({ params, callback }, { put, select }) {
            params.pageSize = 20;
            const path = params.type == 1?api.message.systemList : api.message.userMessages;
            let rs = yield sendRequest(path, params);
            if(rs && rs.err_code == 0){
                let messages = params.type == 1?rs.systemList:rs.userMessages;

                let readMessages = yield Storage.getItem(storageKey.readMessages);

                if(params.pageIndex == 1){
                    readMessages = readMessages?readMessages:[];
                    messages = messages.map((msg)=>{
                        if(readMessages.indexOf(msg.id) == -1){
                            msg.noRead = true;
                        }
                        return msg;
                    });
                }
                if(params.type == 1){
                    yield put({
                        type: 'setSystemMsgList' ,
                        systemMsgList: messages,
                        loadMore: params.pageIndex != 1,
                    });
                }else{
                    yield put({
                        type: 'setUserMsgList' ,
                        userMsgList: messages,
                        loadMore: params.pageIndex != 1,
                    });
                }
                callback && callback(messages);

                if(params.pageIndex == 1){
                    yield put({type: 'updateOutRead', readMessages});
                }
            }
        },
        *updateOutRead({readMessages},{select, put}){
            let hasNoReadMsg = false;
            let {systemMsgList, userMsgList} = yield select(state=>state.message);
            let myMessage = systemMsgList.concat(userMsgList);
            myMessage.map((msg)=>{
                if(readMessages.indexOf(msg.id) == -1){
                    hasNoReadMsg = true;
                    return false;
                }
            });
            yield put({type: 'hasNoReadMsg', hasNoReadMsg});
        },
        *detail({ params, msgType, callback }, { put, select }) {
            let rs = yield sendRequest(api.message.detail, params);
            if(rs && rs.err_code == 0){
                let readMessages = yield Storage.getItem(storageKey.readMessages);
                readMessages = readMessages?readMessages:[];

                let {systemMsgList, userMsgList, hasNoReadMsg} = yield select(state=>state.message);

                if(readMessages.indexOf(params.id) == -1){
                    readMessages.push(params.id);
                    yield Storage.setItem(storageKey.readMessages, readMessages);
                    if(msgType == 1){
                        systemMsgList = systemMsgList.map((msg)=>{
                            if(msg.id == params.id) msg.noRead = false;
                            return msg
                        });
                        yield put({type: 'setSystemMsgList', systemMsgList});
                    }else{
                        userMsgList = userMsgList.map((msg)=>{
                            if(msg.id == params.id) msg.noRead = false;
                            return msg
                        });
                        yield put({ type: 'setUserMsgList', userMsgList});
                    }
                }
                //遍历外出小红点
                if(hasNoReadMsg) {
                    yield put({type: 'updateOutRead', readMessages});
                }
                callback && callback(rs.info);
            }
        },
    },

    reducers: {
        setSystemMsgList(state,{ systemMsgList, loadMore }) {
            if(loadMore){
                let data = state.systemMsgList;
                systemMsgList = data.concat(systemMsgList);
            }
            return {...state, systemMsgList}
        },
        setUserMsgList(state,{ userMsgList, loadMore }) {
            if(loadMore){
                let data = state.userMsgList;
                userMsgList = data.concat(userMsgList);
            }
            return {...state, userMsgList}
        },
        hasNoReadMsg(state, {hasNoReadMsg}){
            return {...state, hasNoReadMsg}
        }
    },
}