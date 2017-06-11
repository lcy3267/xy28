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
import Icon from 'react-native-vector-icons/Ionicons';
import Common from '../../common/index';
const Item = List.Item;

class My extends Component{
    // 构造
    constructor(props) {
        super(props);
    }

    render(){

        let {user: {info}} = this.props;

        const iconStyle = {
            marginRight: 10,
        }

        const MyIcon = (bjColor,icon)=><View style={{width: 22,height: 22, borderRadius: 20,marginRight: 10,
         backgroundColor: bjColor,alignItems: 'center',justifyContent:'center'}}>
            <Icon name={icon} color='white' size={15}/>
        </View>;

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row',padding: 10,backgroundColor: 'white',marginBottom: 20}}>
                    <View style={{flex: 1}}>
                        <Image source={require('../../asset/person.jpg')}
                               style={{width: 68,height: 68}}
                        />
                    </View>
                    <View style={{flex: 3,justifyContent: 'center'}}>
                        <Text>{info.name}</Text>
                    </View>
                </View>
                <List>
                    <Item
                        thumb={MyIcon('#E58A36','ios-briefcase')}
                        arrow="horizontal"
                        onClick={Actions.wallet}
                        extra={<Text style={{fontSize: 13,color: '#3399FF'}}>{info.integral+' 元宝'}</Text>}
                    >钱包</Item>
                    <Item
                        arrow="horizontal"
                        thumb={MyIcon('#5BBEF8','ios-cloud-upload')}
                        onClick={Actions.rollbackRecord}
                    >我的回水</Item>
                    <Item
                        thumb={MyIcon('#E58A36','ios-pulse')}
                        arrow="horizontal"
                        onClick={Actions.changeRecords}
                    >账变记录</Item>
                    <Item
                        arrow="horizontal"
                        onClick={Actions.betRecord}
                        thumb={MyIcon('#5BBEF8','ios-game-controller-b')}
                    >游戏记录</Item>
                    <Item
                        thumb={MyIcon('#CE6C87','ios-briefcase')}
                        arrow="horizontal"
                        onClick={() => {console.log('1234')}}
                    >关于</Item>
                    <Item
                        arrow="horizontal"
                        onClick={() => {console.log('1234')}}
                        thumb={MyIcon('#E58A36','ios-briefcase')}
                    >分享</Item>
                    <Item
                        arrow="horizontal"
                        onClick={Actions.personSet}
                        thumb={MyIcon('#CE6C87','md-cog')}
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

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(My);

