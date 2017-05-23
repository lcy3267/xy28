/**
 * Created by chengyuan on 2017/5/7.
 */
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
import { List, Toast, WhiteSpace } from 'antd-mobile';
import Common from '../../common/index';
const Item = List.Item;

class MyBankCard extends Component{
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
                this.setState({cards})
            }
        })
    }

    render(){

        const { selectCard } = this.props;

        return (
            <View style={styles.container}>
                <List>
                    {this.state.cards.map((card, index)=>{
                        return (
                            [
                                <Item key={index}
                                    {...{arrow: selectCard?"horizontal":'',
                                        onClick: selectCard?()=>Actions.pop({ refresh: { index }}):null}}>
                                    <View style={{height: 30,justifyContent: 'center',}}>
                                        <Text>{card.bank_name}</Text>
                                    </View>
                                    <View style={{height: 30,justifyContent: 'center',}}>
                                        <Text style={{paddingLeft: 50, fontSize: 16}}>{this.formatCord(card.bank_account)}</Text>
                                    </View>
                                </Item>,
                                <WhiteSpace style={{backgroundColor: '#F5F5F9'}}/>
                            ]
                        )
                    })}

                </List>
            </View>
        )
    }

    formatCord(account){
        account = account.toString();
        return "**** **** **** "+account.substr(account.length-4);
    }
}

const pageHeight = Common.window.height;

const styles = StyleSheet.create({
    container: {
        paddingTop: 65,
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9'
    },
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(MyBankCard);

