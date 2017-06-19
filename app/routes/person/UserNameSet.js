/**
 * Created by chengyuan on 2017/5/6.
 */
/**
 * Created by chengyuan on 2017/5/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva';
import { List, Button, Toast } from 'antd-mobile';
import Common from '../../common/index';
const {myToast} = Common;

class SetWithdrawPwd extends Component{
    // 构造
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // 初始状态
        this.state = {
            name: '',
        }
    }

    componentWillMount() {
        const {user:{info}} = this.props;
        this.setState({name: info.name})
    }

    handleChange(value,key){
        if(key == 'money') value = +value;
        let params = this.state.params;
        params[key] = value;
        this.setState({params});
    }

    doSubmit(){

        if(this.state.name == ''){
            myToast('昵称不能为空');
            return;
        }

        this.props.dispatch({
            type: 'user/updateUserName',
            params: {
                name: this.state.name
            },
            callback: ()=>{
                this.props.dispatch({type: 'user/getUserInfo'});
                myToast('修改成功!');
                setTimeout(()=>{
                    Actions.pop();
                },600)
            },
            errCallback: (rs)=>{
            }
        });

    }

    render(){


        return (
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: 'white',paddingBottom: 20}}>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>昵称: </Text>
                        <TextInput
                            value={this.state.name}
                            onChangeText={(v)=>{this.setState({name: v})}}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                </View>
                <View>
                    <Button type="primary" style={styles.commitButton}
                            onClick={this.doSubmit.bind(this)}
                    >保存</Button>
                </View>
            </ScrollView>
        )
    }
}

const {height, width, paddingTop} = Common.window;


const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#F5F5F9',
        paddingTop: paddingTop,
    },
    bottomView: {
        flex: 1, height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    accountTitle: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#7EB6EE',
        height: 24,
        left: (width-100)/2,
    },
    accountInfo: {
        height: 30,
        justifyContent: 'center',
        marginLeft: 20,
    },
    myInput: {
        width: width - 30,
        height: 35,
        backgroundColor: 'white',
        padding: 0,
        marginTop: 6,
        borderColor: '#D6D6D6',
        borderWidth: 1,
        borderRadius: 5,
    },
    inputView: {
        height: 65,
        justifyContent: 'center',
        paddingLeft: 15,
    },
    inputLabel: {
        color: '#47B5F5'
    },
    warnInfo: {
        color: '#333333',
        fontSize: 12,
        marginTop: 5,
    },
    commitButton:{
        width: width-100,
        marginLeft: 50,
        marginTop: 20,
    }
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(SetWithdrawPwd);

