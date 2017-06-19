import React from 'react';
import {Dimensions, Platform, View} from 'react-native';
import { Toast } from 'antd-mobile';
import Icon from 'react-native-vector-icons/Ionicons';

const height = Dimensions.get('window').height;

export default {
    window: {
        width: Dimensions.get('window').width,
        height: Platform.OS == 'ios' ? height : height - 24,
        paddingTop: Platform.OS == 'ios' ? 64 : 54,
    },
    myToast: (message, timer = 2) =>{
        Toast.info(message, timer, null, false);
    },
    MyIcon: (bjColor,icon)=>{
        return (
            <View style={{width: 22,height: 22, borderRadius: 20,marginRight: 10,
                backgroundColor: bjColor,alignItems: 'center',justifyContent:'center'}}>
                <Icon name={icon} color='white' size={15}/>
            </View>
        )
    },
    defaultHead: require('../asset/person.jpg'),
    cutQNImg: (img, width) => {
        if (img && img.indexOf('imageView2') == -1) {
            let postfix = `?imageView2/0/w/${width}`;
            return img + postfix;
        }
        return img;
    }
}
