/**
 * Created by chengyuan on 2017/3/11.
 */
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
import { List, Toast } from 'antd-mobile';
import Common from '../common/index';
const Item = List.Item;

class My extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    

    render(){
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row',padding: 10,backgroundColor: 'white',marginBottom: 20}}>
                    <View style={{flex: 1}}>
                        <Image source={require('../asset/two.jpg')}
                               style={{width: 68,height: 68}}
                        />
                    </View>
                    <View style={{flex: 3,justifyContent: 'center'}}>
                        <Text>阿远</Text>
                    </View>
                </View>
                <List>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >钱包</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >我的回水</Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >账变记录</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >游戏记录</Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={() => {}}
                    >关于</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >分享</Item>
                    <Item
                        onClick={() => {}}
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png" arrow="horizontal"
                    >设置</Item>
                </List>
            </View>
        )
    }
}

const pageHeight = Common.window.height - 50;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9'
    },
});

const mapStateToProps = (user) => {
    return {user};
};

export default connect(mapStateToProps)(My);

