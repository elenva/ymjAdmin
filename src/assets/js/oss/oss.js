import '@/assets/js/oss/oss-sdk';
import '@/assets/js/oss/upload-sdk';
import request from '../utils/request.js'
import store from '@/store'

export const initUploader = (that)=> {
    return new AliyunUpload.Vod({
        //阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId:"233486243987601421",
        //上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        region:"cn-shanghai",
        //分片大小默认1M，不能小于100K
        partSize: 1048576,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: function (uploadInfo) {
            const openId = store.getters.openId;
            //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            if (uploadInfo.videoId) {
                // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            }
            else{
                // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
                request({
                    
                })
                axios.post(`wx/video/sts/get`,{
                    title:uploadInfo.file.name.split('.')[0],
                    fileName:uploadInfo.file.name,
                    openId
                }).then(res=> {
                    if(res.data.success) {
                        const {videoId,uploadAddress,uploadAuth} = res.data.datas;
                        that.Uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId); 
                    }else {
                    }   
                })
            }
            //从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
            // Uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
        },
        // 文件上传成功
        'onUploadSucceed': function (uploadInfo) {

            that.selectedVideo = uploadInfo;
            that.UploadSucceedTimer = setInterval(()=> {
                axios.get(`wx/video/get/playinfo/${uploadInfo.videoId}`)
                .then(res=> {
                    if(res.data.success) {

                        clearInterval(that.UploadSucceedTimer);
                        that.$set(that.selectedVideo,'videoId',res.data.datas.videoBase.videoId)
                        that.$set(that.selectedVideo,'playURL',res.data.datas.playInfoList[0].playURL);
                        that.$set(that.selectedVideo,'coverURL',res.data.datas.videoBase.coverURL);
                        console.log(that.selectedVideo)
                    }else {

                    }   
                })
            },5000)
        },
        // 文件上传失败
        'onUploadFailed': function (uploadInfo, code, message) {
            console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
        },
        // 文件上传进度，单位：字节
        'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
            const per = '上传进度' + Math.ceil(loadedPercent * 100) + "%";
            const dom = document.querySelector('.weui-toast .weui-toast_content');
            if(dom) {
                dom.innerText = per;
            }else {
                $.showLoading(per);
            }
        },
        // 上传凭证超时
        'onUploadTokenExpired': function (uploadInfo) {
            console.log("onUploadTokenExpired");
            //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
            //https://help.aliyun.com/document_detail/55408.html
            //从点播服务刷新的uploadAuth,设置到SDK里        
            // Uploader.resumeUploadWithAuth(uploadAuth); 
        },
        //全部文件上传结束
        'onUploadEnd':function(uploadInfo){
            console.log("onUploadEnd: uploaded all the files");
        }
    });
}
 

 
