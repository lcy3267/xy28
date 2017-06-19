import api from '../config/api';
import {sendRequest} from '../service/request';


export default {
    namespace: 'rooms',

    state: {
        rooms: [],
        modalVisible: false
    },

    effects: {
        *getRooms({callback},{put}) {
            let rs = yield sendRequest(api.rooms.getRooms);
            if(rs && rs.err_code == 0){
                yield put({type: 'setRooms', rooms: rs.rooms});
            }
        },
        *getRoomInfo({params, callback}) {
            let rs = yield sendRequest(api.rooms.getRoomInfo, params);
            if(rs && rs.err_code == 0){
                callback && callback(rs.room);
            }
        },
        *updateModal({modalVisible}, {put}){
            yield put({type: 'setModalStatus', modalVisible});
        },
        *rollbackRules({callback},{put}){
            let rs = yield sendRequest(api.rooms.rollbackRules);
            if(rs && rs.err_code == 0){
                callback && callback(rs.rules);
            }
        },
        *specialGameRuleInfo({params, callback},{put}){
            let rs = yield sendRequest(api.rooms.specialGameRuleInfo, params);
            if(rs && rs.err_code == 0){
                callback && callback(rs.rules);
            }
        },
    },

    reducers: {
        setRooms(state, {rooms}){
            return {...state, rooms}
        },
        setModalStatus(state, {modalVisible}){
            return {...state, modalVisible}
        }
    },
}