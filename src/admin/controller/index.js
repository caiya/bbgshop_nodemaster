const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  async findindexloopAction() {
  const data = await this.model('ad').select()
    return this.success(data)
  }
  async delloopAction() {
  const data = await this.model('ad').delete()
    return this.success(data)
  }
  async setloopAction() {
    const LoopListRes = this.post('LoopListRes')
    await this.model('ad').delete()
    console.log(LoopListRes);
    for (var i = 0; i < LoopListRes.length; i++) {
      console.log(LoopListRes[i].fileUrl);
      var url = LoopListRes[i].fileUrl
      var link = LoopListRes[i].linkurl
      await this.model('ad').add({
        ad_position_id:1,
        media_type:1,
        name:"zanwu",
        link: link,
        image_url: url,
        content:"zanwu",
        end_time: 0,
        enabled: 1,
      })
    }
  // const data = await this.model('ad').select()
    return this.success(LoopListRes)
  }




  async findissueAction() {
    const data = await this.model('goods_issue').select();
    // const data = await this.model('ad').delete()
      return this.success(data)
  }

  async setissueAction() {
    const value = this.post('issue')
    console.log(value);
    for (var i = 0; i < value.length; i++) {
      const data = await this.model('goods_issue').where({id:i+1}).update({
        goods_id:"0",
        question:value[i].question,
        answer:value[i].answer,
      });

    }
    // const data = await this.model('ad').delete()
      // return this.success(data)
  }




};
