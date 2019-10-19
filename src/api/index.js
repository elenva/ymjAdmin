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