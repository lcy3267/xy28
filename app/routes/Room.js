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
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import Common from '../common/index';
import MyHead from '../components/Head';



class Room extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {};
    }

    render(){
        return (
           <View style={styles.container}>
               <Text>初级房</Text>
           </View>
        )
    }
}

const pageHeight = Common.window.height - 50;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        flexDirection: 'column',
        paddingTop: 65,
    },
    card: {
        flex: 1,
        //width: '100%',
        borderWidth: 3,
        borderColor: '#F8592C',
        margin: 8,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
    },
    sceneStyle: {
        backgroundColor: 'black'
    },
    titleStyle: {
        backgroundColor: 'black'
    },
    actImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    }
});

const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps)(Room);

