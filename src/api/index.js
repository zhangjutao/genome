import axios from 'axios'
import window from '@/../static/config.js'
let baseURLStr = window.g.ApiUrl;
let contextPath = baseURLStr;

const Axios = axios.create();

export const versionBaseinfo = (val) => {//获取version请求
  if(val){
    return Axios.get(contextPath + '/query/versionBaseinfo'+"?version="+val
    ).then(res => res.data)
  }else{
    return Axios.get(contextPath + '/query/versionBaseinfo'
  ).then(res => {
    var versionnick = [];
    var versionlist = [];
    for(var i = 0; i < res.data.length; i++) {
      var tempobj = {};
      tempobj['versionName'] = res.data[i].version;
      tempobj['nickName'] = res.data[i].nickname;
      tempobj['fullName'] = res.data[i].fullName;
      //tempobj[res.data[i].version] = res.data[i].nickname;
      versionnick.push(tempobj);

      var tmp = {};
      tmp['versionName'] = res.data[i].version;
      tmp['fullName'] = res.data[i].fullName;
      versionlist.push(tmp);
    }
    localStorage.setItem("versionnick",JSON.stringify(versionnick));
    return versionlist;
  })
  }

}
export const Geneinfo  = (val) => { //获取搜索结果请求
  return Axios({
      url: contextPath + '/search',
      method: 'post',
      data:val,
      dataType : 'json',
      contentType : 'application/json;charset=UTF-8',
    
    })
    .then(res => res.data)
}
export const GetRapeInfoByGNAndGG  = (data) => { //获取搜索结果请求
  return Axios({
      url: 'http://47.96.185.131:82/api/CYJYFX/GetRapeInfoByGNAndGG',
      method: 'post',
      data,
      dataType : 'json',
      contentType : 'application/json;charset=UTF-8',
    
    })
    .then(res => res.data)
}
export const versionDownloadInfo  = () => { //获取搜索结果请求
  return Axios({
      url: contextPath + '/query/versionDownloadInfo',
      method: 'post',
      dataType : 'json',
      contentType : 'application/json;charset=UTF-8',
    
    })
    .then(res => res.data)
}

export const mapInfo = () => {
  return Axios({
    url: contextPath + '/index/list',
    method: 'get',
    dataType : 'json',
    contentType : 'application/json;charset=UTF-8',  
  })
  .then(res => res.data)
}

export const newInfo = () => {
  return Axios({
    url: contextPath + '/query/newsList',
    method: 'get',
    dataType : 'json',
    contentType : 'application/json;charset=UTF-8',
  })
  .then(res => res.data)
}

export const geneBaseInfo  = (val) => { //获取搜索结果请求
  return Axios({
      url: contextPath + '/detail/basic',
      method: 'post',
      data:val,
      dataType : 'json',
      contentType : 'application/json;charset=UTF-8',
    
    })
    .then(res => res.data)
}


export const getSequenceInfo  = (val) => { //获取搜索结果请求
  return Axios({
      url: contextPath + '/detail/sequence',
      method: 'post',
      data:val,
      dataType : 'json',
      contentType : 'application/json;charset=UTF-8',
    
    })
    .then(res => res.data)
}

export const geneAnno  = (val) => { //获取搜索结果请求
  return Axios({
      url: contextPath + '/detail/anno',
      method: 'post',
      data:val,
      dataType : 'json',
      contentType : 'application/json;charset=UTF-8',
    
    })
    .then(res => res.data)
}

export const getstrucInfo = (val) => {
  return Axios({
    url: contextPath + '/detail/structure',
    method: 'post',
    data:val,
    dataType : 'json',
    contentType : 'application/json;charset=UTF-8',
  
  })
  .then(res => res.data)
}

export const downloadSeq = (val) => {
  return Axios({
    url: contextPath + '/detail/structure/downloadTranscriptSeq',
    method: 'post',
    data:val,
    dataType : 'json',
    contentType : 'application/json;charset=UTF-8',
    responseType: 'blob'
  })
  .then(res => res.data)
}

export const geneDownloadInfo = (data) => {
  return Axios({
    url: contextPath + '/getGeneIdList ',
    method: 'post',
    data:data,
    dataType : 'json',
    contentType : 'application/json;charset=UTF-8',
  
  })
  .then(res => res.data)
}

export const chrList = (val) => {
  return Axios({
    url: contextPath + '/versionAndChrList',
    method: 'post',
    data:val,
    dataType : 'json',
    contentType : 'application/json;charset=UTF-8',
  
  })
  .then(res => res.data)
}

// 后台接口 cgj
export const update = (data) => { //编辑其他发送请求
  return Axios({
          url: contextPath + '/content/update',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const otherAdd = (data) => { //添加其他发送请求
  return Axios({
          url: contextPath + '/content/add',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',
      })
      .then(res => res.data)
}


export const oDelete = (data) => { //其他列表删除发送请求
  return Axios({
          url: contextPath + '/content/delete',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const otherDate = (data) => { //其他排序
  return Axios({
          url: contextPath + '/content/orderby',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}


export const SchoolAdd = (data) => { //添加学校发送请求
  return Axios({
          url: contextPath + '/school/add',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const schoolEnitDate = (data) => { //编辑学校发送请求
  return Axios({
          url: contextPath + '/school/update',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const sDelete = (data) => { //学校列表删除发送请求
  return Axios({
          url: contextPath + '/school/delete',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const SotherDate = (data) => { //学校排序
  return Axios({
          url: contextPath + '/school/orderby',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const releaseData = (data) => {//学校发布
  return Axios({
          url: contextPath + '/school/batchUpdate',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const releaseDataQ = (data) => {//其他发布
  return Axios({
          url: contextPath + '/content/batchUpdate',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const relSchoolListData = (data) => {//学校发布正式
  return Axios({
          url: contextPath + '/school/list',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',

      })
      .then(res => res.data)
}

export const relOtherListData = (data) => {//其他发布正式
  return Axios({
          url: contextPath + '/content/list',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',
      })
      .then(res => res.data)
}
 

export const downBtnData = (data) => {//下载序列
  return Axios({
          url: contextPath + '/downGeneSequence',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',
      })
      .then(res => res.data)
}

export const blastInfo = (data) => {//首页blast
  return Axios({
          url: contextPath + '/blastInfo',
          method: 'post',
          dataType: 'json',
          data: data,
          contentType: 'application/json;charset=UTF-8',
      })
      .then(res => res.data)
}

