/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';


class One extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {};
    }

    render(){
        const {count,dispatch} = this.props;
        return (
            <View style={[styles.container,{height: 400}]}>
                <Text style={styles.welcome}>
                    Count: { count }
                </Text>
                <TouchableHighlight onPress={() => { dispatch({ type: 'count/add' }) }}>
                    <Text>Add</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => { dispatch({ type: 'count/addDelay' }) }}>
                    <Text>Delay Add111111</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {Actions.two()}}>
                    <Text>跳转</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

const mapStateToProps = ({ count }) => {
    return { count };
};

export default connect(mapStateToProps)(One);

