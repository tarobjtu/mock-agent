/**
 * Created by tao.qit(导演) on 15/7/10.
 *
 */

var path = require("path");
var parse = require('url').parse;
var fs = require('fs');

var _ = require('lodash');
var fs = require('fs-extra');


var base = path.join(process.cwd(), 'data/ajax/');
var RE = {
    host : /dms.daily.base.com/,
    path : /\.json$/
};
var queryEscapeList = ['ctoken', '_ZERO_NO_CACHE_COUNT_'];


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
        console.log('文件创建失败：' + urlObj.pathname);
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
    var fileName = '';
    _.each(query, function(val, key){
        if(queryEscapeList.indexOf(key) === -1){
            fileName += (key + '=' +  val + '&');
        }
    });
    var pathObj = path.parse(pathname);
    fileName = pathObj.dir.replace('/', '_') + pathObj.name + '___' + fileName + pathObj.ext;
    return fileName;
}


module.exports = {
    setMockData : setMockData,
    getMockData : getMockData
}
