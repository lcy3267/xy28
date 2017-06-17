/**
 * Created by chengyuan on 2017/6/3.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Popover, } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import Common from '../common/index';
import { connect } from 'dva';



const {height, width} = Common.window;


class RoomPopover extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            visible: false,
            selected: '',
        };
    }

    updateModal = ()=>{
        let {rooms: {modalVisible}, dispatch} = this.props;
        dispatch({
            type: 'rooms/updateModal',
            modalVisible: !modalVisible
        });
    }

    render(){
        return (
            <View>
                <Icon onPress={this.updateModal} name="md-add" style={{marginRight: 10}} color='white' size={25} />
            </View>
        )
    }
}
const mapStateToProps = ({rooms}) => {
    return {rooms};
};

export default connect(mapStateToProps)(RoomPopover);


