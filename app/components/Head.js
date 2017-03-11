/**
 * Created by chengyuan on 2017/3/9.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Platform,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Common from '../common/index';


export default Head = (props) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            <View style={styles.title}>
                <Text style={styles.titleText}>游戏大厅</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Common.window.width,
        height: Platform.OS == 'ios'?60:50,
        paddingTop: Platform.OS == 'ios'?20:0,
        backgroundColor: 'black'
    },
    titleText: {
        fontSize: 18,
        color: 'white'
    },
});



