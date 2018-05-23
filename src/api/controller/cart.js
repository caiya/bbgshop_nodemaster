const Base = require('./base.js');

module.exports = class extends Base {
  async checkskuAction() {
    const checked = this.post('checkedGoods')
    let outsku = []
    for (var i = 0; i < checked.length; i++) {
      // array[i]
      // let obj = {}
      console.log(checked[i].goods_specifition_ids);
      const a = await this.model('product').where({goods_specification_ids:checked[i].goods_specifition_ids}).select()
      console.log(a);
      if (a.length == 0) {
        //库存被改变
        outsku.push(checked[i])
        // return this.fail(17,'库存被改变',outsku);
      }else {
        //库存没变
        // return this.fail(0,'库存没变');
      }
    }
    return this.success(outsku);
    // console.log(outsku);
  }
  // async delchangeskuAction(){
  //   const chagesku = this.post('chagesku')
  //   for (var i = 0; i < chagesku.length; i++) {
  //     // array[i]
  //     await this.model('cart').where({product_id:chagesku[i].product_id).delete()
  //
  //   }
  //   // return this.success(chagesku)
  // }
  /**
   * 获取购物车中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  async getCart() {
    const cartList = await this.model('cart').where({user_id: think.userId, session_id: 1}).select();
    // 获取购物车统计信息
    let goodsCount = 0;
    let goodsAmount = 0.00;
    let checkedGoodsCount = 0;
    let checkedGoodsAmount = 0.00;
    for (const cartItem of cartList) {
      goodsCount += cartItem.number;
      goodsAmount += cartItem.number * cartItem.retail_price;
      if (!think.isEmpty(cartItem.checked)) {
        checkedGoodsCount += cartItem.number;
        checkedGoodsAmount += cartItem.number * cartItem.retail_price;
      }

      // 查找商品的图片
      cartItem.list_pic_url = await this.model('goods').where({id: cartItem.goods_id}).getField('list_pic_url', true);
    }

    return {
      cartList: cartList,
      cartTotal: {
        goodsCount: goodsCount,
        goodsAmount: goodsAmount,
        checkedGoodsCount: checkedGoodsCount,
        checkedGoodsAmount: checkedGoodsAmount
      }
    };
  }

  /**
   * 获取购物车信息，所有对购物车的增删改操作，都要重新返回购物车的信息
   * @return {Promise} []
   */
  async indexAction() {
    return this.success(await this.getCart());
  }


  /**
   * 立即购买
   * @returns {Promise.<*>}
   */
  async addcopyAction() {
    const goodsId = this.post('goodsId');
    const productId = this.post('productId');
    const number = this.post('number');

    // console.log(goodsId);
    // console.log(productId);
    // console.log(number);
    // 判断商品是否可以购买
    const goodsInfo = await this.model('goods').where({id: goodsId}).find();
    console.log(goodsInfo);
    if (think.isEmpty(goodsInfo) || goodsInfo.is_delete === 1) {
      return this.fail(400, '商品已下架');
    }

    // 取得规格的信息,判断规格库存
    const productInfo = await this.model('product').where({goods_id: goodsId, id: productId}).find();
    console.log(productInfo);
    if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
      return this.fail(400, '库存不足');
    }

    // 判断购物车中是否存在此规格商品
    const cartInfo = await this.model('cart').where({user_id:think.userId, goods_id: goodsId, product_id: productId}).find();
    console.log("9999999999999999999999999999");
    console.log(cartInfo);
    if (think.isEmpty(cartInfo)) {
      // 添加操作

      // 添加规格名和值
      let goodsSepcifitionValue = [];
      if (!think.isEmpty(productInfo.goods_specification_ids)) {
        goodsSepcifitionValue = await this.model('goods_specification').where({
          goods_id: goodsId,
          id: {'in': productInfo.goods_specification_ids.split('_')}
        }).getField('value');
      }
      console.log(goodsSepcifitionValue);
      // 添加到购物车
      // const cartData = {
      //   goods_id: goodsId,
      //   product_id: productId,
      //   goods_sn: productInfo.goods_sn,
      //   goods_name: goodsInfo.name,
      //   list_pic_url: goodsInfo.list_pic_url,
      //   number: number,
      //   session_id: 1,
      //   user_id: think.userId,
      //   retail_price: productInfo.retail_price,
      //   market_price: productInfo.retail_price,
      //   goods_specifition_name_value: goodsSepcifitionValue.join(';'),
      //   goods_specifition_ids: productInfo.goods_specification_ids,
      //   checked: 1
      // };
      const cartData = await this.model('cart').add({
        goods_id: goodsId,
        product_id: productId,
        goods_sn: productInfo.goods_sn,
        goods_name: goodsInfo.name,
        list_pic_url: goodsInfo.list_pic_url,
        number: number,
        session_id: 1,
        user_id: think.userId,
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        goods_specifition_name_value: goodsSepcifitionValue.join(';'),
        goods_specifition_ids: productInfo.goods_specification_ids,
        checked: 1
      });
      console.log(cartData);
      // const data = ''
      return this.success(await this.getCart());
    } else {
      // 如果已经存在购物车中，则数量增加

      if (productInfo.goods_number < (number + cartInfo.number)) {
        return this.fail(400, '库存不足');
      }else {
        await this.model('cart').where({user_id: think.userId}).update({ checked: 0});
        await this.model('cart').where({user_id: think.userId,product_id: productId,goods_id: goodsId}).update({ checked: 1});

      }

      return this.success(await this.getCart(),200);
      // return this.fail(200, '商品存在购物车');
      //商品存在购物车
      // return this.success(200);

      // await this.model('cart').where({
      //   goods_id: goodsId,
      //   product_id: productId,
      //   id: cartInfo.id
      // }).increment('number', number);
      // const data = 200
    }

  }





  /**
   * 添加商品到购物车
   * @returns {Promise.<*>}
   */
  async addAction() {
    const goodsId = this.post('goodsId');
    const productId = this.post('productId');
    const number = this.post('number');

    // 判断商品是否可以购买
    const goodsInfo = await this.model('goods').where({id: goodsId}).find();
    if (think.isEmpty(goodsInfo) || goodsInfo.is_delete === 1) {
      return this.fail(400, '商品已下架');
    }

    // 取得规格的信息,判断规格库存
    const productInfo = await this.model('product').where({goods_id: goodsId, id: productId}).find();
    if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
      return this.fail(400, '库存不足');
    }

    // 判断购物车中是否存在此规格商品
    const cartInfo = await this.model('cart').where({user_id:think.userId,goods_id: goodsId, product_id: productId}).find();
    if (think.isEmpty(cartInfo)) {
      // 添加操作

      // 添加规格名和值
      let goodsSepcifitionValue = [];
      if (!think.isEmpty(productInfo.goods_specification_ids)) {
        goodsSepcifitionValue = await this.model('goods_specification').where({
          goods_id: goodsId,
          id: {'in': productInfo.goods_specification_ids.split('_')}
        }).getField('value');
      }

      // 添加到购物车
      // const cartData = {
      //   goods_id: goodsId,
      //   product_id: productId,
      //   goods_sn: productInfo.goods_sn,
      //   goods_name: goodsInfo.name,
      //   list_pic_url: goodsInfo.list_pic_url,
      //   number: number,
      //   session_id: 1,
      //   user_id: think.userId,
      //   retail_price: productInfo.retail_price,
      //   market_price: productInfo.retail_price,
      //   goods_specifition_name_value: goodsSepcifitionValue.join(';'),
      //   goods_specifition_ids: productInfo.goods_specification_ids,
      //   checked: 0
      // };

      // await this.model('cart').thenAdd(cartData, {product_id: productId});
      await this.model('cart').add({
        goods_id: goodsId,
        product_id: productId,
        goods_sn: productInfo.goods_sn,
        goods_name: goodsInfo.name,
        list_pic_url: goodsInfo.list_pic_url,
        number: number,
        session_id: 1,
        user_id: think.userId,
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        goods_specifition_name_value: goodsSepcifitionValue.join(';'),
        goods_specifition_ids: productInfo.goods_specification_ids,
        checked: 0
      });
    } else {
      // 如果已经存在购物车中，则数量增加
      if (productInfo.goods_number < (number + cartInfo.number)) {
        return this.fail(400, '库存不足');
      }

      await this.model('cart').where({
        user_id: think.userId,
        goods_id: goodsId,
        product_id: productId,
        id: cartInfo.id
      }).increment('number', number);
    }
    return this.success(await this.getCart());
  }

  // 更新指定的购物车信息
  async updateAction() {
    const goodsId = this.post('goodsId');
    const productId = this.post('productId'); // 新的product_id
    const id = this.post('id'); // cart.id
    const number = parseInt(this.post('number')); // 不是

    // 取得规格的信息,判断规格库存
    const productInfo = await this.model('product').where({goods_id: goodsId, id: productId}).find();
    if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
      return this.fail(400, '库存不足');
    }

    // 判断是否已经存在product_id购物车商品
    const cartInfo = await this.model('cart').where({user_id: think.userId,id: id}).find();
    console.log(cartInfo);
    // 只是更新number
    if (cartInfo.product_id === productId) {
      await this.model('cart').where({user_id: think.userId,id: id}).update({
        number: number
      });

      return this.success(await this.getCart());
    }

    // const newCartInfo = await this.model('cart').where({goods_id: goodsId, product_id: productId}).find();
    // if (think.isEmpty(newCartInfo)) {
    //   // 直接更新原来的cartInfo
    //
    //   // 添加规格名和值
    //   let goodsSepcifition = [];
    //   if (!think.isEmpty(productInfo.goods_specification_ids)) {
    //     goodsSepcifition = await this.model('goods_specification').field(['nideshop_goods_specification.*', 'nideshop_specification.name']).join('nideshop_specification ON nideshop_specification.id=nideshop_goods_specification.specification_id').where({
    //       'nideshop_goods_specification.goods_id': goodsId,
    //       'nideshop_goods_specification.id': {'in': productInfo.goods_specification_ids.split('_')}
    //     }).select();
    //   }
    //
    //   const cartData = {
    //     number: number,
    //     goods_specifition_name_value: JSON.stringify(goodsSepcifition),
    //     goods_specifition_ids: productInfo.goods_specification_ids,
    //     retail_price: productInfo.retail_price,
    //     market_price: productInfo.retail_price,
    //     product_id: productId,
    //     goods_sn: productInfo.goods_sn
    //   };
    //   console.log("9999999999999999999999999999");
    //   await this.model('cart').where({id: id}).update(cartData);
    // } else {
    //   // 合并购物车已有的product信息，删除已有的数据
    //   const newNumber = number + newCartInfo.number;
    //
    //   if (think.isEmpty(productInfo) || productInfo.goods_number < newNumber) {
    //     return this.fail(400, '库存不足');
    //   }
    //
    //   await this.model('cart').where({id: newCartInfo.id}).delete();
    //
    //   const cartData = {
    //     number: newNumber,
    //     goods_specifition_name_value: newCartInfo.goods_specifition_name_value,
    //     goods_specifition_ids: newCartInfo.goods_specification_ids,
    //     retail_price: productInfo.retail_price,
    //     market_price: productInfo.retail_price,
    //     product_id: productId,
    //     goods_sn: productInfo.goods_sn
    //   };
    //   console.log("888888888888888888888888888888888");
    //
    //   await this.model('cart').where({id: id}).update(cartData);
    // }

    return this.success(await this.getCart());
  }

  // 是否选择商品，如果已经选择，则取消选择，批量操作
  async checkedAction() {
    let productId = this.post('productIds').toString();
    const isChecked = this.post('isChecked');

    if (think.isEmpty(productId)) {
      return this.fail('删除出错');
    }

    productId = productId.split(',');
    await this.model('cart').where({user_id: think.userId,product_id: {'in': productId}}).update({checked: parseInt(isChecked)});

    return this.success(await this.getCart());
  }



  // 删除选中的购物车商品，批量删除




  // 删除选中的购物车商品，批量删除
  async deleteAction() {
    let productId = this.post('productIds');
    if (!think.isString(productId)) {
      return this.fail('删除出错');
    }

    productId = productId.split(',');

    await this.model('cart').where({user_id: think.userId,product_id: {'in': productId}}).delete();

    return this.success(await this.getCart());
  }

  // 获取购物车商品的总件件数
  async goodscountAction() {
    const cartData = await this.getCart();
    return this.success({
      cartTotal: {
        goodsCount: cartData.cartTotal.goodsCount
      }
    });
  }

  // /**
  //  * 获取购物车中收到的商品
  //  * @returns {Promise.<*>}
  //  */
  // async checkederAction() {
  //    const goodsId = this.get("goodsId")
  //   // const goodsList = await this.model('cart').where({user_id: think.userId, session_id: 1, checked: 1}).select();
  //   return goodsId
  // }


  /**
   * 订单提交前的检验和填写相关订单信息
   * @returns {Promise.<void>}
   */
  async checkoutAction() {
    const addressId = this.get('addressId'); // 收货地址id
    const couponId = this.get('couponId'); // 使用的优惠券id
    console.log(couponId);
    // console.log(parseInt(couponId))
    // if (typeof(couponId) == "NaN") {
    //   console.log("123456789");
    // }
    // 选择的收货地址
    const addressInfo = await this.model('address').where({user_id: think.userId}).select();
    let checkedAddress = new Array();
    if (think.isEmpty(addressId)) {
        // let abc = "123"
      checkedAddress = await this.model('address').where({user_id: think.userId}).select();

    } else {
      // let abc = "000"
      checkedAddress = await this.model('address').where({id: addressId, user_id: think.userId}).find();

    }

    if (!think.isEmpty(checkedAddress)) {
      checkedAddress.province_name = await this.model('region').getRegionName(checkedAddress.province_id);
      checkedAddress.city_name = await this.model('region').getRegionName(checkedAddress.city_id);
      checkedAddress.district_name = await this.model('region').getRegionName(checkedAddress.district_id);
      checkedAddress.full_region = checkedAddress.province_name + checkedAddress.city_name + checkedAddress.district_name;
    }
    // if (think.isEmpty(checkedAddress)) {
    //     // let abc = 132
    // }


    // 根据收货地址计算运费
    const freightPrice = 0;

    // 获取要购买的商品
    const cartData = await this.getCart();
    const checkedGoodsList = cartData.cartList.filter(function(v) {
      return v.checked === 1;
    });

    // 获取可用的优惠券信息，功能还示实现
    const goodsTotalPrice = cartData.cartTotal.checkedGoodsAmount; // 商品总价

    const couponList = await this.model('coupon_user').where({user_id:think.userId,used_type:0}).select()
    let cupprice = 0
    if (parseInt(couponId) == 0) {
      // console.log("000000000000000000000000");
      // const couponPrice = 0.00
      cupprice = 0

    }else {
      // cupprice = 0
      let selcup = await this.model('coupon_user').where({user_id:think.userId,coupon_id:couponId}).find()
      if (selcup.coupon_type == 0) {
        cupprice = (selcup.coupon_value / 1).toFixed(2)
      }else if (selcup.coupon_type == 1){
        cupprice = (goodsTotalPrice - (goodsTotalPrice * ( selcup.coupon_value / 10 ))).toFixed(2)
      }
    }
    // let itemKey = 0;
    // let couponUserList = []
    // for (const couponItem of couponallList) {
    //   if (couponItem.point_user == '') {
    //     let obj = {}
    //     obj = couponItem
    //     obj.start_time = new Date(couponItem.validity_start * 1).toLocaleString();
    //     obj.end_time = new Date(couponItem.validity_end * 1).toLocaleString();
    //     couponUserList.push(obj)
    //   }else if (couponItem.point_user !== '') {
    //     let str = couponItem.point_user
    //     let couid = couponItem.coupon_id
    //     let arr = str.split(",")
    //     for (var i = 0; i < arr.length; i++) {
    //       console.log(think.userId);
    //       if (arr[i] == think.userId) {
    //         console.log("bingo");
    //         const couponUser = await this.model('coupon_user').where({user_id: think.userId,coupon_id:couid}).select()
    //         let objj = {}
    //         objj = couponUser[0]
    //         objj.start_time = new Date(couponUser[0].validity_start * 1).toLocaleString();
    //         objj.end_time = new Date(couponUser[0].validity_end * 1).toLocaleString();
    //         couponUserList.push(objj)
    //       }
    //     }
    //     console.log(arr);
    //   }
    //   itemKey += 1;
    // }
    // console.log(couponUserList);
    const couponPrice = cupprice; // 使用优惠券减免的金额

    // const couponList = couponUserList;
    // let price = 0
    // let listall = []
    // if (couponId == 1) {
    //       //没有选择
    //       let price = 0
    //       let listall = []
    //   }else{
    //       //选择优惠券
    //
    //       for (var i = 0; i < couponList.length; i++) {
    //         if ( couponList[i].coupon_id == couponId) {
    //             listall = couponList[i]
    //             if (listall.coupon_limit == 0) { //不限制门槛
    //               if (listall.coupon_type == 0) { //指定金额类型
    //                   price = (listall.coupon_value/1); // 使用优惠券减免的金额
    //               }else if(listall.coupon_type == 1){ //折扣金额；类型
    //                 console.log(goodsTotalPrice);
    //                 console.log(listall.coupon_value);
    //                   price = (goodsTotalPrice -( goodsTotalPrice * (listall.coupon_value)/10)).toFixed(2); // 使用优惠券减免的金额
    //               }
    //             }else if(listall.coupon_limit == 1){ //优惠券门槛
    //               if (goodsTotalPrice <= listall.coupon_limit_value) {
    //                 console.log("价格不够");
    //
    //               }else {
    //                 if (listall.coupon_type == 0) { //指定金额类型
    //                   price = (listall.coupon_value/1); // 使用优惠券减免的金额
    //                 }else if(listall.coupon_type == 1){ //折扣金额；类型
    //                     price = (goodsTotalPrice - ( goodsTotalPrice * (listall.coupon_value)/10)).toFixed(2); // 使用优惠券减免的金额
    //                 }
    //               }
    //
    //             }
    //             // price = (couponList[i].coupon_value/1); // 使用优惠券减免的金额
    //         }
    //         // array[i]
    //       }
    // }

    // const couponListAll = listall;
    // const couponPrice = 0; // 使用优惠券减免的金额
    // 计算订单的费用
    // const goodsTotalPrice = cartData.cartTotal.checkedGoodsAmount; // 商品总价
    const orderTotalPrice = (cartData.cartTotal.checkedGoodsAmount + freightPrice - couponPrice).toFixed(2); // 订单的总价
    const actualPrice = (orderTotalPrice / 1).toFixed(2) ; // 减去其它支付的金额后，要实际支付的金额
    //
    // console.log(orderTotalPrice);
    // // console.log(goodsTotalPrice);
    //
    // console.log(couponList);
    // let ableCup = [] //可使用的优惠券
    // let unpriceCup = [] //不可使用 价格不足
    // let untimeCup = [] //不可使用 过期
    //
    // for (var i = 0; i < couponList.length; i++) {
    //   // console.log(i);
    //   let endtime = new Date(couponList[i].end_time).getTime()
    //   let nowtime = new Date().getTime()
    //   // console.log(orderTotalPrice);
    //   if (couponList[i].coupon_limit_value > orderTotalPrice) {
    //     console.log("价格不足");
    //     unpriceCup.push(couponList[i])
    //   }else if(nowtime > endtime){
    //     console.log("已过期");
    //     untimeCup.push(couponList[i])
    //   }else{
    //     console.log("可使用");
    //     ableCup.push(couponList[i])
    //   }
    //
    // }
    // const couponListAll = await this.model('user_coupon_copy').where({ id: couponId}).find();
    // const couponPrice = (couponListAll.value/100).toFixed(2); // 使用优惠券减免的金额

      // if (think.isEmpty(couponId)) {
      //     const couponId = 132
      //     // const couponListAll = await this.model('user_coupon_copy').where({ id: couponId}).find();
      //     // const couponPrice = (couponListAll.value/100).toFixed(2); // 使用优惠券减免的金额
      // }


    return this.success({
      // ab2:abc,
      orderTotalPrice:orderTotalPrice,
      addressInfo:addressInfo,
      couponId:couponId,
      addressId:addressId,
      checkedAddress: checkedAddress,
      freightPrice: freightPrice,
      // checkedCoupon: couponListAll,
      couponList: couponList,
      // ableCup:ableCup,
      // unpriceCup:unpriceCup,
      // untimeCup:untimeCup,
      couponPrice: couponPrice,
      checkedGoodsList: checkedGoodsList,
      goodsTotalPrice: goodsTotalPrice,
      orderTotalPrice: orderTotalPrice,
      actualPrice: actualPrice
    });
  }


  async checkederAction() {
    const cartData = await this.model('cart').where({user_id: think.userId}).update({ checked: 0});
    return this.success({
      cartData: cartData,
    })
  }
  async checkededAction() {
    const cartData = await this.model('cart').where({user_id: think.userId}).update({ checked: 1});
    return this.success({
      cartData: cartData,
    })
  }

  // /**
  //  * 查询物流信息
  //  * @returns {Promise.<void>}
  //  */
  // async findAction() {
  //   const ordersn = this.post('ordersn');
  //
  //   const result = await this.model('order').where({ order_sn:ordersn}).find();
  //   return this.success({
  //     result:result,
  //     ordersn:ordersn
  //   });
  // }
};
