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

        if(value == 1) Actions.betRecord();
        if(value == 2) Actions.withdrawRecord();
        if(value == 3) {
            let roomType = title.indexOf('北京') > -1 ? 1 : 2;
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

        return (
            <Popover
                visible={true}
                mask={true}
                onVisibleChange={this.handleVisibleChange}
                overlayStyle={{marginTop: 30,right: 20,width: 100}}
                onSelect={this.onSelect}
                overlay={[
              (<Item key="4" value="1" style={styles.item}>
              <Icon name="md-add" color={color} size={18} style={{marginRight: 10}}/>
              <Text style={{color}}>投注记录</Text>
              </Item>),
              (<Item key="5" value="2" style={styles.item}>
              <Icon name="md-add" color={color} size={18} style={{marginRight: 10}}/>
              <Text style={{color}}>玩法介绍</Text>
              </Item>),
              (<Item key="6" value="3" style={styles.item}>
                <Icon name="md-add" color={color} size={18} style={{marginRight: 10}}/>
                <Text style={{color}}>走势图</Text>
              </Item>),
            ]}
            >
                <Icon name="md-add" color='white' size={25} />
            </Popover>
        )
    }

}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        padding: 0,
        height: 30,
        marginLeft: 10,
        alignItems: 'center',
    },
});


