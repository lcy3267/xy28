import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Carousel, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import Common  from '../../common/index';
import { withdrawType } from '../../config/index';
import { getDate } from '../../common/FormatUtil';
import TableHeader from '../../components/TableHeader';

class WithdrawRecord extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            records: [],
            pageIndex: 1,
            hasMore: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (p1, p2) => p1 !== p2,
            }),
        };
    }

    componentWillMount() {
        this.loadRecord((records)=>{
            this.setState({ records });
        });
    }

    loadRecord = (callback)=>{
        if(this.loading) return;
        this.loading = true;
        this.props.dispatch({
            type: 'records/userWithDrawRecord',
            params: {
                pageIndex: this.state.pageIndex,
                pageSize: 20,
            },
            callback: (records)=>{
                this.loading = false;
                callback && callback(records);
            }
        });
    }

    loadMore = ()=>{
        if(!this.state.hasMore) return;

        this.setState({pageIndex: this.state.pageIndex +1 },()=>{
            this.loadRecord((data)=>{
                if(data.length != 20){
                    this.setState({hasMore: false});
                }
                let records = this.state.records;
                records = records.concat(data);
                this.setState({records});
            });
        });
    }

    render(){

        const { records } = this.state;

        return (
            <View style={styles.container}>
                <TableHeader headers={['提现时间','提现银行卡','提现金额','提现结果']}/>
                <View style={{flex: 1}}>
                    {records.length>0?<ListView
                        ref='mylistView'
                        onEndReachedThreshold={30}
                        onEndReached={this.loadMore}
                        dataSource={this.state.dataSource.cloneWithRows(records)}
                        renderRow={this._renderRow.bind(this)}
                        style={{width: '100%',height: '100%'}}
                    />:null}
                </View>
            </View>
        )
    }

    _renderRow(record, sectionID, rowID){
        let {created_at, bank_name, withdraw_money, status} = record;

        created_at = getDate(created_at);

        return(
            <View style={styles.content}>
                <View style={styles.filed}>
                    <Text style={styles.contentText}>{created_at}</Text>
                </View>
                <View style={styles.filed}>
                    <Text style={styles.contentText}>{bank_name}</Text>
                </View>
                <View style={styles.filed}>
                    <Text style={styles.contentText}>{withdraw_money}</Text>
                </View>
                <View style={styles.filed}>
                    <Text style={styles.contentText}>{withdrawType[status -1]}</Text>
                </View>
            </View>
        )
    }
}

const {height, width, paddingTop} = Common.window;
const pageHeight = height + 50;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: pageHeight,
        flexDirection: 'column',
        paddingTop: paddingTop+10,
        paddingHorizontal: 15,
        backgroundColor: '#E9E9E9',
        paddingBottom: 55,
    },
    header: {
        flexDirection: 'row',
        height: 32,
        alignItems: 'center',
        backgroundColor: '#3399FF',
    },
    filed: {
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#E9E9E9',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
    },
    headerText: {
        color: 'white',
    },
    content: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
    },
    contentText: {
        color: 'black',
    }
});

export default connect()(WithdrawRecord);

