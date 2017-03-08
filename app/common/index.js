import {Dimensions} from 'react-native';

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};
//150*150
let cutImg320 = (img)=>{
    if(img && img.indexOf('imageView2') == -1 && img.indexOf('youcyou') > -1){
        let width = parseInt(window.width*1.2);
        let postfix = `?imageView2/0/w/${width}/h/${parseInt(width/1.68)}`;
        return img + postfix;
    }
    return img;
};

//320*184
let smallImg = (img)=>{
    if(img && img.indexOf('-curtail150') == -1 && img.indexOf('youcyou') > -1){
        return `${img}-curtail150`;
    }
    return img;
};

//640*368
let banner = (img)=>{
    if(img && img.indexOf('imageView2') == -1 && img.indexOf('youcyou') > -1){
        let width = parseInt(window.width*1.5);
        let postfix = `?imageView2/0/w/${width}/h/${parseInt(width/1.68)}`;
        return img + postfix;
        //return `${img}-banner`;
    }
    return img;
};

//320*184
let groupLogo = (img)=>{
    if(img && img.indexOf('imageView2') == -1 && img.indexOf('youcyou') > -1){
        let width = parseInt(window.width/2);
        let postfix = `?imageView2/0/w/${width}/h/${width}`;
        return img + postfix;
        //return `${img}-banner`;
    }
    return img;
};

//个人首页用户头像 100*100
let personalHead = (img)=>{
    let postfix = "-personalHead";
    if(img && img.indexOf(postfix) == -1 && img.indexOf('youcyou') > -1){
        return img + postfix;
    }
    return img;
};

let getFormatedImg = (img,type)=>{
    let postfix = "";
    switch (type){
        case "timelineCover":
            postfix = "-timelineCover";
            break;
        case "headImg":
            postfix = "?imageView2/0/w/50/h/50";
            break;
    }
    return img + postfix;
};

//获取指定高度和宽度的图片
let getFormatedImgBySize = (img,width,height)=>{
    width = parseInt(width * 1.5);
    height = parseInt(height * 1.5);
    let postfix = `?imageView2/0/w/${width}/h/${height}`;
    if(width == -1){
        postfix = `?imageView2/0/h/${height}`
    }else if(height == -1){
        postfix = `?imageView2/0/w/${width}`
    }
    return img + postfix;
};


export default {
    window: window,
    cutImg: cutImg320,
    smallImg: smallImg,
    banner: banner,
    groupLogo: groupLogo,
    personalHead:personalHead,
    getFormatedImg:getFormatedImg,
    getFormatedImgBySize:getFormatedImgBySize
}
