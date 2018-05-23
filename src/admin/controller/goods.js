const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 12;
    const name = this.get('name') || '';

    const model = this.model('goods');
    const data = await model.where({name: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  //后台修改商品新品信息
  async setisnewAction() {
    const model = this.model('goods');
    const id = this.post('id');
    const is_new = this.post('data');
    // const data = await model.where({parent_id: 0}).select();
    const data = await model.where({id: id}).update({
      is_new:is_new
    });
    return this.success({
      id:id,
      data:data
    });
  }
  //后台修改商品人气信息
  async setishotAction() {
    const model = this.model('goods');
    const id = this.post('id');
    const is_hot = this.post('data');
    // const data = await model.where({parent_id: 0}).select();
    const data = await model.where({id: id}).update({
      is_hot:is_hot
    });
    return this.success({
      id:id,
      data:data
    });
  }
  //后台修改商品上架信息
  async setisonsaleAction() {
    const model = this.model('goods');
    const id = this.post('id');
    const is_on_sale = this.post('data');
    // const data = await model.where({parent_id: 0}).select();
    const data = await model.where({id: id}).update({
      is_on_sale:is_on_sale
    });
    return this.success({
      id:id,
      data:data
    });
  }


  //添加、编辑商品父组件查找商品
  async findgoodsinfoAction() {
    const id = this.post('id');
    const model = this.model('goods');
    const data = await model.where({id: id}).find();
    return this.success(data);
  }
    //没有id时加载一级分类
    async noIdGetFirstcateAction() {
      // const id = this.post('id');
      const model = this.model('category');
      const data = await model.where({parent_id: 0}).select();
      return this.success(data);
    }
    //根据一级分类查找二级分类
    async secondCategoryAction() {
       const id = this.post('id');
       const data = await this.model('category').where({ parent_id:id}).select()
      return this.success(data);
    }
    //根据二级分类id查找二级分类名字
    async findsecondcateNameAction() {
       const id = this.post('id');
       const data = await this.model('category').where({ id:id}).select()
      return this.success(data);
    }
    //根据二级分类parentid查找一级分类名字
    async findfirstcateNameAction() {
       const id = this.post('id');
       const data = await this.model('category').where({ id:id}).select()
      return this.success(data);
    }
    //根据一级分类id查找二级分类列表
    async findSecondcateListAction() {
       const id = this.post('id');
       const data = await this.model('category').where({ parent_id:id}).select()
      return this.success(data);
    }

  async topCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id: 0}).select();

    return this.success(data);
  }
  async findTopCategoryAction() {
     const id = this.post('id');
     const data = await this.model('category').where({ id:id}).select()

     return this.success(data);
  }
  async findTopCategoryNameAction() {
     const id = this.post('id');
     const data = await this.model('category').where({ id:id}).find()

     return this.success(data);
  }
  async findTopfindTopCategoryNameAction() {
     const name = this.post('name');
     const data = await this.model('category').where({ name:name}).find()

     return this.success(data);
  }

  async findsecondsecondCategoryAction() {
    const name = this.post('name');
    const data = await this.model('category').where({ name:name}).find()

    return this.success(data);
  }



  async aaacategoryAction() {
    const id = this.post('id');
    const model = this.model('category');
    const data = await model.where({ parent_id: id}).select();

    return this.success(data);
  }

  async findLoopImgAction() {
    const id = this.post('id');
    const model = this.model('goods_gallery');
    const data = await model.where({ goods_id: id}).select();
    console.log(data);
    return this.success(data);
  }


  async findSpecAction() {
    const id = this.post('id');
    const model1 = this.model('product')
    const product = await model1.where({ goods_id:id }).select()
    return this.success({
      productList:product,
    });
  }

//在商品页中安二级分类查找所有商品
  async findsecondgoodsAction() {
    const id = this.get('id');
    // const model1 = this.model('goods')
    const page = this.get('page') || 1;
    const size = this.get('size') || 12;
    // const name = this.get('name') || '';

    const model = this.model('goods');
    const data = await model.where({category_id: id}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
    // const list = await model1.where({ category_id:id }).select()
    // return this.success(list);
  }






  async upgoodsAction() {
    const GoodsId = this.post('Goodsid');
    const LoopImgLength = this.post('LoopImgLength');
    const FirstCategoryId = this.post('FirstCategoryId');
    const SecondCategoryId = this.post('SecondCategoryId');
    const GoodsMainImg = this.post('GoodsMainImg');
    const GoodsParticEdit = this.post('GoodsParticEdit');
    const GoodsLoopImg = this.post('GoodsLoopImg');
    const GoodsName = this.post('GoodsName');
    const GoodsDesc = this.post('GoodsDesc');
    const GoodsStock = this.post('GoodsStock');
    const GoodsPrice = this.post('GoodsPrice');
    const GoodsExprice = this.post('GoodsExprice');
    const GoodsIsNew = this.post('GoodsIsNew');
    const GoodsSortOrder = this.post('GoodsSortOrder');
    const GoodsOnSale = this.post('GoodsOnSale');
    const GoodsIsHot = this.post('GoodsIsHot');

    const model = this.model('goods')
    const data = await model.where({id:GoodsId}).find()
    // console.log(GoodsLoopImg);
    const result = await model.where({id:GoodsId}).update({
      category_id:SecondCategoryId,
      name:GoodsName,
      goods_number:GoodsStock,
      goods_brief:GoodsDesc,
      goods_desc:GoodsParticEdit,
      is_on_sale:GoodsOnSale,
      add_time:'0',
      sort_order:GoodsSortOrder,
      is_new:GoodsIsNew,
      goods_unit:'个',
      primary_pic_url:GoodsMainImg[0],
      list_pic_url:GoodsMainImg[0],
      retail_price:GoodsPrice,
      extra_price:GoodsExprice,
      is_hot:GoodsIsHot,


    })
    // console.log(GoodsLoopImg);
    // console.log(LoopImgLength);
    // console.log(GoodsLoopImg.substring(0,LoopImgLength));
    // console.log(GoodsLoopImg.length);
    // for (var i = 0; i < GoodsLoopImg.length; i++) {
    //   if ( typeof(GoodsLoopImg[i].response.data) == 'undefind') {
    //     console.log("9999999");
    //     console.log(GoodsLoopImg[i]);
    //   }
    //   // console.log(GoodsLoopImg[i].response.data.fileUrl);
    // }
    console.log(GoodsLoopImg);
    await this.model("goods_gallery").where({goods_id:GoodsId}).delete()
    for (var i = 0; i < GoodsLoopImg.length; i++) {
      console.log(i);
      // console.log(GoodsLoopImg[i].response.data.fileUrl);
      const result2 = await this.model("goods_gallery").add({
        goods_id:GoodsId,
        img_url:GoodsLoopImg[i].fileUrl,
        img_desc:'',
        sort_order:5,
      })
    }
    // return this.success(result);
  }

  async addgoodsAction() {
    const GoodsId = this.post('Goodsid');
    const FirstCategoryId = this.post('FirstCategoryId');
    const SecondCategoryId = this.post('SecondCategoryId');
    const GoodsMainImg = this.post('GoodsMainImg');
    const GoodsParticEdit = this.post('GoodsParticEdit');
    const GoodsLoopImg = this.post('GoodsLoopImg');
    const GoodsName = this.post('GoodsName');
    const GoodsDesc = this.post('GoodsDesc');
    const GoodsStock = this.post('GoodsStock');
    const GoodsPrice = this.post('GoodsPrice');
    const GoodsExprice = this.post('GoodsExprice');
    const GoodsIsNew = this.post('GoodsIsNew');
    const GoodsSortOrder = this.post('GoodsSortOrder');
    const GoodsOnSale = this.post('GoodsOnSale');
    const GoodsIsHot = this.post('GoodsIsHot');

    const model = this.model('goods')
    const data = await model.where({id:GoodsId}).find()
    console.log(GoodsLoopImg);
    const result = await model.where({id:GoodsId}).add({
      id:GoodsId,
      category_id:SecondCategoryId,
      goods_sn:GoodsId,
      name:GoodsName,
      goods_number:GoodsStock,
      goods_brief:GoodsDesc,
      goods_desc:GoodsParticEdit,
      is_on_sale:GoodsOnSale,
      add_time:'0',
      sort_order:GoodsSortOrder,
      is_new:GoodsIsNew,
      is_limited: 0,
      goods_unit:'个',
      primary_pic_url:GoodsMainImg[0],
      list_pic_url:GoodsMainImg[0],
      retail_price:GoodsPrice,
      extra_price:GoodsExprice,
      is_hot:GoodsIsHot,


    })
    for (var i = 0; i < GoodsLoopImg.length; i++) {
        await this.model("goods_gallery").add({
        goods_id:GoodsId,
        img_url:GoodsLoopImg[i].fileUrl,
        img_desc:'',
        sort_order:5,
      })
      // console.log();
    }

    // return this.success(result);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
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
    const result = await this.model('goods').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success(
      {
        result:result
      }
    );
  }
};
