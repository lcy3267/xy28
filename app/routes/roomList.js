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

class RoomList extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.formatRooms = this.formatRooms.bind(this);
        // 初始状态
        this.state = {
            rooms: []
        };
    }

    componentWillMount() {
        const {dispatch} = this.props;

        dispatch({type: 'rooms/getRooms'})
    }

    formatRooms(rooms){

        const {roomType} = this.props;

        rooms = rooms.filter((room)=>room.room_type == roomType);

        rooms = rooms.map((room, index)=>{
            const {level, is_speak, status} = room;
            room.img = this.getRoomImg(level);
            room.title = this.getRoomLevel(level);
            room.secondText = '最该回水18%';
            room.color = this.getRoomColor(level);
            return room;
        });

        return rooms;
    }

    getRoomImg(level){
        if(level == 1) return require(`../asset/level_1.jpg`);
        if(level == 2) return require(`../asset/level_2.jpg`);
        if(level == 3) return require(`../asset/level_3.jpg`);
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

        const {room_type, title, id, is_speak, status} = room;

        if(status == -1) {
            Toast.info('该房间已暂时关闭,请进入其他房间进行游戏', 4);
            return;
        }

        const str = room_type == 1 ? '北京' : '加拿大';

        Actions.room({title: str+title,roomId: id, roomType: room_type, isSpeak: is_speak});
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

const pageHeight = Common.window.height - 50;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        flexDirection: 'column',
        paddingTop: 65,
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

