const Base = require('./base.js');

module.exports = class extends Base {
  async checkcollagetimeAction() {
    const collsgelist = await this.model('collage_user').select()
    for (var i = 0; i < collsgelist.length; i++) {
      if (parseInt(collsgelist[i].end_time) <= new Date().getTime() ) {
        await this.model("collage_user").where({id:collsgelist[i].id}).update({
          is_outtime:1
        })
        await this.model("order").where({id:collsgelist[i].order_id}).update({
          collage_isouttime: 1
        })
      }
    }
  }
  async checkbargaintimeAction() {
    const bargainlist = await this.model('bargain_user').select()
    for (var i = 0; i < bargainlist.length; i++) {
      if (parseInt(bargainlist[i].end_time) <= new Date().getTime() ) {
        await this.model("bargain_user").where({id:bargainlist[i].id}).update({
          is_outtime:1
        })
      }
    }
  }

};
