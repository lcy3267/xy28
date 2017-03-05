/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';

const One = connect(({ count }) => ({ count }))((props) => {
    const { dispatch, count } = props;
    return (
        <View style={styles.container}>
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
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

const mapStateToProps = ({ count }) => {
    return { count };
};

export default connect(mapStateToProps)(One);

