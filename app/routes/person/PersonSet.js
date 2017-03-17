/**
 * Created by chengyuan on 2017/3/11.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { List, Toast } from 'antd-mobile';
import Common from '../../common/index';
const Item = List.Item;

class PersonSet extends Component{
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
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        onClick={()=>{
                            Alert.alert('','确定退出登录吗?',[
                              {text: '取消', onPress: () => console.log('OK Pressed!')},
                              {text: '确定', onPress: () => {
                                this.props.dispatch({type: 'user/loginOut',callback:()=>{
                                    Actions.pop();
                                }});
                              }},
                            ])
                        }}
                    >退出登录</Item>
                </List>
            </View>
        )
    }
}

const pageHeight = Common.window.height;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9',
        paddingTop: 65,
    },
});

const mapStateToProps = (user) => {
    return {user};
};

export default connect(mapStateToProps)(PersonSet);

