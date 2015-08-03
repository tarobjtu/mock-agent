/**
 * Created by tao.qit(导演) on 15/7/10.
 *
 */

var path = require("path");
var parse = require('url').parse;
var fs = require('fs');

var _ = require('lodash');
var fs = require('fs-extra');


var RE = {
    host : /dms.daily.base.com/,  // AnyProxy抓取异步请求host规则
    path : /\.json$/              // AnyProxy抓取异步请求path规则
};
// 参数黑名单 - 不作为命名的一部分存在
var queryEscapeList = ['ctoken', '_ZERO_NO_CACHE_COUNT_'];
// 文件存放路径
var base = path.resolve('data/ajax/');


function setMockData(req, data){

    if(!isValidUrl(req)) return;

    var urlObj = parse(req.url, true);
    var filename = genFileName(urlObj.pathname, urlObj.query);
    var fullPath = path.join(base, req.method.toLowerCase(), filename);

    console.log('生成mock数据文件：', fullPath);

    try{
        data = JSON.parse(data);
    } catch(err){
        console.log('非JSON数据：' + urlObj.pathname);
    }

    try{
        fs.outputJSONSync(fullPath, data);
    } catch(err){
        console.log('文件创建失败：' + urlObj.pathname);
    }
}

function getMockData(req){

    if(!isValidPath(req)) return;

    var urlObj = parse(req.url, true);
    var filename = genFileName(urlObj.pathname, urlObj.query);
    var fullPath = path.join(base, req.method.toLowerCase(), filename);

    try{
        return fs.readFileSync(fullPath, 'utf8');
    } catch(err){
        console.log('文件创建失败：' + fullPath);
        return;
    }
}

function isValidUrl(req){
    var urlObj = parse(req.url, true);
    return RE.host.test(req.headers.host) && RE.path.test( urlObj.pathname );
}

function isValidPath(req){
    var urlObj = parse(req.url, true);
    return RE.path.test( urlObj.pathname );
}

function genFileName(pathname, query){
    var caches = [];
    _.each(query, function(val, key){
        if(queryEscapeList.indexOf(key) === -1){
            caches.push(key + '=' +  val);
        }
    });
    // 参数排序
    caches = _.sortBy(caches);

    var pathObj = path.parse(pathname);
    return pathObj.name + '[' + caches.join('&') + ']' + pathObj.ext;
}


module.exports = {
    setMockData : setMockData,
    getMockData : getMockData
}
