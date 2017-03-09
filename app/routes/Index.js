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
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import Common from '../common/index';



class Index extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {};
    }

    render(){
        const {count,dispatch} = this.props;
        return (
            <Image source={require('../asset/bg.png')} style={styles.container}>
                <ScrollView>
                    <View style={styles.carousel}>
                        <Carousel
                            className="my-carousel" autoplay={true} infinite
                            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                            afterChange={index => console.log('slide to', index)}
                        >
                            {[require('../asset/one.jpg'),require('../asset/two.jpg'),require('../asset/th.jpg')].map(ii => (
                                <TouchableHighlight key={ii}>
                                    <Image style={styles.actImage} source={ii} />
                                </TouchableHighlight>
                            ))}
                        </Carousel>
                    </View>
                    <View style={styles.news}>
                        <View style={styles.newsLeft}>
                            <Text style={styles.newsText}>斤斤计较军军</Text>
                        </View>
                        <View style={styles.newsRight}>
                            <Text style={styles.newsText}>22斤斤计较军军</Text>
                        </View>
                    </View>
                    <View style={styles.bottom}>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.card,{paddingRight:7.5}]}>
                            <Image style={styles.cardImg} source={require('../asset/family1.png')} >
                                <Text style={styles.gameText}>北京游戏大厅</Text>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.card,{paddingLeft:7.5}]}>
                            <Image style={styles.cardImg} source={require('../asset/family2.png')} >
                                <Text style={styles.gameText}>加拿大游戏大厅</Text>
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
    actImage: {
        width: Common.window.width,
        height: pageHeight*1.6/6,
    },
    news:{
        marginTop: 10,
        width: Common.window.width,
        height: pageHeight*1.1/6-10,
        flexDirection: 'row',
        backgroundColor:'transparent',
        borderWidth: 4,
        borderColor: '#EED650',
        borderRadius: pageHeight*1.1/6/2,
    },
    newsLeft: {
        flex: 2,
        borderWidth: 4,
        borderColor: '#EED650',
        borderTopRightRadius: pageHeight*1.1/6/2,
        borderBottomRightRadius: pageHeight*1.1/6/2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    newsRight: {
        flex: 6,
    },
    newsText: {
        color: 'white',
        padding: 20
    },
    bottom: {
        width: Common.window.width,
        height: pageHeight*3.3/6,
        flexDirection: 'row'
    },
    card: {
        flex: 1,
        padding: 15,
        paddingBottom: 15,
        height: pageHeight*3.3/6-15,
    },
    cardImg: {
        width: '100%',height: '100%',
        borderRadius: 5,
        borderWidth: 4,
        borderColor: '#A39054',
        alignItems: 'center',

        //justifyContent: 'center'
    },
    gameText: {
        marginTop: 20,
        backgroundColor:'transparent',
        color: 'white',
        fontSize: 18,
    },
});

const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps)(Index);

