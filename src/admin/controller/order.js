const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const orderSn = this.get('orderSn') || '';
    const consignee = this.get('consignee') || '';
    const status = this.get('status');

    const model = this.model('order');
    console.log(status);
    if (status == '') {
        const data = await model.where({order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
        // console.log("9879879878");
        const newList = [];
        for (const item of data.data) {
          item.order_status_text = await this.model('order').getOrderStatusText(item.id);
          newList.push(item);
        }
        data.data = newList;
        return this.success(data);
      }else {
      const data = await model.where({order_status:status,order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
      const newList = [];
      for (const item of data.data) {
        item.order_status_text = await this.model('order').getOrderStatusText(item.id);
        newList.push(item);
      }
      data.data = newList;
      return this.success(data);
    }

  }
  async pendoutorderAction() {
    const page = this.post('page') || 1;
    const size = this.post('size') || 10;
    const orderSn = this.post('orderSn') || '';
    const consignee = this.post('consignee') || '';

    const model = this.model('order');
    const data = await model.where({order_status:201, order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }

  async pendpayorderAction() {
    const page = this.post('page') || 1;
    const size = this.post('size') || 10;
    const orderSn = this.post('orderSn') || '';
    const consignee = this.post('consignee') || '';

    const model = this.model('order');
    const data = await model.where({order_status:0, order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }

  async alreadyoutorderAction() {
    const page = this.post('page') || 1;
    const size = this.post('size') || 10;
    const orderSn = this.post('orderSn') || '';
    const consignee = this.post('consignee') || '';

    const model = this.model('order');
    const data = await model.where({order_status:300, order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      item.locgic = await this.model('order_express').where({order_id:item.id}).find()
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }
  async refundorderAction() {
    const page = this.post('page') || 1;
    const size = this.post('size') || 10;
    const orderSn = this.post('orderSn') || '';
    const consignee = this.post('consignee') || '';

    const model = this.model('order');
    const data = await model.where({order_status:400, order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      item.locgic = await this.model('order_express').where({order_id:item.id}).find()
      item.refund = await this.model('order_refund').where({order_sn:item.order_sn}).find()
      item.user = await this.model('user').where({id:item.user_id}).find()
      item.province_name = await this.model('region').where({ id: item.province }).getField('name', true);
      item.city_name = await this.model('region').where({ id: item.city }).getField('name', true);
      item.district_name = await this.model('region').where({ id: item.district }).getField('name', true);
      item.full_region = item.province_name + item.city_name + item.district_name;
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }

  async findpendpaygoodslistAction(){
    const orderId = this.post('orderid')
    console.log(orderId);
    const goodslist = await this.model('order_goods').where({order_id:orderId}).select()
    let true_list = []
    for (var i = 0; i < goodslist.length; i++) {
      // let obj = {}
      let a = await this.model('goods').where({id:goodslist[i].goods_id}).find()
      true_list.push(a)
      // return true_list
      // obj.
    }
    const goodsPrice = await this.model('order').where({id:orderId}).find()

    goodsPrice.province_name = await this.model('region').where({ id: goodsPrice.province }).getField('name', true);
    goodsPrice.city_name = await this.model('region').where({ id: goodsPrice.city }).getField('name', true);
    goodsPrice.district_name = await this.model('region').where({ id: goodsPrice.district }).getField('name', true);
    goodsPrice.full_region = goodsPrice.province_name + goodsPrice.city_name + goodsPrice.district_name;
    const logiclist = await this.model('shipper').select()
    const user = await this.model('user').where({id:goodsPrice.user_id}).find()
    // return this.success(goodslist,goodsPrice)
    return this.success({
      user:user,
      logiclist:logiclist,
      true_list:true_list,
      goodslist:goodslist,
      goodsPrice:goodsPrice
    })
  }

  async findTypeRegionAction(){
    const type = this.post('type')
    if (parseInt(type) == 1) {
      const list = await this.model('region').where({type: type}).select()
      return this.success({
        list:list
      })
    }else if (parseInt(type) == 2){
      const id = this.post('id')
      const list = await this.model('region').where({type: type,parent_id:id}).select()
      return this.success({
        list:list
      })
    }else if (parseInt(type) == 3){
      const id = this.post('id')
      const list = await this.model('region').where({type: type,parent_id:id}).select()
      return this.success({
        list:list
      })
    }

  }


  async setpendpayaddressAction(){
    const address = this.post('address')
    const orderid = this.post('orderid')
    const addresscode = this.post('regioncode')
    console.log(address);
    console.log(orderid);
    console.log(addresscode);
    const data = await this.model('order').where({id:orderid}).update({
      province:addresscode.first,
      city:addresscode.second,
      district:addresscode.third,
      consignee:address.name,
      address:address.address,
      mobile:address.phone,
    })
    return this.success(data)
  }

  async setpendpaymessageAction(){
    const message = this.post('message')
    const orderid = this.post('orderid')
    console.log(message);
    console.log(orderid);
    const data = await this.model('order').where({id:orderid}).update({
      postscript: message.buy_mes,
      admin_message: message.admin_mes
    })
    return this.success(data)
  }

  async setpendpaygoodsAction(){
    const price = this.post('all_price')
    const list = this.post('list')
    console.log(list);

    for (var i = 0; i < list.length; i++) {
      // array[i]
      await this.model('order_goods').where({id:list[i].id}).update({
        retail_price: parseInt(list[i].chaged_price)
      })
    }
    const data = await this.model('order').where({id: list[0].order_id}).update({
      actual_price: Number(price)
    })

    // const goodslist = await this.model('order_goods').where({order_id:orderId}).select()
    return this.success(data)
  }
  //发货
  async setlogiccompyAction(){
    const orderinfo = this.post('orderinfo')
    const goodslist = this.post('goodslist')
    const locgic = this.post('locgic')
    console.log(orderinfo);
    console.log(goodslist);
    console.log(locgic);
    const locgicinfo = await this.model('shipper').where({id:locgic.compy}).find()

    const have = await this.model('order_express').where({order_id:orderinfo.id}).select()
    if (have.length == 0) {
      const locgicc = await this.model('order_express').add({
        order_id:orderinfo.id,
        shipper_id: locgic.compy,
        shipper_name: locgicinfo.name,
        shipper_code: locgicinfo.code,
        logistic_code: locgic.compycode,
        add_time: new Date().getTime(),
      })
      await this.model('order').where({id:orderinfo.id}).update({
        order_status: 300,
        logistics_time: new Date().getTime(),
      })
      return this.success(locgicc)
    }else {
      return this.fail(17,'已存在!')
    }

  }

  //
  // async infoAction() {
  //   const id = this.post('id');
  //   const model = this.model('order');
  //   const data = await model.where({id: id}).find();
  //
  //   return this.success(data);
  // }

  async detailAction() {
    const orderId = this.post('orderId');
    const orderInfo = await this.model('order').where({ id: orderId }).find();

    if (think.isEmpty(orderInfo)) {
      return this.fail('订单不存在');
    }
    const userInfo = await this.model('user').where({ id: orderInfo.user_id }).find();
    const refundInfo = await this.model('order_refund').where({ order_sn: orderInfo.order_sn }).select();
    orderInfo.province_name = await this.model('region').where({ id: orderInfo.province }).getField('name', true);
    orderInfo.city_name = await this.model('region').where({ id: orderInfo.city }).getField('name', true);
    orderInfo.district_name = await this.model('region').where({ id: orderInfo.district }).getField('name', true);
    orderInfo.full_region = orderInfo.province_name + orderInfo.city_name + orderInfo.district_name;

    // const latestExpressInfo = await this.model('order_express').getLatestOrderExpress(orderId);
    // orderInfo.express = latestExpressInfo;

    const orderGoods = await this.model('order_goods').where({ order_id: orderId }).select();

    // 订单状态的处理
    orderInfo.order_status_text = await this.model('order').getOrderStatusText(orderId);
    orderInfo.add_time = orderInfo.add_time

    // orderInfo.final_pay_time = moment('001234', 'Hmmss').format('mm:ss');
    // // 订单最后支付时间
    // if (orderInfo.order_status === 0) {
    //   // if (moment().subtract(60, 'minutes') < moment(orderInfo.add_time)) {
    //   orderInfo.final_pay_time = moment('001234', 'Hmmss').format('mm:ss');
    //   // } else {
    //   //     //超过时间不支付，更新订单状态为取消
    //   // }
    // }

    // 订单可操作的选择,删除，支付，收货，评论，退换货
    // const handleOption = await this.model('order').getOrderHandleOption(orderId);

    return this.success({
      orderInfo: orderInfo,
      refundInfo: refundInfo,
      userInfo:userInfo,
      orderGoods: orderGoods,
    });
  }

  //退款成功后状态更新
  async refundSuccessAction(){
    const orderid = this.post('orderId');
    const time = this.post('time') || 0 ;
    console.log(orderid);
    console.log(time);
    const orderInfo = await this.model('order').where({id:orderid}).find()
    console.log(orderInfo);
    const refundorderInfo = await this.model('order_refund').where({order_sn:orderInfo.order_sn}).find()
    console.log(refundorderInfo);
    const updateRefund = await this.model('order_refund').where({order_sn:orderInfo.order_sn}).update({
      isRefund:1,
      refund_time: new Date().getTime(),
      state_text:"退款成功",
      state:503,//退款成功状态
    })
    const updateOrder = await this.model('order').where({id:orderid}).update({
      order_status:301,
      refund_is_success:1,
      refund_time: new Date().getTime(),

    })
  }
  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('order');
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('order').where({id: id}).limit(1).delete();

    // 删除订单商品
    await this.model('order_goods').where({order_id: id}).delete();

    // TODO 事务，验证订单是否可删除（只有失效的订单才可以删除）

    return this.success();
  }
  //拒绝申请的退款订单
  async canelrefundAction() {
    const orderid = this.post('orderid')
    // console.log(orderid);
    const orderinfo = await this.model('order').where({id:orderid}).find()
    const refundorderinfo = await this.model('order_refund').where({order_sn:orderinfo.order_sn}).find()
    const data = await this.model('order_refund').where({order_sn:orderinfo.order_sn}).update({
      state:1017,
      state_text:'已拒绝',
      handle_time:new Date().getTime(),
      rerund_num: Number(refundorderinfo.rerund_num) + 1
    })
    console.log(orderid,orderinfo,refundorderinfo);
    return this.success(data)
  }
};
