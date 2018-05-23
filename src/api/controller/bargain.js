const Base = require('./base.js');

module.exports = class extends Base {

  async bargainlistAction() {
    // const couponId = this.get("couponId")
    const data = await this.model('bargain').where({is_abled:1 }).select();
    // console.log(data);

    for (var i = 0; i < data.length; i++) {
      // array[i]

      if (data[i].end_time > new Date().getTime()) {
        const bargain = await this.model('bargain').where({is_abled:1 }).select();
        // let goods = []
        // console.log(bargain);
        for (var j = 0; j < bargain.length; j++) {
          // array[i]
          let goodsdata = []
          goodsdata = await this.model('goods').where({ id:bargain[j].goodsid }).find();
          // console.log(i);
          bargain[j].goods = goodsdata
        }
        return this.success({
          data:bargain
        })
      }else {
        await this.model('bargain').where({id:data[i].id }).update({
          is_abled:0
        });
        console.log("已过期");
      }

    }
    // const data2 = await this.model('bargain_user').where({ user_id:think.userId }).select();
    // // let boedel = []
    // for (var i = 0; i < data2.length; i++) {
    //   // array[i]
    //   // console.log(data[i]);
    //   if (data2[i].end_time < new Data().getTime()) {
    //       const cancelorderList = await this.model('bargain_user').where({id: data2[i].id}).update({iscut:'4'})
    //   }else {
    //   }
    // }

  }
  //按id查找砍价信息
  async findbargainAction() {
    const bargainid = this.get("bargainid")
    const data = await this.model('bargain').where({id:bargainid,is_abled:1 }).select();
    let goods = []
    for (var i = 0; i < data.length; i++) {
      // array[i]
      let goodsdata = []
      goodsdata = await this.model('goods').where({ id:data[i].goodsid }).find();
      // console.log(i);
      data[i].goods = goodsdata
    }
    return this.success({
      data:data
      // Result:result,
      // abc:"123"
    })
  }


    // //好友砍价
    async friendcutAction() {
      const userInfo = this.post('userInfo')
      const openidInfo = this.post('userInfo_in')
      const bargoods = this.post('bargoods')
      const data = await this.model('bargain_user_friend').where({
        bargain_id:bargoods.bargain_id,
        friend_openid:openidInfo.sessionData.openid,
        bargain_main_userid:userInfo.id,
        goods_skuid:bargoods.goods_sku_id }).select();
      // if (data.length < 0) {
      if (data.length > 0) {
        return this.fail(217, '用户已砍过！');
      }else{
        const barinfo = await this.model('bargain_user').where({goods_sku_id:bargoods.goods_sku_id}).find()
        console.log(barinfo);
        const listrt = await this.model('bargain_user_friend').where({
          bargain_id:bargoods.bargain_id,
          // friend_openid:openidInfo.sessionData.openid,
          goods_skuid:bargoods.goods_sku_id }).select();
          // console.log(listrt);
          console.log(barinfo.least_cut_num);
          console.log(listrt.length);
        // if (Number(barinfo.least_cut_num) == Number(listrt.length) ) {
        //   console.log("已达到最大人数");
        //   console.log(barinfo.least_cut_num);
        //   console.log(listrt.length);
        //   return this.fail(503, '已达到最大人数!');
        // }else{
          let cutprice = 0
          let surplus = 0
          let rend = (parseInt(100*Math.random()) / 1000).toFixed(3);
          // console.log(barinfo.have_cut_lest);
          // console.log(barinfo.least_cut_num);
          // console.log(barinfo.have_cut_lest * (1 / barinfo.least_cut_num));
          // console.log((0.08 + rend * 10));
          // cutprice = (barinfo.have_cut_lest * ((1 / barinfo.least_cut_num) * (0.08 + rend * 10))).toFixed(2)
          cutprice = (barinfo.have_cut_lest * ((barinfo.have_cut_num / barinfo.least_cut_num) * (0.08 + rend * 10))).toFixed(2)
          let cutAllPrice = (Number(barinfo.have_cut_price) + Number(cutprice)).toFixed(2)
          let lestAllPrice = (Number(barinfo.goods_rel_price) - cutAllPrice).toFixed(2)
          surplus = lestAllPrice
          console.log(cutprice);
          console.log(barinfo.have_cut_lest);
          console.log(surplus);

          // if (parseInt(lestAllPrice) == 0) {
          //   console.log("已砍完！");
          //   console.log(lestAllPrice);
          //   return this.fail(503, '价格已为0!');goods_lowest_price
          if (Number(barinfo.have_cut_lest) <= Number(barinfo.goods_lowest_price)) {
          // if (Number(barinfo.goods_rel_price) <= (Number(barinfo.have_cut_price) - Number(barinfo.goods_lowest_price))) {
            return this.fail(503, '价格已到底价!');

          }else{
            await this.model('bargain_user').where({goods_sku_id:bargoods.goods_sku_id}).update({
              have_cut_num: Number(barinfo.have_cut_num) + 1,
              have_cut_price: cutAllPrice,
              have_cut_lest: lestAllPrice
            })
            await this.model('bargain_user_friend').add({
              bargain_user_id: think.userId,
              bargain_main_userid:userInfo.id,
              friend_openid: openidInfo.sessionData.openid,
              friend_nick_name: openidInfo.userInfo.nickname,
              friend_avatar: openidInfo.userInfo.avatar,
              bargain_id: bargoods.bargain_id,
              goods_id: bargoods.goods_id,
              goods_name: bargoods.goods_name,
              goods_skuid: bargoods.goods_sku_id,
              goods_rel_price: bargoods.goods_rel_price,
              cut_price: cutprice,
              surplus_price: surplus,
              goods_lowest_price: bargoods.lowest_price,
            })
            return this.success({
              cutprice:cutprice
            })
          }

        // }


      }

    }

    // //判断是否为发起者，并标记已砍价完成
    async checkislaunchAction() {
      // const openidInfo = this.post('openidInfo')
      const userInfo_in = this.post('userInfo_in')
      const userInfo = this.post('userInfo')
      const bargainInfo = this.post('bargainInfo')
      // console.log(userInfo_in);
      // console.log(userInfo);
      console.log(bargainInfo);
      const haveorder = await this.model('order').where({user_id:bargainInfo.user_id,goods_sku_id:bargainInfo.goods_sku_id,integral:0}).select()
      console.log(haveorder);
      if (haveorder.length > 0){
        return this.fail(6,'订单已存在',haveorder)
      }else{
        await this.model('bargain_user').where({goods_sku_id:bargainInfo.goods_sku_id}).update({iscut:'1'})

        if (userInfo.weixin_openid == userInfo_in.sessionData.openid) {
          //为发起者
          return this.fail(0,'判断通过,点击用户为发起者1')
        }else {
          return this.fail(17,'判断失败,点击用户不是发起者')
        }
      }

      // const launch = await this.model('bargain_user').where({})
      // console.log(openid);
      // const data = await this.model('bargain_user').where({ user_id:think.userId}).select();
      // const data = await this.model('bargain_user_friend').where({ bargain_id:bargain_id,friend_openid:openid}).select();
      // const data = await this.model('bargain_user_friend').where({
        // bargain_id:bargoods.bargain_id,
        // friend_openid:openidInfo.sessionData.openid,
        // goods_skuid:bargoods.goods_sku_id }).select();

      // return this.success({
      //   data:data
      // })
    }

    // //删除砍价订单
    async delbarorderAction() {
      const orderid = this.post('orderid')
      const id = this.post('id')
      if (orderid == '0') {
        const cancelorderList = await this.model('bargain_user').where({id: id}).update({iscut:'5'})
        return this.success(cancelorderList)
      }else {
        await this.model('bargain_user').where({order_sn: orderid}).update({iscut:'5'})
        const cancelorderList = await this.model('order').where({ order_sn: orderid }).update({integral:1});
        return this.success(cancelorderList)


      }


      return this.success({
        data:cancelorderList
      })
    }

// //查找砍价列表
async findcutlistAction() {
  const userInfo = this.post('userInfo')
  const bargoods = this.post('bargoods')
  // console.log(openid);
  // const data = await this.model('bargain_user').where({ user_id:think.userId}).select();
  // const data = await this.model('bargain_user_friend').where({ bargain_id:bargain_id,friend_openid:openid}).select();
  const data = await this.model('bargain_user_friend').where({
    bargain_id:bargoods.bargain_id,
    bargain_main_userid:userInfo.id,
    // friend_openid:openidInfo.sessionData.openid,
    goods_skuid:bargoods.goods_sku_id }).select();

  return this.success({
    data:data
  })
}
// //查找openid是否砍过价格
async iscutAction() {
  const openidInfo = this.post('userInfo_in')
  const userInfo = this.post('userInfo')
  const bargoods = this.post('bargoods')
  // console.log(openid);
  // const data = await this.model('bargain_user').where({ user_id:think.userId}).select();
  // const data = await this.model('bargain_user_friend').where({ bargain_id:bargain_id,friend_openid:openid}).select();
  const data = await this.model('bargain_user_friend').where({
    bargain_id:bargoods.bargain_id,
    bargain_main_userid:userInfo.id,
    friend_openid:openidInfo.sessionData.openid,
    goods_skuid:bargoods.goods_sku_id }).select();

  return this.success({
    data:data
  })
}
//砍价
async cutAction() {
  const openidInfo = this.post('openidInfo')
  const bargoods = this.post('barGoods')
  const goodssku = this.post('goodsSku')
  console.log(openidInfo);
  console.log(bargoods);
  console.log(goodssku);

  // const data = await this.model('bargain_user').where({ user_id:think.userId}).select();
  const data = await this.model('bargain_user_friend').where({ bargain_id:bargoods.id,friend_openid:openidInfo.sessionData.openid,goods_skuid:goodssku.id}).select();
  console.log(data);
  if ( data.length == 0 && openidInfo.sessionData.user_id == think.userId) {  //刚发起就砍一刀
    const changebar = await this.model('bargain').where({ goodsid:bargoods.goodsid }).find()
    await this.model('bargain').where({ goodsid:bargoods.goodsid }).update({
      launched_num:Number(changebar.launched_num) + 1
    })
    let cutprice = 0
    let surplus = 0
    // cutprice = goodssku.retail_price * 0.15
    let rend = (parseInt(100*Math.random()) / 1000).toFixed(3);
    console.log(0.08 + Number(rend));
    cutprice = (goodssku.retail_price * (0.08 + Number(rend))).toFixed(2)
    surplus = ((goodssku.retail_price - cutprice) / 1).toFixed(2)
    console.log(bargoods.least_cut_num);
    console.log(goodssku.retail_price);
    console.log(cutprice);
    console.log(surplus);
    console.log("999999999999999999999999999999999999");
    await this.model('bargain_user_friend').add({
      bargain_user_id: think.userId,
      bargain_main_userid: openidInfo.sessionData.user_id,
      friend_openid: openidInfo.sessionData.openid,
      friend_nick_name: openidInfo.userInfo.nickname,
      friend_avatar: openidInfo.userInfo.avatar,
      bargain_id: bargoods.id,
      goods_id: bargoods.goodsid,
      goods_name: bargoods.goods_name,
      goods_skuid: goodssku.id,
      goods_rel_price: goodssku.retail_price,
      cut_price: cutprice,
      surplus_price: surplus,
      goods_lowest_price: bargoods.lowest_price,

    })
    // console.log("999999999999999999999999999999999999");
    const userdata = await this.model('bargain_user').where({
      goods_sku_id:goodssku.id
    }).find()
    let cut_num = userdata.have_cut_num
    let cut_price = userdata.have_cut_price
    let cut_lest = userdata.have_cut_lest
    await this.model('bargain_user').where({
      goods_sku_id:goodssku.id
    }).update({
      have_cut_num:cut_num+1,
      have_cut_price:(Number(cut_price) + Number(cutprice)).toFixed(2),
      have_cut_lest: (Number(cut_lest) + Number(surplus)).toFixed(2),

    })
    // console.log("98774651321357891657");
  }else {

  }
  // return this.success({
  //   data:data
  // })
}
  //按id查找砍价信息
  async userbargainlistAction() {
    const data = await this.model('bargain_user').where({ user_id:think.userId }).select();
    let boedel = []
    for (var i = 0; i < data.length; i++) {
      // array[i]
      // console.log(data[i]);
      if (data[i].iscut == '5') { }else {
        boedel.push(data[i])
      }
    }
    return this.success({
      data:boedel
    })
  }
  //按id查找砍价信息cutagain
  async cutagainAction() {
    const bargoods = this.post('bargoods')
    console.log(bargoods);
    const data = await this.model('bargain_user').where({ goods_sku_id:bargoods.goods_sku_id}).find();
    const barlist = await this.model('bargain_user_friend').where({ goods_skuid:bargoods.goods_sku_id,bargain_id:bargoods.bargain_id}).select();
    // console.log(data);
    if (data.iscut == 1) {
      return this.fail(1,'已砍价完成')
    }else if (data.iscut == 0){
      return this.success({
        data:data,
        barlist:barlist.reverse()
      })

    }

  }
  //按id查找砍价信息cutagain
  async barsetorderAction() {
    const _ = require('lodash');
    const addressInfo = this.post('addressInfo')
    const bargaingoods = this.post('bargaingoods')
    const userInfo = this.post('userInfo')
    console.log(addressInfo);
    console.log(bargaingoods);
    console.log(userInfo);

    const date = new Date();
    let sn = date.getFullYear() + _.padStart(date.getMonth()+1, 2, '0') + _.padStart(date.getDate(), 2, '0')
    + _.padStart(date.getHours(), 2, '0') + _.padStart(date.getMinutes(), 2, '0')
    + _.padStart(date.getSeconds(), 2, '0') +  _.random(100000, 999999);
    console.log(sn);
    var tmp = Date.parse( new Date() ).toString();
    tmp = tmp.substr(0,10);

    const barmain = await this.model("bargain").where({
      goodsid:bargaingoods.goods_id,
    }).find()
    await this.model('bargain_user').where({
      goods_sku_id:bargaingoods.goods_sku_id,
    }).update({ iscut: '2',order_sn:sn })
    await this.model("bargain").where({
      goodsid:bargaingoods.goods_id,
    }).update({
      purchased_num:parseInt(barmain.purchased_num) + 1
    })

    // let sn = new Data().getTime()

    const order = await this.model('order').add({
      order_sn:sn,
      user_id:bargaingoods.user_id,
      order_status: 0 ,
      consignee:addressInfo.name,
      country:addressInfo.country_id,
      province:addressInfo.province_id,
      city:addressInfo.city_id,
      district:addressInfo.district_id,
      address:addressInfo.address,
      mobile:addressInfo.mobile,
      postscript:'',
      shipping_fee: bargaingoods.have_cut_price,
      pay_name:'砍价订单',
      pay_id: 1 ,
      actual_price: bargaingoods.goods_lowest_price,
      order_price: bargaingoods.goods_lowest_price,
      goods_price: bargaingoods.goods_rel_price,
      add_time: tmp,
      goods_sku_id: bargaingoods.goods_sku_id
      // confirm_time: 0 ,
    })
    console.log(order);
    const order_goods = await this.model("order_goods").add({
      order_id: parseInt(order),
      goods_id: bargaingoods.goods_id,
      goods_sn: bargaingoods.goods_sn,
      product_id: bargaingoods.goods_sku_id,
      goods_name: bargaingoods.goods_name,
      list_pic_url: bargaingoods.goods_pic,
      market_price: bargaingoods.goods_rel_price,
      retail_price: bargaingoods.goods_rel_price,
      number: 1,
      goods_specifition_name_value: bargaingoods.goods_sku_value,
      goods_specifition_ids: bargaingoods.goods_spec_ids
    })

    return this.success({
      orderId:sn,
      orderPrice:bargaingoods.goods_lowest_price
    })

  }
  //按id查找用户已发起的砍价信息
  async finduserbargainAction() {
    const bargainid = this.get("bargainid")
    // console.log(bargainid);
    let id = parseInt(bargainid)
    // console.log(id);
    const bargainuser = await this.model('bargain_user').where({id:id}).find();
    // bargainuser.
    const goods = await this.model('goods').where({ id:bargainuser.goods_id }).find();
    const user = await this.model('user').where({ id:think.userId }).find();
    console.log(goods.category_id);
    const othergoods = await this.model('goods').where({ category_id:goods.category_id }).limit(6).select();
    // let goods = []
    // for (var i = 0; i < array.length; i++) {
    //   array[i]
    // }
    // for (var i = 0; i < data.length; i++) {
    //   // array[i]
    //   let goodsdata = []
    const bargainmain = await this.model('bargain').where({ id:bargainuser.bargain_id }).find();
    //   // console.log(i);
    //   data[i].goods = goodsdata
    // }
    return this.success({
      bargainuser:bargainuser,
      bargainmain:bargainmain,
      goods:goods,
      user:user,
      othergoods:othergoods
      // Result:result,
      // abc:"123"
    })
  }

  //查找sku的价格
    async findvaluepriceAction() {
      const data = this.post('data')
      // console.log(data);
      const finids = data.join('_')
      console.log(finids);
      const resule = await this.model('product').where({goods_specification_ids:finids}).find()
      return this.success(resule)
    }

    //设置用户砍价
      async setuserbargainAction() {
        const bargoods = this.post('bargoods')
        const skuid = this.post('skuid')
        const skuvalue = this.post('skuvalue')
        console.log(bargoods);
        console.log(skuid);
        console.log(skuvalue);
        // const haveorder = await this.model('order').where({user_id:think.userId,goods_sku_id:skuid.id}).select()
        // console.log(haveorder);
        // if (haveorder.length > 0){
        //   return this.fail(6,'订单已存在',haveorder)
        // }
        const have = await this.model('bargain_user').where({
          user_id:think.userId,
          bargain_id:bargoods.id,
          goods_id:bargoods.goodsid,
          goods_sku_id:skuid.id,
        }).select()
        // let havetrue = []
        // for (var i = 0; i < have.length; i++) {
        //   // array[i]
        //   if (have[i].iscut == '5') {
        //
        //   }else {
        //     havetrue.push(have[i])
        //   }
        // }
        console.log(have);
        if (have.length >= 1) {
          // console.log("99999999999999999999999");
          if(have[0].iscut == '5'){
            return this.fail(503,"已存在但砍价失败！",have)
          }else if(have[0].iscut == '4'){
            return this.fail(506,"已存在但砍价超时！",have)

          }else{
            return this.fail(217,"已存在",have)
          }
        }else {
          // const product = await this.model('product').where({id:skuid.id}).find()
          const data = await this.model('bargain_user').add({
            user_id:think.userId,
            bargain_id:bargoods.id,
            goods_id:bargoods.goodsid,
            goods_sn:skuid.goods_sn,
            product_id:skuid.id,
            goods_name:bargoods.goods.name,
            goods_rel_price:skuid.retail_price,
            goods_lowest_price:bargoods.lowest_price,
            duration_time:bargoods.user_duration_time,
            most_init_num:bargoods.most_init_num,
            least_cut_num:bargoods.least_cut_num,
            only_cut_num:bargoods.only_cut_num,
            created_time:new Date().getTime(),
            end_time:new Date().getTime() + parseInt(bargoods.user_duration_time),
            goods_sku_id:skuid.id,
            goods_spec_ids:skuid.goods_specification_ids,
            goods_sku_value:skuvalue,
            goods_pic:bargoods.goods.list_pic_url
            // duration_time:bargoods.user_duration_time,
          })
          return this.success(data)
        }

        // const bargainInfo = await this.model('bargain').where({id:bargainid}).find()
        // console.log(data);
        // const finids = data.join('_')
        // console.log(finids);
        // const resule = await this.model('product').where({goods_specification_ids:finids}).find()

      }

  //按商品sku信息
  async findgoodskuAction() {
    const goodsId = this.get("id")
    const model = this.model('goods');

    const info = await model.where({'id': goodsId}).find();
    const gallery = await this.model('goods_gallery').where({goods_id: goodsId}).limit(4).select();
    const attribute = await this.model('goods_attribute').field('bbgshop_goods_attribute.value, bbgshop_attribute.name').join('bbgshop_attribute ON bbgshop_goods_attribute.attribute_id=bbgshop_attribute.id').order({'bbgshop_goods_attribute.id': 'asc'}).where({'bbgshop_goods_attribute.goods_id': goodsId}).select();
    const issue = await this.model('goods_issue').select();
    const brand = await this.model('brand').where({id: info.brand_id}).find();
    // const commentCount = await this.model('comment').where({value_id: goodsId, type_id: 0}).count();
    // const hotComment = await this.model('comment').where({value_id: goodsId, type_id: 0}).find();
    // let commentInfo = {};
    // if (!think.isEmpty(hotComment)) {
    //   const commentUser = await this.model('user').field(['nickname', 'username', 'avatar']).where({id: hotComment.user_id}).find();
    //   commentInfo = {
    //     content: Buffer.from(hotComment.content, 'base64').toString(),
    //     add_time: think.datetime(new Date(hotComment.add_time * 1000)),
    //     nickname: commentUser.nickname,
    //     avatar: commentUser.avatar,
    //     pic_list: await this.model('comment_picture').where({comment_id: hotComment.id}).select()
    //   };
    // }
    //
    // const comment = {
    //   count: commentCount,
    //   data: commentInfo
    // };

    // 当前用户是否收藏
    const userHasCollect = await this.model('collect').isUserHasCollect(think.userId, 0, goodsId);

    // 记录用户的足迹 TODO
    await await this.model('footprint').addFootprint(think.userId, goodsId);

    // return this.json(jsonData);
    return this.success({
      info: info,
      gallery: gallery,
      attribute: attribute,
      userHasCollect: userHasCollect,
      issue: issue,
      // comment: comment,
      brand: brand,
      specificationList: await model.getSpecificationList(goodsId),
      productList: await model.getProductList(goodsId)
    });
    // const goods = await this.model('goods').where({id:id}).find();
    // const product = await this.model('product').where({goods_id:goods.id}).select();
    // // console.log(product);
    // for (var i = 0; i < product.length; i++) {
    //   let local_specids = []
    //   // let obj = {}
    //   local_specids = product[i].goods_specification_ids.split("_")
    //   // console.log(local_specids);
    //   product[i].local_specids = local_specids
    //   for (var j = 0; j < local_specids.length; j++) {
    //     // array[i]
    //     // console.log(local_specids[j]);
    //     const specs = await this.model('goods_specification').where({ id:local_specids[j]}).select();
    //     // console.log(specs);
    //     for (var k = 0; k < specs.length; k++) {
    //       // array[i]
    //       console.log(specs[k].value);
    //     }
    //   }
    // }
    // for (var i = 0; i < product.length; i++) {
    //   for (var i = 0; i < product.local_specids.length; i++) {
    //     array[i]
    //   }
    // }

    // return this.success({
    //   goods:goods,
    //   product:product,
    //   // specs:specs
    //   // Result:result,
    //   // abc:"123"
    // })
  }

  /**
   * 获取砍价的订单号
   *  []
   */
  async findbarorderAction() {
    const goods = this.post('bargoods')
    const sn = await this.model('bargain_user').where({id:goods}).find()
    const price = await this.model('order').where({order_sn:sn.order_sn}).find()

    // console.log(goods);
    return this.success({
      ordersn:sn.order_sn,
      acprice:price.actual_price
    });
  }
  /**
   * 获取用户的收货地址
   * @return {Promise} []
   */
  async addresslistAction() {
    const addressList = await this.model('address').where({user_id: think.userId}).select();
    let itemKey = 0;
    for (const addressItem of addressList) {
      addressList[itemKey].province_name = await this.model('region').getRegionName(addressItem.province_id);
      addressList[itemKey].city_name = await this.model('region').getRegionName(addressItem.city_id);
      addressList[itemKey].district_name = await this.model('region').getRegionName(addressItem.district_id);
      addressList[itemKey].full_region = addressList[itemKey].province_name + addressList[itemKey].city_name + addressList[itemKey].district_name;
      itemKey += 1;
    }

    return this.success(addressList);
  }
  /**
   * 获取收货地址的详情
   * @return {Promise} []
   */
  async addressdetailAction() {
    const addressId = this.post('id');

    const addressInfo = await this.model('address').where({user_id: think.userId, id: addressId}).find();
    if (!think.isEmpty(addressInfo)) {
      addressInfo.province_name = await this.model('region').getRegionName(addressInfo.province_id);
      addressInfo.city_name = await this.model('region').getRegionName(addressInfo.city_id);
      addressInfo.district_name = await this.model('region').getRegionName(addressInfo.district_id);
      addressInfo.full_region = addressInfo.province_name + addressInfo.city_name + addressInfo.district_name;
    }

    return this.success(addressInfo);
  }



};
