const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const model = this.model('category');
    const data = await model.where({is_show: 1}).order(['sort_order ASC']).select();
    const topCategory = data.filter((item) => {
      return item.parent_id === 0;
    });
    const categoryList = [];
    topCategory.map((item) => {
      item.level = 1;
      categoryList.push(item);
      data.map((child) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          categoryList.push(child);
        }
      });
    });
    return this.success(categoryList);
  }

  async findsmallloopAction() {
    const name = this.post('name')
    const data = await this.model('channel').where({name:name}).find()
    return this.success(data)
  }





  async wapimageAction() {
    const model = this.model('category');
    const id = this.post('id')
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeimgAction() {
    const model = this.model('category');
    const url = this.post('url')
    const id = this.post('id')
    const result = await model.where({id:id}).update({
      wap_banner_url:url[0]
    })
    // const data = await model.where({id: id}).find();

    return this.success(result);
  }

  async updatastoreallAction() {
    const categoryId = this.post('categoryId')
    const smallinfo = this.post('smallinfo')
    const is_showindex = this.post('is_showindex')
    const categoryName = this.post('categoryName')
    const categoryParent_id = this.post('categoryParent_id')
    const categoryFont_name = this.post('categoryFont_name')
    const categorySort_order = this.post('categorySort_order')
    const categoryIs_show = this.post('categoryIs_show')
    const GoodsMainImg = this.post('GoodsMainImg')
    const level = ''
    // const datawe = ''
    if (categoryParent_id == 0) {
      // console.log(99999999999999999999);
      this.level = "L1"
    }else {
      this.level = "L2"
    }
    console.log(categoryName);
    if (is_showindex == 1) {
      console.log("12345698765412");
      var id = smallinfo.sort_order
      this.datawe = await this.model('channel').where({sort_order:id}).select()
      if(this.datawe.length == 0){
        await this.model('channel').where({sort_order:id}).delete()
        await this.model('channel').where({sort_order:id}).add({
          name:smallinfo.name,
          url:smallinfo.url,
          icon_url:smallinfo.icon_url,
          sort_order:smallinfo.sort_order,
        })
      }else {
        await this.model('channel').where({sort_order:id}).update({
          name:smallinfo.name,
          url:smallinfo.url,
          icon_url:smallinfo.icon_url,
        })
      }
    }else {
      console.log("9999999999999999999999");
      console.log(categoryName);
      const abc =  await this.model('channel').where({name:categoryName}).select()
      if (abc.length == 0) {

      }else {
         await this.model('channel').where({name:categoryName}).delete()
      }
      // console.log(abc);
    }
    console.log(this.level);

    // console.log(data);
    const model = this.model('category');
    const data = await model.where({id:categoryId}).update({
      name:categoryName,
      font_desc:categoryFont_name,
      parent_id:categoryParent_id,
      sort_order:categorySort_order,
      is_show:categoryIs_show,
      banner_url:GoodsMainImg[0],
      icon_url:GoodsMainImg[0],
      image_url:GoodsMainImg[0],
      wap_banner_url:GoodsMainImg[0],
      level:this.level,
      type:0,
      front_name:categoryFont_name,
    })
    // const data = await model.where({parent_id: 0}).order(['id ASC']).select();

    return this.success(data);
  }


    async addstoreallAction() {
      // const smallinfo = this.post('smallinfo')
      // const is_showindex = this.post('is_showindex')
      const categoryName = this.post('categoryName')
      const categoryParent_id = this.post('categoryParent_id')
      const categoryFont_name = this.post('categoryFont_name')
      const categorySort_order = this.post('categorySort_order')
      const categoryIs_show = this.post('categoryIs_show')
      const GoodsMainImg = this.post('GoodsMainImg')
      const level = ''
      const datawe = ''
      if (categoryParent_id == 0) {
        // console.log(99999999999999999999);
        this.level = "L1"
      }else {
        this.level = "L2"
      }
      console.log(this.level);

      console.log(categoryName);
      // if (is_showindex == 1) {
      //   console.log("12345698765412");
      //   var id = smallinfo.sort_order
      //   this.datawe = await this.model('channel').where({sort_order:id}).select()
      //   if(this.datawe.length == 0){
      //     await this.model('channel').where({sort_order:id}).delete()
      //     await this.model('channel').where({sort_order:id}).add({
      //       name:smallinfo.name,
      //       url:smallinfo.url,
      //       icon_url:smallinfo.icon_url,
      //       sort_order:smallinfo.sort_order,
      //     })
      //   }else {
      //     await this.model('channel').where({sort_order:id}).update({
      //       name:smallinfo.name,
      //       url:smallinfo.url,
      //       icon_url:smallinfo.icon_url,
      //     })
      //   }
      // }else {
      //   console.log("9999999999999999999999");
      //   console.log(categoryName);
      //   const abc =  await this.model('channel').where({name:categoryName}).select()
      //   if (abc.length == 0) {
      //
      //   }else {
      //      await this.model('channel').where({name:categoryName}).delete()
      //   }
      //   // console.log(abc);
      // }



      const model = this.model('category');
      const data = await model.add({
        name:categoryName,
        font_desc:categoryFont_name,
        parent_id:categoryParent_id,
        sort_order:categorySort_order,
        is_show:categoryIs_show,
        banner_url:GoodsMainImg[0],
        icon_url:GoodsMainImg[0],
        image_url:GoodsMainImg[0],
        wap_banner_url:GoodsMainImg[0],
        level:this.level,
        type:0,
        front_name:categoryFont_name,
      })

      // return this.success(data);
    }

  async topCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id: 0}).order(['id ASC']).select();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('category');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('category');
    values.is_show = values.is_show ? 1 : 0;
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
    await this.model('category').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
