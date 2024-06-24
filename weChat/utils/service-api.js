import utils from "./index";
const app = getApp()

// 站内消息-查询列表
export function siteMessageList(params, callback){
  utils.get('/convenience-server/wxapp/custom/site-message/001/list', params, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 站内消息-查询详情
export function siteMessageDetail(msgId, callback){
  utils.get('/convenience-server/wxapp/custom/site-message/001/detail', {
    msgId: msgId
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 查询商家列表
export function serviceProviderList(params, callback){
  utils.get('/convenience-server/wxapp/custom/service-provider/001/list', {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    category: params.category
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })

  // if(params.category == 3) {
  //   callback({
  //     totalRecords: 1,
  //     recordList: [{
  //       cspId: '1003'
  //     }]
  //   })
  // }else if(params.category == 4) {
  //   callback({
  //     totalRecords: 1,
  //     recordList: [{
  //       cspId: '1004'
  //     }]
  //   })
  // }
}

// 陪护陪诊-查询护工列表
export function serveWorkerList(params, callback){
  utils.get('/convenience-server/wxapp/custom/serve-worker/001/list', {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    cspId: params.cspId,
    status:1
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })

  // if(params.cspId == '1003') {
  //   callback({
  //     totalRecords: 3,
  //     recordList: [{
  //       workerId: '1003001',
  //       cspId: '1003',
  //       workerName: '项秋翠',
  //       photoFileId: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //       price: '200',
  //       qualifications: '护工证',
  //       score: '4.8',
  //       age: '46',
  //       workAge: '5',
  //     }, {
  //       workerId: '1003002',
  //       cspId: '1003',
  //       workerName: '项秋翠2',
  //       photoFileId: '',
  //       price: '300',
  //       qualifications: '护工证,护师证',
  //       score: '4.5',
  //       age: '46',
  //       workAge: '3',
  //     }, {
  //       workerId: '1003003',
  //       cspId: '1003',
  //       workerName: '项秋翠3',
  //       photoFileId: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //       price: '200',
  //       qualifications: '',
  //       score: '4.3',
  //       age: '41',
  //       workAge: '2',
  //     }]
  //   })
  // }else if(params.cspId == '1004') {
  //   callback({
  //     totalRecords: 3,
  //     recordList: [{
  //       workerId: '1004001',
  //       cspId: '1003',
  //       workerName: '项秋翠',
  //       photoFileId: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //       price: '200',
  //       halfPrice: '150',
  //       qualifications: '经验丰富',
  //       score: '4.8',
  //       age: '46',
  //       workAge: '5',
  //     }, {
  //       workerId: '1004002',
  //       cspId: '1003',
  //       workerName: '项秋翠2',
  //       photoFileId: '',
  //       price: '300',
  //       halfPrice: '200',
  //       qualifications: '经验丰都,责任心强,热情',
  //       score: '4.5',
  //       age: '46',
  //       workAge: '3',
  //     }, {
  //       workerId: '1004003',
  //       cspId: '1003',
  //       workerName: '项秋翠3',
  //       photoFileId: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //       price: '200',
  //       halfPrice: '150',
  //       qualifications: '',
  //       score: '4.3',
  //       age: '41',
  //       workAge: '2',
  //     }]
  //   })
  // }
}

// 陪护陪诊-查询护工详情
export function serveWorkerDetail(params, callback){
  utils.get('/convenience-server/wxapp/custom/serve-worker/001/detail', {
    workerId: params.workerId,
    cspId: params.cspId,
    status:1
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })

  // if(params.workerId == '1003001') {
  //   callback({
  //     workerName: '项秋翠5',
  //     photoFileId: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //     score: '4.8',
  //     qualifications: '护工证,护师证',
  //     serveCount: 118,
  //     applauseRate: '95%',
  //     commentCount: 78,
  //     age: '41',
  //     gender: '女',
  //     workAge: '2',
  //     introduction: '熟悉医院环境及流程，让就医更加轻松简单，诊前提醒、就诊陪护、预约检查、送取标本、缴费取药、输液陪伴等。我会随时为您关注医生出诊动态，避免医生临时停诊导致您白跑一题，为您提供就诊经验与指导，耐心阳伴您完成全流程就诊。',
  //     priceDes: '陪护时间为当天0:00-24:00，不足一天按一天计费。按实际工作情况支付，可多退少补。',
  //     price: '200',
  //     job: '1，照顾病人的日常生活起居，比如喂饭、喂水、洗澡助浴、搀扶上厕所、换尿布、大小便处理、病患的个人卫生清洁，换洗衣物等；2，和病人聊天解闷，做一些心理辅导，减少负面情绪。3，会一些康复训练技能和物理治疗方法：比如手法按摩、成人推拿等，缓解病人的疼痛。4，会看医院ICU（重症监护室）的仪器设备,懂正常血压、正常血糖，打胰岛素等等。',
  //     commentGood: 70,
  //     commentBad: 8,
  //     commentList: [{
  //       nickName: 'wansi',
  //       avatarUrl: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //       score: 5,
  //       comment: '护工阿姨人很勤快，把老人照顾的很好。',
  //       commentTime: '2023-09-09',
  //       commentType: 1
  //     },{
  //       nickName: 'wansi',
  //       avatarUrl: '',
  //       score: 4,
  //       comment: '护工阿姨人很勤快，把老人照顾的很好。',
  //       commentTime: '2023-09-09',
  //       commentType: 1
  //     },{
  //       nickName: 'wansi',
  //       avatarUrl: '',
  //       score: 1,
  //       comment: '差评。',
  //       commentTime: '2023-09-09',
  //       commentType: -1
  //     },{
  //       nickName: 'wansi',
  //       avatarUrl: '',
  //       score: 2,
  //       comment: '一般。',
  //       commentTime: '2023-09-09',
  //       commentType: 0
  //     }]
  //   })
  // }else if(params.workerId == '1004001') {
  //   callback({
  //     workerName: '项秋翠6',
  //     photoFileId: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //     score: '4.8',
  //     qualifications: '经验丰富,责任心强,热情',
  //     serveCount: 118,
  //     applauseRate: '95%',
  //     commentCount: 78,
  //     age: '41',
  //     gender: '女',
  //     workAge: '2',
  //     introduction: '熟悉医院环境及流程，让就医更加轻松简单，诊前提醒、就诊陪护、预约检查、送取标本、缴费取药、输液陪伴等。我会随时为您关注医生出诊动态，避免医生临时停诊导致您白跑一题，为您提供就诊经验与指导，耐心阳伴您完成全流程就诊。',
  //     priceDes: '陪护时间为当天0:00-24:00，不足一天按一天计费。按实际工作情况支付，可多退少补。',
  //     price: '200',
  //     halfPrice: '150',
  //     job: '1，照顾病人的日常生活起居，比如喂饭、喂水、洗澡助浴、搀扶上厕所、换尿布、大小便处理、病患的个人卫生清洁，换洗衣物等；2，和病人聊天解闷，做一些心理辅导，减少负面情绪。3，会一些康复训练技能和物理治疗方法：比如手法按摩、成人推拿等，缓解病人的疼痛。4，会看医院ICU（重症监护室）的仪器设备,懂正常血压、正常血糖，打胰岛素等等。',
  //     commentGood: 70,
  //     commentBad: 8,
  //     commentList: [{
  //       nickName: 'wansi',
  //       avatarUrl: 'https://img01.yzcdn.cn/vant/sand.jpg',
  //       score: 5,
  //       comment: '陪诊师人很好，对流程很熟悉，很满意。',
  //       commentTime: '2023-09-09',
  //       commentType: 1
  //     },{
  //       nickName: 'wansi',
  //       avatarUrl: '',
  //       score: 4,
  //       comment: '护工阿姨人很勤快，把老人照顾的很好。',
  //       commentTime: '2023-09-09',
  //       commentType: 1
  //     },{
  //       nickName: 'wansi',
  //       avatarUrl: '',
  //       score: 1,
  //       comment: '差评。',
  //       commentTime: '2023-09-09',
  //       commentType: -1
  //     },{
  //       nickName: 'wansi',
  //       avatarUrl: '',
  //       score: 2,
  //       comment: '一般。',
  //       commentTime: '2023-09-09',
  //       commentType: 0
  //     }]
  //   })
  // }
}

// 陪护陪诊--下单
export function serveOrderCreate(params, callback){
  utils.get('/convenience-server/wxapp/custom/serve-order/001/create', params).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 陪护陪诊--查询订单详情
export function serveOrderDetail(outTradeNo, callback){
  utils.get('/convenience-server/wxapp/custom/serve-order/001/detail', {
    outTradeNo: outTradeNo
  }).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 订单管理--确认完成
export function myOrderConfirm(outTradeNo, callback){
  utils.post('/convenience-server/wxapp/custom/my-order/001/confirm', {
    outTradeNo: outTradeNo
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 故障报修-查询我的报修单
export function faultOrderList(params, callback){
  utils.get('/convenience-server/wxapp/custom/fault-order/001/list', {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    category: params.category
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 故障报修-查询我的报修单（工程师端）
export function merchantFaultOrderList(params, callback){
  utils.get('/convenience-server/wxapp/merchant/fault-order/001/list', {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    category: params.category,
    userId: params.userId,
    orderStatus: params.orderStatus
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 故障报修-查询订单详情
export function faultOrderDetail(outTradeNo, callback){
  utils.get('/convenience-server/wxapp/custom/fault-order/001/detail', {
    outTradeNo: outTradeNo
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}

// 2.5.3 故障报修--确认完成
export function faultOrderConfirm(outTradeNo, callback){
  utils.post('/convenience-server/wxapp/merchant/fault-order/001/confirm', {
    outTradeNo: outTradeNo
  }, {type: 'FORM'}).then((data) => {
    if(callback){
      callback(data);
    }
  }).catch((err) => {
    console.error(err);
  })
}