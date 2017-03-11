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

class Message extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }



    render(){
        return (
            <View style={styles.container}>
                <List>
                    <Item>你中大奖了</Item>
                    <Item>我去男男女女女女女</Item>
                    <Item>水水水水</Item>
                    <Item>想现在防守打法</Item>
                    <Item>的萨达撒</Item>
                    <Item>的萨达撒多撒</Item>
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

export default connect(mapStateToProps)(Message);

