/*
 *     __  __  ___   ____ _  __
 *    |  \/  |/ _ \ / ___| |/ /
 *    | |\/| | | | | |   | ' /
 *    | |  | | |_| | |___| . \
 *    |_|  |_|\___/ \____|_|\_\
 *
 * Copyright (c) 2015 tarobjtu(导演)
 * Licensed under the MIT license.
 */


'use strict';

var url = require('url'),
    path = require('path');

var bodyParser = require('body-parser');

var getMockData = require('./lib/mock-data').getMockData;

module.exports = {
    mockMiddlewares : mockMiddlewares
};

// 加载grunt-contrib-connect中间件
function mockMiddlewares (connect, options, middlewares) {

    // 支持 application/json
    middlewares.push(bodyParser.json());
    // 支持 application/x-www-form-urlencoded
    middlewares.push(bodyParser.urlencoded({ extended: false }));
    // mock中间件
    middlewares.push(ajaxData());
    return middlewares;
}


function ajaxData(){

	return function restfulMock(req, res, next){

        var data = getMockData(req);

        if(data){
            res.end(data);
        }
        else{
            next();
        }

	};
}
