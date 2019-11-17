import request from '../utils/request.js';
import ElementUI from 'element-ui'
import qs from 'qs';

const {Message} = ElementUI;

//获取优惠券列表
export function $getCoupons(params) {
    return request({
        url: `/sys/coupon/selectCoupon?${qs.stringify(params)}`,
        method: 'post',
    })
}
  
// 添加一个优惠券
export function $addCoupons(params) {
    return request({
        url: '/sys/coupon/createCoupon',
        method: 'post',
        data:params
    })
}
//删除一个优惠券
export function $delCoupon(id){
    return request({
        url: `/sys/coupon/deleteCoupon/${id}`,
        method: 'post'
    })
}

//获取用户列表
export function $getUsers(params){
    return request({
        url: `/sys/user/selectUser?key=${params.key}&page=${params.page}`,
        method: 'post'
    })
}

//把优惠券指定给部分用户或者全部用户
export function $postCouponToUser(params){
    return request({
        url:`/sys/coupon/addCouponToUser/${params.sendDialogRadio}`,
        method:'post',
        data:params
    })
}

//根据状态获取提现列表
export function $getPutList(params){
    return request({
        url:`/sys/extract/selectExtractList/${params.type}?key=${params.key}&page=${params.page}`,
        method:'post',
    })
} 

//更新提现状态
export function $updatePut(params){
    return request({
        url:`/sys/extract/updateExtract`,
        method:'post',
        data:params
    })
} 

//分页条件查询课程列表
export function $getCourse(params){
    const paramsSting = qs.stringify(params);
    return request({
        url:`/sys/course/getCourse?${paramsSting}`,
        method:'post'
    })
}

//保存文件
export function $saveFile(path,file){
    
    return new Promise((OK,Fail) => {

        // if(path === 'video' && file.type !== 'video/mp4'){
        //     Message.warning(`视频格式限定为 video/mp4`);
        //     Fail()
        //     return;
        // }
        // if(path === 'img' && (file.type !== 'image/jpeg' && file.type !== 'image/png')){
        //     Message.warning(`图片格式限定为 image/jpeg 或 image/png`);
        //     Fail()
        //     return;
        // }
        // if(path === 'audio' && file.type !== 'audio/mp3') {
        //     Message.warning(`音频格式限定为 audio/mp3`);
        //     Fail()
        //     return;
        // }

        const formData = new FormData();

        $getOssInfo(path).then(res=> {
            const info = res.datas;
            const key = info.dir+ '/' + file.lastModified + file.name
            formData.append('key',key )
            formData.append('name',file.name)
            formData.append('policy', info.policy)
            formData.append('OSSAccessKeyId',info.accessKeyId)
            formData.append('success_action_status','200')
            formData.append('signature',info.signature)
            formData.append('file',file)
            request({
                url:info.host,
                method:'post',
                data:formData,
                closeLoading:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then(res=> {
                OK(info.host + `/` + key)
            }).catch(res => {
                Message.error(`上传失败！`)
                Fail();
            })
        })  
    })
    
}

//添加课程
export function $addOrEditCourse(data){
    return request({
        url:`/sys/course/createCourse`,
        method:'post',
        data
    })
}

//设置课程上架下架
export function $setCourseStatus(id,status){
    return request({
        url:`/sys/course/setCourseStatus/${id}?status=${status}`,
        method:'post'
    })
}

//添加一个代理
export function $addAgent(data){
    return request({
        url:`/sys/permission/addUser`,
        method:'post',
        data
    })
}

//查询代理用户
export function $getAgentUsers(data){
    return request({
        url:`/sys/permission/getUser`,
        method:'post',
        data
    }) 
}

//查询该代理下普通用户
export function $getUserByAgent(openId){
    return request({
        url:`/invite/getInviteByOpenId/${openId}`,
    })
}
//登录
export function $login(data){
    return request({
        url:`/sys/login`,
        method:'post',
        data
    }) 
}

// 授权课程给用户
export function $authorizeCourseToUser(data){
    return request({
        url:`/sys/course/authorizeCourseToUser`,
        method:'post',
        data
    }) 
}


//查询某用户已授权的课程
export function $authedCourse(openId){
    return request({
        url:`/course/getCoursePlayHis/${openId}?status=3`,
    }) 
}

//获取用户报告
export function $getReport(openId){
    return request({
        url:`/report/getReportByOpenId/${openId}`,
    }) 
}

// 添加报告
export function $addReport(data){
    return request({
        url:`/sys/addReport`,
        method:'post',
        data
    }) 
}

//根据文件夹获取对应的oss信息
export function $getOssInfo(documentName){
    return request({
        url:`/sys/getOssToken/${documentName}`,
        method:'post',
    }) 
}

//获取类别
export function $getAllCategory(documentName){
    return request({
        url:`/sys/baseCourse/getAll`,
        method:'post',
    }) 
}

//修改类别
export function $setCategory(data){
    return request({
        url:`/sys/baseCourse/updateType`,
        method:'post',
        data
    }) 
}

//删除一个类别
export function $deleteCategory(id){
    return request({
        url:`/sys/baseCourse/deleteType/${id}`,
        method:'post',
    }) 
}


