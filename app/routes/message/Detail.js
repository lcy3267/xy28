/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import Common from '../../common/index';
import { getDate } from '../../common/FormatUtil';

class Detail extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            info: {},
        };
    }

    componentWillMount() {
        const {id, dispatch, msgType} = this.props;

        dispatch({
            type: 'message/detail',
            msgType,
            params: {id},
            callback: (info)=>{
                this.setState({ info })
            }
        })
    }

    render(){

        const {info} = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.title}>
                        <Text style={{fontSize: 16}}>{info.title}</Text>
                    </View>
                    <View style={styles.timeView}>
                        <Text style={styles.time}>{getDate(info.created_at)}</Text>
                    </View>
                    <View>
                        <Text style={styles.contentText}>{info.content}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const {height, width, paddingTop} = Common.window;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flexDirection: 'column',
        paddingTop: paddingTop,
        backgroundColor: '#F3F3F3',
    },
    content: {
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        paddingBottom: 10,
    },
    timeView: {
        width: '100%',
        paddingBottom: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#F3F3F3',
    },
    time: {
        fontSize: 12,
        color: 'gray',
    },
    contentText: {
        fontSize: 13,
        lineHeight: 24,
    }

});

export default connect()(Detail);

