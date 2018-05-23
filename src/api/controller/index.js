const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const banner = await this.model('ad').where({ad_position_id: 1}).select();
    const channel = await this.model('channel').order({sort_order: 'asc'}).select();
    const newGoodsList = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({
      is_new: 1,
      is_on_sale:1
    }).select();
    const hotGoodsList = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price', 'goods_brief']).where({
      is_hot: 1,
      is_on_sale:1
    }).select();
    const brandList = await this.model('brand').where({is_new: 1}).order({new_sort_order: 'asc'}).limit(4).select();
    const topicList = await this.model('topic').limit(3).select();

    const categoryList = await this.model('category').where({parent_id: 0, name: ['<>', '推荐']}).select();
    const newCategoryList = [];
    for (const categoryItem of categoryList) {
      const childCategoryIds = await this.model('category').where({parent_id: categoryItem.id}).getField('id', 100);
      const categoryGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({
        category_id: ['IN', childCategoryIds],
        is_on_sale:1
      }).limit(7).select();
      newCategoryList.push({
        id: categoryItem.id,
        name: categoryItem.name,
        goodsList: categoryGoods
      });
    }
    const newGoods = []
    const newnewGoods = newGoodsList.reverse()
    for (var i = 0; i < newGoodsList.length; i++) {
      if ( i < 4 ) {
        console.log(i);
        let obj = newnewGoods[i]
        newGoods.push(obj)
      }
    }
    const hotGoods = []
    const hothotGoods = hotGoodsList.reverse()
    for (var j = 0; j < hotGoodsList.length; j++) {
      if ( j < 4 ) {
        console.log(j);
        let obj2 = hothotGoods[j]
        hotGoods.push(obj2)
      }
    }
    return this.success({
      banner: banner,
      channel: channel,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods,
      brandList: brandList,
      topicList: topicList,
      categoryList: newCategoryList.reverse()
    });
  }


};
