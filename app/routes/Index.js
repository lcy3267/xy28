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
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, WhiteSpace, WingBlank, NoticeBar } from 'antd-mobile';
import Common from '../common/index';

class Index extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {};
    }

    toPlayExplain = (type)=>{
        if(type == 3) return;
        Actions.playExplain({infoType: type})
    }

    render(){
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
                        <View style={styles.newsLeft}>
                            <Text style={styles.newsText}>通知</Text>
                        </View>
                        <View style={[styles.newsRight,{padding: 10}]}>
                            <View><Text style={{color: '#EED650',fontSize: 12}}>最新公告:</Text></View>
                            <View style={{height: 35,overflow: 'hidden'}}>
                                <Text  style={{color: 'white', lineHeight: 35, fontSize: 16}}
                                >国庆期间余额宝收益和转出到账时间通知：由于国庆到来，余额宝收益到账将延迟，特此通知</Text>
                            </View>
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

const pageHeight = Common.window.height-100;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight
    },
    carousel: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    actImage: {
        width: Common.window.width,
        height: pageHeight*1.8/6,
    },
    news:{
        marginTop: 10,
        width: Common.window.width,
        height: pageHeight*1/6-10,
        flexDirection: 'row',
        backgroundColor:'transparent',
        borderWidth: 4,
        borderColor: '#EED650',
        borderRadius: pageHeight*1/6/2,
    },
    newsLeft: {
        flex: 2,
        borderWidth: 4,
        borderColor: '#EED650',
        borderTopLeftRadius: pageHeight*1.1/6/2,
        borderTopRightRadius: pageHeight*1.1/6/2,
        borderBottomLeftRadius: pageHeight*1.1/6/2,
        borderBottomRightRadius: pageHeight*1.1/6/2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingTop: 10,
        paddingLeft: 5,
    },
    newsRight: {
        flex: 6,
    },
    newsText: {
        color: 'white',
        padding: 20,
        fontSize: 16
    },
    bottom: {
        width: Common.window.width,
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

const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps)(Index);

