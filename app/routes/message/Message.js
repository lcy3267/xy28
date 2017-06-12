/**
 * Created by chengyuan on 2017/3/11.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { List, Tabs } from 'antd-mobile';
import Common from '../../common/index';
import { getDate } from '../../common/FormatUtil';
import OcIcon from 'react-native-vector-icons/Octicons';

const Item = List.Item;
const TabPane = Tabs.TabPane;


class Message extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render(){
        return (
            <View style={styles.container}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="通知公告" key="1">
                        <MyMessage {...this.props} type="1"/>
                    </TabPane>
                    <TabPane tab="我的消息" key="2">
                        <MyMessage {...this.props} type="2"/>
                    </TabPane>
                </Tabs>
            </View>
        )
    }
}


class MyMessage extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            pageIndex: 1,
            hasMore: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (p1, p2) => p1 !== p2,
            }),
        };
    }

    componentWillMount() {
    }

    loadList = (callback)=>{
        this.loading = true;
        this.props.dispatch({
            type: 'message/messageList',
            params: {
                type: this.props.type,
                pageIndex: this.state.pageIndex,
            },
            callback: (records)=>{
                this.loading = false;
                callback && callback(records);
            }
        });
    }

    loadMore = ()=>{
        if(!this.state.hasMore) return;
        this.setState({pageIndex: this.state.pageIndex + 1},()=>{
            this.loadList((data)=>{
                if(data.length != 20){
                    this.setState({hasMore: false});
                }
            });
        });
    }

    render(){

        const {message: { systemMsgList, userMsgList }, type} = this.props;

        let arr = type == 1? systemMsgList : userMsgList;
        arr = arr?arr:[];
        
        return (
            <View style={styles.container}>
                <View style={styles.list}>
                    {arr.length>0?<ListView
                        ref='mylistView'
                        onEndReachedThreshold={30}
                        onEndReached={this.loadMore}
                        dataSource={this.state.dataSource.cloneWithRows(arr)}
                        renderRow={this._renderRow.bind(this)}
                        style={{width: '100%',height: '100%'}}
                    />:null}
                </View>
            </View>
        )
    }

    _renderRow(msg, sectionID, rowID){
        let time = <Text style={{fontSize: 13,color: '#CBCBCB'}}>{getDate(msg.created_at)}</Text>;
        const {type} = this.props;

        return(
            <Item
                onClick={()=>{Actions.messageDetail({id: msg.id, msgType: type})}}
                key={rowID} extra={time}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 14,}}>{msg.title}</Text>
                    {msg.noRead?<OcIcon style={{marginLeft: 5,top: -3}}
                                        name="primitive-dot" color="red" size={14}/>:null}
                </View>
            </Item>
        )
    }

}

const pageHeight = Common.window.height - 50;

const styles = StyleSheet.create({
    container: {
        width: Common.window.width,
        height: pageHeight,
        backgroundColor: '#F5F5F9',
    },
    list: {
        marginBottom: 105,
    }
});

const mapStateToProps = ({ message }) => {
    return { message };
};

export default connect(mapStateToProps)(Message);

