const express = require('express');
const app = express();
const superagent = require('superagent');
const cheerio = require('cheerio');

// ...
// 本地新闻
let pageRes = {};
let todays = [];

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问百度新闻首页
 */
// encode 汉字
superagent.get('https://search.smzdm.com/?c=faxian&s=%E4%B9%90%E9%AB%98&order=time&f_c=zhi&v=b').end((err, res) => {
    if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`热点新闻抓取失败 - ${err}`)
    } else {
        todays = getToday(res);
        pageRes = res.text;
    }
});

let getToday = (res) => {
    let todays = [];
    let $ = cheerio.load(res.text);
    // console.log($('span.feed-block-extras', 'ul#feed-main-list')[0]);
    $('ul#feed-main-list li').each((index, ele) => {
        console.log($(ele).find('.feed-block-extras').text().length);
        if (removeChinese($(ele).find('.feed-block-extras').text()).trim().length == 5) {
            let campain = {
                title: $(ele).find('.feed-block-title a').text(),
                time: removeChinese($(ele).find('.feed-block-extras').text()).trim(), 
            }
            todays.push(campain);
        }
        
    })
    return todays;
}

function removeChinese(strValue) {  
    if(strValue!= null && strValue != ""){  
        var reg = /[\u4e00-\u9fa5]/g;   
       return strValue.replace(reg, "");   
    }  
    else  
        return "";  
}

app.get('/', async (req, res, next) => {
    res.send({ todays: todays });
});


let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Your App is running at http://%s:%s', host, port);
});