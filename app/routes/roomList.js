/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import Common from '../common/index';
const { myToast } = Common;

class RoomList extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.formatRooms = this.formatRooms.bind(this);
        // 初始状态
        this.state = {
            rooms: [],
            rollbacks: [],
        };
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({type: 'rooms/getRooms'})
        dispatch({
            type: 'rooms/rollbackRules',
            callback: (rollbacks)=>{
                this.setState({rollbacks});
            }
        })
    }

    formatRooms(rooms){

        const {roomType} = this.props;

        rooms = rooms.filter((room)=>room.room_type == roomType);

        rooms = rooms.map((room, index)=>{
            const {level} = room;
            let secondText = 3;
            let rollback = this.state.rollbacks.filter(rollback=>rollback.rule_level == level);
            if(rollback.length > 0){
                rollback = rollback[0];
                let rates = [];
                for(let key of Object.keys(rollback)){
                    if(key.indexOf('rate') > -1){
                        rates.push(rollback[key]);
                    }
                }
                rates.sort((a,b)=>b-a);
                secondText = rates[0]
            }

            room.img = this.getRoomImg(level);
            room.title = this.getRoomLevel(level);
            room.secondText = `最高回水${secondText}%`;
            room.color = this.getRoomColor(level);
            return room;
        });

        return rooms;
    }

    getRoomImg(level){
        if(level == 1) return require(`../asset/level_1.png`);
        if(level == 2) return require(`../asset/level_2.png`);
        if(level == 3) return require(`../asset/level_3.png`);
    }

    getRoomLevel(level){
        if(level == 1) return '初级房';
        if(level == 2) return '中级房';
        if(level == 3) return '高级房';
    }

    getRoomColor(level){
        if(level == 1) return '#82CF00';
        if(level == 2) return '#7ECFAF';
        if(level == 3) return '#D31F11';
    }

    joinRoom(room){

        const {room_type, title, id, status} = room;

        if(status == -1) {
            myToast('该房间已暂时关闭,请进入其他房间进行游戏', 4);
            return;
        }

        const str = room_type == 1 ? '北京' : '加拿大';

        Actions.room({title: str+title, roomId: id});
    }

    render(){

        let {rooms} = this.props.rooms;

        rooms = this.formatRooms(rooms);

        return (
           <View style={styles.container}>
               {rooms.map((room,index) => (
                   <TouchableOpacity
                       onPress={()=>{this.joinRoom(room)}}
                       activeOpacity={0.8} style={[styles.card,{marginTop: index == 0?12:6}]} key={index}>
                        <View style={{flex: 2,paddingTop: 40,paddingLeft: 30}}>
                            <Text
                                style={{fontSize: 28,color: room.color,marginBottom: 4}}
                            >{room.title}</Text>
                            <Text
                                style={{fontSize: 18,color: room.color}}
                            >({room.secondText})</Text>
                            <TouchableOpacity
                                onPress={()=>{
                                    Actions.rateExplain({
                                    commonId: room.special_game_rule_id,
                                    combineId: room.combine_special_rule_id,
                                    }
                                )}}
                                activeOpacity={0.8}
                                style={{marginTop: 10,marginLeft: 10,height: 22,borderWidth: 0,
                            borderRadius: 4,borderColor: '#71DC35',width: 65,alignItems: 'center',
                             justifyContent: 'center', backgroundColor: '#F84641',}}>
                                <Text style={{color: 'white',fontSize: 12}}>赔率说明</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, padding: 20}}>
                            <Image source={room.img} style={{width: '100%',height: '100%',borderRadius: 5}}/>
                        </View>

                   </TouchableOpacity>
               ))}
           </View>
        )
    }
}
const {height, width, paddingTop} = Common.window;
const pageHeight = height - 50;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: pageHeight,
        flexDirection: 'column',
        paddingTop: paddingTop,
    },
    card: {
        flex: 1,
        //width: '100%',
        borderWidth: 2,
        borderColor: '#DEDEDE',
        margin: 8,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: 'row'
    },
    sceneStyle: {
        backgroundColor: 'black'
    },
    titleStyle: {
        backgroundColor: 'black'
    },
    actImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    }
});

const mapStateToProps = ({rooms}) => {
    return {rooms};
};

export default connect(mapStateToProps)(RoomList);

