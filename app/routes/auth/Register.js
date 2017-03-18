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
import { List, InputItem, WhiteSpace, Toast } from 'antd-mobile';
import Common from '../../common/index';
import { createForm } from 'rc-form';

class Register extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        // 初始状态
        this.state = {};
    }

    submit(){
        alert(123)
        const {form, dispatch} = this.props;

        form.validateFields((error, value) => {
            if(!error){
                if(value.password !== value.password2){
                    Toast.info('确认密码错误,请重新输入', 1);
                }else{
                    let params = {
                        account: value.account,
                        password: value.password
                    }
                    dispatch({type:'user/register',params,callback: ()=>{
                        Toast.info('注册成功');
                        Actions.pop();
                    }})
                }
            }else{
                Toast.info('请将注册信息填写完整', 1);
            }
        });
    }

    render(){
        const {user} = this.props;

        const { getFieldProps } = this.props.form;

        return (
            <View style={styles.container}>
                <List renderHeader={() => '用户注册'}>
                    <InputItem
                        {...getFieldProps('account',{
                            rules: [{required: true}]
                        })}
                        clear
                        placeholder="请输入账号"
                    ><Text style={{fontSize: 14}}>账号</Text></InputItem>
                    <InputItem
                        {...getFieldProps('password',{
                            rules: [{required: true}]
                        })}
                        clear
                        type="password"
                        placeholder="请输入密码"
                    ><Text style={{fontSize: 14}}>密码</Text></InputItem>
                    <InputItem
                        {...getFieldProps('password2',{
                            rules: [{required: true}]
                        })}
                        clear
                        type="password"
                        placeholder="请确认密码"
                    ><Text style={{fontSize: 14}}>确认密码</Text></InputItem>
                    <List.Item>
                        <View style={{ width: '100%'}}>
                            <Text
                                onPress={this.submit}
                                style={{color: '#108ee9', textAlign: 'center' ,fontSize: 18}}>注册</Text>
                        </View>
                    </List.Item>
                </List>
                <View style={{height: 50,justifyContent: 'center',alignItems: 'flex-end',}}>
                    <Text
                        onPress={Actions.pop}
                        style={{width: 80,color:'#2F8BE9'}}>去登录</Text>
                </View>
            </View>
        )
    }
}

const pageHeight = Common.window.height;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        paddingTop: 64,
        backgroundColor: '#F5F5F9'
    },
    
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(createForm()(Register));

