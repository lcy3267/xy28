/**
 * Created by chengyuan on 2017/3/11.
 */
/**
 * Created by chengyuan on 2017/3/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import uploadQiNiu from '../../service/uploadQiNiu';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'dva/mobile';
import { List, Toast } from 'antd-mobile';
import Common from '../../common/index';
const Item = List.Item;
const {MyIcon, myToast, defaultHead, cutQNImg} = Common;

//拍照
const imagePickerOptions = {
    title: null,
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    takePhotoButtonTitle:"拍照",
    chooseFromLibraryButtonTitle:"从手机相册选择",
    cancelButtonTitle:"取消",
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class My extends Component{
    // 构造
    constructor(props) {
        super(props);
    }

    _chooseImage(type){
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({loading: true});
                //上传到七牛
                this.upload(response.uri);
            }
        });
    }

    upload = async (imgPath)=>{
        Toast.loading('上传中..',5);
        let rs = await uploadQiNiu(imgPath);
        if(rs != 'error'){
            this.props.dispatch({
                type: 'user/updateUserLogo',
                params: {
                    logoPath: rs,
                },
                callback: ()=>{
                    this.props.dispatch({type: 'user/getUserInfo'});
                    myToast('图片上传成功');
                }
            })
        }else{
            myToast('图片上传失败');
        }
    }

    render(){

        let {user: {info}} = this.props;

        let path = defaultHead;
        if(info.avatar_picture_url){
            path = {uri: cutQNImg(info.avatar_picture_url, 100)}
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.7}
                                  onPress={Actions.userNameSet}
                    style={{flexDirection: 'row',padding: 10,backgroundColor: 'white',marginBottom: 20}}>
                    <TouchableOpacity style={{flex: 1}}
                                      onPress={this._chooseImage.bind(this)}
                    >
                        <Image source={path}
                               style={{width: 68,height: 68}}
                        />
                    </TouchableOpacity>
                    <View style={{flex: 3,justifyContent: 'center'}}>
                        <Text>{info.name}</Text>
                    </View>
                    <View style={{position: 'absolute', right: 20,top: 30}}>
                        <Icon name='ios-arrow-forward-outline' color='#D0D0D0' size={24}/>
                    </View>
                </TouchableOpacity>
                <List>
                    <Item
                        thumb={MyIcon('#E58A36','ios-briefcase')}
                        arrow="horizontal"
                        onClick={Actions.wallet}
                        extra={<Text style={{fontSize: 13,color: '#3399FF'}}>{info.integral+' 元宝'}</Text>}
                    >钱包</Item>
                    <Item
                        arrow="horizontal"
                        thumb={MyIcon('#5BBEF8','ios-cloud-upload')}
                        onClick={Actions.rollbackRecord}
                    >我的回水</Item>
                    <Item
                        thumb={MyIcon('#E58A36','ios-pulse')}
                        arrow="horizontal"
                        onClick={Actions.changeRecords}
                    >账变记录</Item>
                    <Item
                        arrow="horizontal"
                        onClick={Actions.betRecord}
                        thumb={MyIcon('#5BBEF8','ios-game-controller-b')}
                    >游戏记录</Item>
                    <Item
                        thumb={MyIcon('#CE6C87','ios-briefcase')}
                        arrow="horizontal"
                        onClick={() => {console.log('1234')}}
                    >关于</Item>
                    <Item
                        arrow="horizontal"
                        onClick={() => {console.log('1234')}}
                        thumb={MyIcon('#E58A36','ios-briefcase')}
                    >分享</Item>
                    <Item
                        arrow="horizontal"
                        onClick={Actions.personSet}
                        thumb={MyIcon('#CE6C87','md-cog')}
                    >设置</Item>
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
        backgroundColor: '#F5F5F9'
    },
});

const mapStateToProps = ({user}) => {
    return {user};
};

export default connect(mapStateToProps)(My);

