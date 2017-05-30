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
const Item = List.Item;
const TabPane = Tabs.TabPane;


class Message extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
    }

    callback = (key)=>{
        console.log('onChange', key);
    }

    handleTabClick = (key)=>{
        console.log('onTabClick', key);
    }


    render(){
        return (
            <View style={styles.container}>
                <Tabs defaultActiveKey="1"
                      onChange={this.callback} onTabClick={this.handleTabClick}>
                    <TabPane tab="通知公告" key="1">
                        <SystemMessage {...this.props}/>
                    </TabPane>
                    <TabPane tab="我的消息" key="2">
                        <MyMessage {...this.props}/>
                    </TabPane>
                </Tabs>
            </View>
        )
    }
}


class SystemMessage extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            pageIndex: 1,
            hasMore: true,
            systemList: [],
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
            type: 'message/systemList',
            params: {
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

        const {message: { systemList }} = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.list}>
                    {systemList.length>0?<ListView
                        ref='mylistView'
                        onEndReachedThreshold={30}
                        onEndReached={this.loadMore}
                        dataSource={this.state.dataSource.cloneWithRows(systemList)}
                        renderRow={this._renderRow.bind(this)}
                        style={{width: '100%',height: '100%'}}
                    />:null}
                </View>
            </View>
        )
    }

    _renderRow(msg, sectionID, rowID){
        let time = <Text style={{fontSize: 13,color: '#CBCBCB'}}>{getDate(msg.created_at)}</Text>;
        return(
            <Item
                onClick={()=>{Actions.messageDetail({id: msg.id})}}
                key={rowID} extra={time}>{msg.title}</Item>
        )
    }

}

class MyMessage extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render(){
        return (
            <View style={styles.container}>
                <List>
                    <Item>你中大奖了</Item>
                    <Item>我去男男女女女女女</Item>
                    <Item>水水水水</Item>
                    <Item>想现在防守打法</Item>
                    <Item>的萨达撒</Item>
                    <Item>的萨达撒多撒</Item>
                </List>
            </View>
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

