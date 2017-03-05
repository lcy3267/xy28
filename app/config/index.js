
export default {
	appInfo:{
		name:'三源色',
		descr:'',
		site:'',
		version: 'v3.0.0',
		copyright: '©2016 powered by react-native',
		registerUri: '',
		declare: ''
	},
	authorInfo: {
		name:'',
		email:'',
		homepage: '',
		declare: ''
	},
	commentTail: '',
	apiDomain:'http://api.youcyou.com',
	mockApiDomain: 'http://rap.taobao.org/mockjsdata/8322',
};

export const weixinAppId = 'wx9d8b9eb6f7a6c46a';

export const roleInGroup = {
	owner:1,
	member:2,
	verifying:3,
	stranger:4,
	logout:-1
};

export const carCategory = ['车友会','改装','越野','赛车','吃喝玩乐'];

//高德地图
export const map = {
	webServiceKey: "05a389c77f3a73e812f7d8156d56175b",
	pluginKey:"923385c8b8f205a601bde88c4513c1d6",
	androidKey:"45cf7e7d8659bac06b14c06131572676",
};

//拍照
export const imagePickerOptions = {
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

export const defaultHead = 'http://img.youcyou.com/20161206161913423.png';
export const defaultCover = 'http://img.youcyou.com/cover.png';
export const defaultLogo = 'http://img.youcyou.com/cover.png';

export const webHost = 'http://admin.youcyou.com';
//export const webHost = 'http://op.sys.com:8080';

export const pageSize = 10;

export const storageKey = {
	userInfo: "userInfo",
	chattingList: "chattingList",
	chattingInfo: (targetUserId)=>`chattingInfo${targetUserId}`,
	searchNewsKey: 'searchNewsKey',
	searchActivityKey: 'searchActivityKey',
	userSignInDate: 'userSignInDate',//签到
	hasNewSystem: 'hasNewSystem'
};