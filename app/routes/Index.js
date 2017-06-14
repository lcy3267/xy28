/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import Common from '../common/index';
const {width} = Common.window;

class Index extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
          fadeInOpacity: new Animated.Value(0) // 初始值
      };
    }

    toPlayExplain = (type)=>{
        if(type == 3) return;
        Actions.playExplain({infoType: type})
    }

    componentDidMount() {
        //this.startAnimation();
    }

    startAnimation = ()=>{
        this.state.fadeInOpacity.setValue(width);
        //this.setState({fadeInOpacity: 0});
        Animated.timing(this.state.fadeInOpacity, {
            toValue: -(width-100), // 目标值
            duration: 10000, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start(this.startAnimation);
    }

    render(){

        const {message: { systemMsgList }} = this.props;
        let title = '祝各位游戏愉快, 有问题可以联系客服微信!';
        if(systemMsgList.length > 0){
            //title = systemMsgList[0].title;
        }

        return (
            <Image source={require('../asset/bg2.png')} style={styles.container}>
                <ScrollView>
                    <View style={styles.carousel}>
                        <Carousel
                            className="my-carousel" autoplay={true} infinite
                        >
                            {[require('../asset/play1.png'),require('../asset/play2.png'),
                                require('../asset/code.png')].map((img, i) => {
                                    return(
                                        <TouchableHighlight key={i}
                                            onPress={()=>{this.toPlayExplain(i+1)}}>
                                            <Image style={styles.actImage} source={img} />
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </Carousel>
                    </View>
                    <View style={styles.news}>
                        <View style={{paddingLeft: 20, paddingRight: 20, borderRightWidth: 2,borderRightColor: '#EED650',
                        height: '100%',justifyContent:'center',alignItems: 'center'}}>
                            <Text style={{color: '#EED650', fontSize: 18,width: 40}}>最新公告</Text>
                        </View>
                        <View style={styles.newContent}>
                            <Text style={{color: 'white', fontSize: 16}}>{title}</Text>
                        </View>
                    </View>
                    <View style={styles.bottom}>
                        <TouchableOpacity
                            onPress={()=>{Actions.roomList({roomType: 1, title: '北京游28'})}}
                            activeOpacity={0.8} style={[styles.card,{paddingRight:7.5}]}>
                            <Image style={styles.cardImg} source={require('../asset/china.png')} >
                                <Text style={styles.gameText}>北京 28</Text>
                                <TouchableHighlight style={styles.gameButton}
                                    onPress={()=>{this.toPlayExplain(1)}}
                                ><Text style={styles.gameButtonText}>玩法说明</Text></TouchableHighlight>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{Actions.roomList({roomType: 2, title: '加拿大28'})}}
                            activeOpacity={0.8} style={[styles.card,{paddingLeft:7.5}]}>
                            <Image style={styles.cardImg} source={require('../asset/cnd.png')} >
                                <Text style={styles.gameText}>加拿大28</Text>
                                <TouchableHighlight style={styles.gameButton}
                                                    onPress={()=>{this.toPlayExplain(2)}}
                                ><Text style={styles.gameButtonText}>玩法说明</Text></TouchableHighlight>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Image>
        )
    }
}

const pageHeight = Common.window.height-95;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: pageHeight
    },
    carousel: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    actImage: {
        width: width,
        height: pageHeight*1.8/6,
    },
    news:{
        marginTop: 10,
        width: width-30,
        height: pageHeight*1/6-10,
        backgroundColor:'transparent',
        borderWidth: 3,
        borderColor: '#EED650',
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
        //borderRadius: pageHeight*1/6/2,
    },
    newContent: {
        paddingLeft: 20,
        flex: 1,
    },
    bottom: {
        width: width,
        height: pageHeight*3.2/6,
        flexDirection: 'row'
    },
    card: {
        flex: 1,
        padding: 15,
        paddingBottom: 15,
        //height: pageHeight*3.2/6-15,
        height: pageHeight/2+15,
    },
    cardImg: {
        width: '100%',height: '100%',
        borderRadius: 5,
        borderWidth: 4,
        borderColor: '#A39054',
        alignItems: 'center',
        backgroundColor: '#278C99'
    },
    gameText: {
        marginTop: 160,
        backgroundColor:'transparent',
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    gameButton:{
        marginTop: 5,
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D2E8FC',
        opacity: 0.7
    },
    gameButtonText: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold'
    }
});

const mapStateToProps = ({ message }) => {
    return { message };
};

export default connect(mapStateToProps)(Index);

