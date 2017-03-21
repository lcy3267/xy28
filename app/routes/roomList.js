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
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import Common from '../common/index';
import MyHead from '../components/Head';

const rooms = [
    {img: require('../asset/one.jpg'), title: '初级房', secondText: '高赔率1%~3%回水', color: '#82CF00', roomId: 'bj001'},
    {img: require('../asset/two.jpg'), title: '中级房', secondText: '最高回水18%', color: '#7ECFAF', roomId: 'bj003'},
    {img: require('../asset/th.jpg'), title: '高级房', secondText: '最该回水18%', color: '#D31F11', roomId: 'bj003'},
]

class RoomList extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {};
    }

    render(){
        const {count,dispatch} = this.props;
        return (
           <View style={styles.container}>
               {rooms.map((room,index) => (
                   <TouchableOpacity
                       onPress={()=>{Actions.room({roomId: room.roomId})}}
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

const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps)(RoomList);

