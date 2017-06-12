import {Dimensions, Platform} from 'react-native';
import { Toast } from 'antd-mobile';

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
}
