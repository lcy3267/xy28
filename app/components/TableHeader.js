import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class TableHeader extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
    }

    render(){

        const { headers, type } = this.props;
        return (
            <View style={styles.header}>
                {headers.map((header, i)=>{
                    let myStyle = type && type == 'trend' ? {backgroundColor: '#364E99',flex: i == 0? 2 : 1}:{};
                    return (
                        <View key={i} style={[styles.filed, myStyle]}>
                            <Text style={styles.headerText}>{header}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }

}

const styles = StyleSheet.create({
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
});


