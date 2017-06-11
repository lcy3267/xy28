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
import Common  from '../common/index';
import { combineRates } from '../config/index';
import TableHeader from '../components/TableHeader';

class BetRecord extends Component{
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
        const {roomType} = this.props;
        this.loading = true;
        this.props.dispatch({
            type: 'records/trend',
            params: {
                pageIndex: this.state.pageIndex,
                pageSize: 20,
                type: roomType,
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
                <TableHeader type="trend" headers={['期号','值','大','小','单','双','大单','小单','大双','小双']}/>
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

        let {serial_number, sum_number} = record;

        const {hasMax, hasDouble} = this.getResult(sum_number);

        return(
            <View style={styles.content}>
                <View style={[styles.filed,{flex: 2}]}>
                    <Text style={{color: 'black'}}>{serial_number}</Text>
                </View>
                <View style={styles.filed}>
                    <Text style={[styles.contentText,{color: '#2A85D2'}]}>{sum_number}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: hasMax?'#2A85D2':'white'}]}>
                    <Text style={styles.contentText}>{hasMax?'大':''}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: !hasMax?'#2A85D2':'white'}]}>
                    <Text style={styles.contentText}>{!hasMax?'小':''}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: !hasDouble?'#3399FF':'white'}]}>
                    <Text style={styles.contentText}>{!hasDouble?'单':''}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: hasDouble?'#3399FF':'white'}]}>
                    <Text style={styles.contentText}>{hasDouble?'双':''}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: hasMax&&!hasDouble?'#40BA36':'white'}]}>
                    <Text style={styles.contentText}>{hasMax&&!hasDouble?'大单':'white'}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: hasMax&&hasDouble?'#40BA36':'white'}]}>
                    <Text style={styles.contentText}>{hasMax&&hasDouble?'大双':''}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: !hasMax&&!hasDouble?'#40BA36':'white'}]}>
                    <Text style={styles.contentText}>{!hasMax&&!hasDouble?'小单':'white'}</Text>
                </View>
                <View style={[styles.filed,{backgroundColor: !hasMax&&hasDouble?'#40BA36':'white'}]}>
                    <Text style={styles.contentText}>{!hasMax&&hasDouble?'小双':'white'}</Text>
                </View>
            </View>
        )
    }

    getResult(sum){
        let hasMax = true;
        let hasDouble = false;
        if(sum <= 13){
            hasMax = false;
        }
        if(sum % 2 == 0){
            hasDouble = true;
        }
        return {hasMax, hasDouble};
    }
}

const {height, width, paddingTop} = Common.window;
const pageHeight = height + 50;


const styles = StyleSheet.create({
    container: {
        width: width,
        height: pageHeight,
        flexDirection: 'column',
        paddingTop: paddingTop + 10,
        paddingHorizontal: 15,
        backgroundColor: '#E9E9E9',
        paddingBottom: 55,
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
        color: 'white',
    }
});

export default connect()(BetRecord);

