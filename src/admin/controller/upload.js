const Base = require('./base.js');
const fs = require('fs');
const qiniu = require('qiniu')


module.exports = class extends Base {
  async tokenAction() {
    // 文件名
    // 七牛提供的公钥
    var accessKey = 'ppTc_kr4j3hh4iojCyrIkilmnYtFrIXr4V_Wwblx'
    // 七牛提供的私钥
    var secretKey = 'wL0vxR_Jzhs3iqmZWEGGJYzlaQnZ6TSQmatYTYd-'
    // 存储空间名
    var bucketName = 'bbgshop'
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {
        "scope": bucketName
      };
      var putPolicy = new qiniu.rs.PutPolicy(options);
      var uploadToken=putPolicy.uploadToken(mac);
      console.log(uploadToken);
        return this.success({
            uploadToken:uploadToken
        })
    }

};
