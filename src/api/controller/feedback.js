const Base = require('./base.js');

module.exports = class extends Base {
  async exchangeAction() {
    const feedtype = this.post("feedtype");
    const content = this.post("content");
    const phone = this.post("phone");
    let newdata = new Date().toLocaleString();
    const name = await this.model('user').where({id:think.userId}).find()
    const Resule = await this.model('feedback').add({
      user_id:think.userId,
      user_name:name.nickname,
      msg_type:feedtype,
      msg_content:content,
      user_mobile:phone,
      msg_time:newdata,
    })
    // console.log(name);
    return this.success({
      Resule:Resule
    });
  }
};
