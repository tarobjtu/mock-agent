/**
 * Created by tao.qit(导演) on 15/7/10.
 * 描述：anyProxy拦截规则
 * 功能：
 *      1. 抓取线上或测试环境异步请求数据
 *      2. 拼装成符合mock-agent规范的mock数据
 *      3. 保存到指定文件夹
 */


var setMockData = require('../lib/mock-data').setMockData;

module.exports = {

    summary : function(){
        return '抓取线上或测试环境异步请求数据，有任何问题，联系tao.qit(导演)。';
    },

    replaceServerResDataAsync: function(req,res,serverResData,callback){
        setMockData(req, serverResData.toString());
        callback(serverResData);
    }
};

