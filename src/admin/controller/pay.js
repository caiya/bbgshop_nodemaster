// const Base = require('./base.js');
const Base = require('./base.js');
const WeiXinPay = require('../../weixinpay');

module.exports = class extends Base {
  /**
   * 获取支付退款的请求参数
   * @returns {Promise<PreventPromise|void|Promise>}
   */
  async prerefundAction() {
    const orderId = this.post('orderId');
    console.log(orderId);
    const orderInfo = await this.model('order').where({ id: orderId }).find();
    // console.log("999999999999999999999999999999999");
    if (think.isEmpty(orderInfo)) {
      return this.fail(400, '订单已取消');
    }
    if (parseInt(orderInfo.pay_status) !== 0) {
      return this.fail(400, '订单已支付，请不要重复操作');
    }
    if (parseInt(orderInfo.actual_price * 100) == 0) {
      return this.fail(217, '订单价格为0');
    }
    const openid = await this.model('user').where({ id: orderInfo.user_id }).getField('weixin_openid', true);
    if (think.isEmpty(openid)) {
      return this.fail('openid为空');
    }
    const WeixinSerivce = this.service('weixin', 'admin');
    console.log(WeixinSerivce);
    try {
      // const returnParams = await WeixinSerivce.createUnifiedOrder({
      //   openid: openid,
      //   body: 'OrderNumber:' + orderInfo.order_sn,
      //   out_trade_no: orderInfo.order_sn,
      //   total_fee: parseInt(orderInfo.actual_price * 100),
      //   spbill_create_ip: '',
      // });
      const returnParams = await WeixinSerivce.createRefundOrder({
        out_trade_no: orderInfo.order_sn,
        total_fee: parseInt(orderInfo.goods_price * 100),
        spbill_create_ip: '',
      });
      console.log("77777777777777777777");
      // console.log(returnParams);
      console.log(orderInfo);
      return this.success(returnParams);
    } catch (err) {
      // console.log(err);
      return this.fail(err.return_msg);
    }
  }

  async notifyAction() {
    const WeixinSerivce = this.service('weixin', 'api');
    const result = WeixinSerivce.payNotify(this.post('xml'));
    if (!result) {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>`;
    }

    const orderModel = this.model('order');
    const orderInfo = await orderModel.getOrderByOrderSn(result.out_trade_no);
    if (think.isEmpty(orderInfo)) {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
    }

    if (orderModel.updatePayStatus(orderInfo.id, 2)) {
    } else {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
    }

    return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
  }
};
