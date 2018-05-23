const Base = require('./base.js');
/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */

const SMSClient = require('@alicloud/sms-sdk')

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换 think.config('vaptcha.vid')
const accessKeyId = think.config('SMSClient.accessKeyId')
const secretAccessKey = think.config('SMSClient.secretAccessKey')

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = think.config('SMSClient.queueName')

//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

// smsClient.sendBatchSMS({
//     PhoneNumberJson: JSON.stringify(['18040580000', '15088650000']),
//     SignNameJson: JSON.stringify(['短信迁移测试签名','短信迁移测试签名']),
//     TemplateCode: 'SMS_71175823',
//     TemplateParamJson: JSON.stringify([{code: "1234", product: "ytx1"}, {code: "5678", product: "ytx2"}]),
// }).then(function (res) {
//     let {Code}=res
//     if (Code === 'OK') {
//        //处理返回参数
//        console.log(res)
//     }
// }, function (err) {
//     console.log('err', err)
// })


// //短信回执报告
// smsClient.receiveMsg(0, queueName).then(function (res) {
//     //消息体需要base64解码
//     let {code, body}=res
//     if (code === 200) {
//         //处理消息体,messagebody
//         console.log(body)
//     }
// }, function (err) {
//     console.log(err)
// })

// //短信上行报告
// smsClient.receiveMsg(1, queueName).then(function (res) {
//     //消息体需要base64解码
//     let {code, body}=res
//     if (code === 200) {
//         //处理消息体,messagebody
//         console.log(body)
//     }
// }, function (err) {
//     console.log(err)
// })


// //查询短信发送详情
// smsClient.queryDetail({
//     PhoneNumber: '1500000000',
//     SendDate: '20170731',
//     PageSize: '10',
//     CurrentPage: "1"
// }).then(function (res) {
//     let {Code, SmsSendDetailDTOs}=res
//     if (Code === 'OK') {
//         //处理发送详情内容
//         console.log(SmsSendDetailDTOs)
//     }
// }, function (err) {
//     //处理错误
//     console.log(err)
// })


module.exports = class extends Base {
  // async listAction() {
  //   const couponList = await this.model('user_coupon_copy').select();
  //   const couponPrice = 0.00; // 使用优惠券减免的金额
  //   return this.success({
  //     couponList:couponList,
  //     couponPrice:couponPrice,
  //     abc:"123"
  //   })
  // }
  async findAction() {
    // const couponId = this.get("couponId")
    const result = await this.model('user').where({ id: think.userId}).find();

    return this.success({
      Result:result,
      abc:"123"
    })
  }
  async textAction() {
    const Phone = this.post('Phone');
    // let Abc = this.validateErrors
    return this.success({
      Phone:Phone,
    }
    );
  }
  //发送验证码
  async sedsodeAction() {
    const Phone = this.post('phone');
    var Num="";
      for(var i=0;i<6;i++)
      {
      Num+=Math.floor(Math.random()*10);
      }
      console.log(Num);
          //发送短信
      smsClient.sendSMS({
          PhoneNumbers: Phone,
          SignName: '贝堡Shop',
          TemplateCode: 'SMS_130795032',
          TemplateParam: '{"code":'+Num+'}'
      }).then(function (res) {
          let {Code}=res
          if (Code === 'OK') {
              //处理返回参数
              console.log(res)
          }
      }, function (err) {
          console.log(err)
      })


    return this.success({
      Phone:Phone,
      num:Num
    }
    );
  }

  // 验证验证码
  async checksodeAction() {
    const Phone = this.post("phone")
    const Code = this.post("code")

    // const findresult = await this.model('user').where({ id: think.userId}).update({ mobile: bing});
    // const result = await this.model('user').where({ id: think.userId }).update({ phone: bing});
    return this.success({Phone,Code})
  }



  async bingAction() {
    const bing = this.get("bingphone")
    const findresult = await this.model('user').where({ id: think.userId}).update({ mobile: bing});
    // const result = await this.model('user').where({ id: think.userId }).update({ phone: bing});
    return this.success({
      Findresult:findresult,
      // Result:result,
      bingphone:bing,
      // abc:"123"
    })
  }

};
