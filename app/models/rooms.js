import api from '../config/api';
import {sendRequest} from '../service/request';


export default {
    namespace: 'rooms',

    state: {
        rooms: [],
    },

    effects: {
        *getRooms({callback},{put}) {
            let rs = yield sendRequest(api.rooms.getRooms);
            if(rs && rs.err_code == 0){
                //callback && callback(rs.rooms)
                yield put({type: 'setRooms', rooms: rs.rooms});
            }
        },
    },

    reducers: {
        setRooms(state, {rooms}){
            return {...state, rooms}
        }
    },
}