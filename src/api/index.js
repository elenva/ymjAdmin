import request from '../utils/request.js'
import qs from 'qs';

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
export function $saveFile(params){
    return request({
        url:`/sys/saveFile/${params.documentName}`,
        method:'post',
        data:params.file,
        headers:{
            'Content-Type':'multipart/form-data'
        }
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