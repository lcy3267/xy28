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
import md5 from 'blueimp-md5';
import {md5Key} from '../../config';
const {myToast} = Common;

const Item = List.Item;


class Withdraw extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            cards: []
        };
    }

    componentWillMount() {
        this.props.dispatch({
            type: 'user/getBankCards',
            callback: (cards)=>{
                if(cards.length == 0){
                    myToast('请先进行银行卡绑定!');
                    Actions.pop();
                    return;
                }
                this.setState({cards})
            }
        })
    }

    doSubmit(){

        const { money, withdrawPwd, cards} = this.state;
        const { index, dispatch } = this.props;
        const card = cards[index];

        if(!money || !withdrawPwd){
            myToast('请填写提现金额和提现密码');
            return;
        }

        if(money < 100){
            myToast('提现金额不能小于100!');
            return;
        }

        dispatch({
            type: 'user/withdraw',
            params: {
                money,
                withdrawPwd: md5(md5Key+withdrawPwd),
                finance_account_id: card.finances_account_id,
                bank_name: card.bank_name,
                bank_account: card.bank_account
            },
            callback: ()=>{
                dispatch({type: 'user/getUserInfo'});
                Toast.info('提现申请提交成功!!', 2);
                Actions.pop();
            },
            errCallback: (rs)=>{
                if(rs.err_code == 303){
                    Toast.info('提现密码错误!!', 2, null, false);
                }else if(rs.err_code == 304){
                    Toast.info('余额不足,不能提现!!', 2, null, false);
                }
            }
        });
    }

    moneyChange = (v)=>{
        const reg = /^\d*$/;
        if(reg.test(v)){
            const { user: {info: {integral}} } = this.props;
            if(integral < v){
                this.setState({money: integral+''});
                Toast.info('提现金额不足', 2, null, false);
            }else{
                this.setState({money: v});
            }
        }

    }

    render(){

        let { user,index } = this.props;
        const cards = this.state.cards;

        if(cards.length == 0) return null;

        index = index?index:0;

        return (
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: 'white',marginTop: 20}}>
                    <View style={styles.accountTitle}>
                        <Text style={{color: 'white'}}>账号信息</Text>
                    </View>
                    <Item
                        arrow="horizontal"
                        onClick={()=>Actions.myBankCard({selectCard: true})}
                    >
                        <Text>收款账号: {cards[index].bank_account}  {cards[index].bank_name}</Text>
                    </Item>
                </View>
                <View style={{backgroundColor: 'white',marginTop: 20, }}>
                    <View style={styles.accountTitle}>
                        <Text style={{color: 'white'}}>提现须知</Text>
                    </View>
                    <View style={{paddingLeft: 10, paddingBottom: 10,}}>
                        <Text>1.xxx</Text>
                        <Text>2.xxx</Text>
                        <Text>3.xxx</Text>
                        <Text>4.xxx</Text>
                    </View>
                </View>
                <View style={{backgroundColor: 'white',marginTop: 20}}>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>提现金额: (余额: {user.info.integral}元宝)</Text>
                        <TextInput
                            value={this.state.money}
                            keyboardType="numeric"
                            onChangeText={this.moneyChange}
                            underlineColorAndroid="transparent"
                            style={styles.myInput}/>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.inputLabel}>提现密码: </Text>
                        <TextInput
                            onChangeText={(v)=>this.setState({withdrawPwd: v})}
                            underlineColorAndroid="transparent" secureTextEntry={true}
                            style={styles.myInput}/>
                    </View>
                </View>
                <View>
                    <Button type="primary" style={styles.commitButton}
                            onClick={this.doSubmit.bind(this)}
                    >提交</Button>
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
        height: 80,
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

export default connect(mapStateToProps)(Withdraw);

