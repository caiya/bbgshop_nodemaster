const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action  添加拼团商品
   * @return {Promise} []
   */
  async collagegoodsAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 5;
    const goodsname = this.get('goodsname') || '';
    // const consignee = this.get('consignee') || '';

    const model = this.model('goods');
    const data = await model.where({name: ['like', `%${goodsname}%`]}).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }
  async findcollageAction(){
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const goodsname = this.get('goodsname') || '';
    // const consignee = this.get('consignee') || '';

    const model = this.model('collage');
    const data = await model.where({goods_name: ['like', `%${goodsname}%`]}).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }
  async collagestoreAction() {
    const collage = this.post('collage')
    const goods = this.post('goods')
    console.log(collage);
    let code = (Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).toUpperCase()

    // console.log(bargain.LimitTimeUnix[0]);
    // console.log(bargain.LimitTimeUnix[1]);
    // console.log(bargain.BargainUserDurationUnix);
    const data = await this.model('collage').add({
      goodsid: goods.id,
      goods_name: goods.name,
      create_time: collage.create_time,
      // start_time: collage.LimitTimeUnix[0],
      // end_time: collage.LimitTimeUnix[1],
      virtual: collage.VirtualLocal,
      user_duration_time: collage.CollageUserDurationUnix,
      retail_price: collage.retail_price,
      collage_price: collage.CollageMinPrice,
      most_init_num: collage.CollageInitNumber,
      least_coll_num: collage.CollagePeople,
      activity_detail: collage.CollageDetailEdit,
      mate_code: code,
      purchased_num: 0,
      launched_num: 0,
      collage_success_num: 0
    })
    return this.success(data);
  }
  async setcollableAction() {
    const id = this.post('id')
    const abled = this.post('data')
    // const page = this.get('page') || 1;
    // const size = this.get('size') || 5;
    // const goodsname = this.get('goodsname') || '';
    // const consignee = this.get('consignee') || '';

    const model = this.model('collage');
    const data = await model.where({id: id}).update({
      is_abled:abled
    });
    // const data = await model.where({ id: id).update({
    //
    // });
    // const data = await model.where({goods_name: ['like', `%${goodsname}%`]}).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }
  async destoryAction() {
    const id = this.post('id')
    console.log(id);
    // const abled = this. post('data')
    // const page = this.get('page') || 1;
    // const size = this.get('size') || 5;
    // const goodsname = this.get('goodsname') || '';
    // const consignee = this.get('consignee') || '';

    const model = this.model('collage');
    const data = await model.where({id: id}).delete()
    // const data = await model.where({ id: id).update({
    //
    // });
    // const data = await model.where({goods_name: ['like', `%${goodsname}%`]}).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }
};
