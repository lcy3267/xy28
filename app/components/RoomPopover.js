/**
 * Created by chengyuan on 2017/6/3.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Popover, } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
const Item = Popover.Item;

export default class RoomPopover extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        state = {
            visible: false,
            selected: '',
        };
    }

    onSelect = (value) => {
        const {title} = this.props;
        let roomType = title.indexOf('北京') > -1 ? 1 : 2;


        if(value == 1) Actions.betRecord();
        if(value == 2) {
            Actions.playExplain({infoType: roomType})
        };
        if(value == 3) {
            Actions.trend({roomType});
        };
    };

    handleVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };

    render(){
        const color = '#3399FF';
        const textStyle = {
            color: '#3399FF',
            fontSize: 15,
        }

        return (
            <Popover
                onVisibleChange={this.handleVisibleChange}
                overlayStyle={{marginTop: 30,right: 20,width: 120}}
                onSelect={this.onSelect}
                overlay={[
              (<Item key="4" value="1" style={styles.item}>
              <Icon name="ios-recording-outline" color={color} size={18} style={{marginRight: 10}}/>
              <Text style={textStyle}>投注记录</Text>
              </Item>),
              (<Item key="5" value="2" style={styles.item}>
              <Icon name="ios-game-controller-b-outline" color={color} size={18} style={{marginRight: 10}}/>
              <Text style={textStyle}>玩法介绍</Text>
              </Item>),
              (<Item key="6" value="3" style={[styles.item,{borderWidth: 0}]}>
                <Icon name="md-trending-up" color={color} size={18} style={{marginRight: 10}}/>
                <Text style={textStyle}>走势图</Text>
              </Item>),
            ]}
            >
                <View style={{height: 35, width: 60, alignItems: 'flex-end'}}>
                    <Icon name="md-add" style={{marginRight: 10}} color='white' size={25} />
                </View>
            </Popover>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        padding: 0,
        height: 40,
        marginLeft: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC'
    },
});


