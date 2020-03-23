const fs = require('fs')
const { Image, registerFont, createCanvas } = require('canvas');
var express = require('express')
var app = express();
 
var ctx;                  //画布环境
var canvas;               //画布
var port = 3036;          //端口
var txtColor = '#fff';    //默认名字文字颜色：白
var bgColor = '#029aee';  //默认头像背景：蓝
var imgWidth = 500;       //要生成的图片宽度
registerFont('fonts/cn.ttf', { family: 'CNFONT' }); // 方正兰亭黑简

//初始化画布
function initDraw(){
  canvas = createCanvas(imgWidth, imgWidth);
  ctx = canvas.getContext('2d',{alpha: false});
  ctx.font = '152px CNFONT';
}

//设置背景
function setBackground( color ){
    ctx.fillStyle = color;
    ctx.rect(-1, -1, imgWidth+2, imgWidth+2);
    ctx.fill();
}

//画头像并保存
function draw(txt,dir,fileName,color){
    console.log(txt);
    ctx.fillStyle = color;
    var textInfo = ctx.measureText(txt);
    ctx.fillText(txt, 250 - Math.round(textInfo.width*0.5), 290);
    var toDir = __dirname + (dir?'/'+dir:'');
    var outPutPath = toDir+"/"+(fileName?fileName:'test.jpg');
    console.log(toDir);
    console.log(outPutPath);
    if (!fs.existsSync(toDir)) fs.mkdirSync(toDir); 
    const out = fs.createWriteStream(outPutPath);
    const stream = canvas.createJPEGStream({quality: 0.95});
    stream.pipe(out);
    var buff = canvas.toBuffer("image/png");
    var base64str = buff.toString('base64');
    out.on('finish', () =>  console.log('PNG已生成'));
    return '<img src="data:image/png;base64,'+base64str+'"/>'+'<br><code>;base64,'+base64str+'</code>';
}

initDraw();

app.all('/', function (req, res) {
  var txt = req.query.txt;
  var c1 = req.query.c1;
  var dir = req.query.dir;
  var fileName = req.query.name;
  if(c1){
    var customBgColor = "#"+c1.replace("#","");
    setBackground(customBgColor);
  }else{
    setBackground(bgColor);
  }
  var c2 = req.query.c2;
  try{
    var outStr;
    if(c2){
      var customFontColor = "#"+c2.replace("#","");
      outStr = draw(txt,dir,fileName,customFontColor);
    }else{
      outStr = draw(txt,dir,fileName,txtColor);
    }
    res.send(outStr);
  }catch(e){
    console.log(e);
  }
})

app.listen(port);
console.log("监听 IP 和 端口 ：  http://localhost:"+port)
console.log("使用例子1：http://localhost:3036/?txt=AC&c1=f0f&c2=fff");
console.log("使用例子2：http://localhost:3036/?txt=AA&name=pic.jpg&dir=2020_03");
console.log("txt=AC 用户名，c1=f0f 背景颜色，c2 字体颜色，dir 指定目录，name 指定图片文件名");




