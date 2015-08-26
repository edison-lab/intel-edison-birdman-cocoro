

var mic = require('microphone');
var fs = require('fs');

var isDebug_vu = false;

// 16bit Little Endian 16000 mono
var wavHeader = new Buffer([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x80,0x57,0x41,0x56,0x45,0x66,0x6d,0x74,0x20,0x10,0x00,0x00,0x00,0x01,0x00,0x01,0x00,0x80,0x3e,0x00,0x00,0x00,0xee,0x02,0x00,0x04,0x00,0x10,0x00,0x64,0x61,0x74,0x61,0x00,0x00,0x00,0x80]);
var hpfCoef = [ 0.0016976527263135508, 0.0019472525434874582, 0.0023725160960826014, 0.0026170653011860535, 0.002076356271734383, 1.0875899412729064e-17, -0.004348222178476784, -0.011504574872912099, -0.02163457787571366, -0.034417846740109885, -0.049019722472303774, -0.06416377602741553, -0.07829819320310744, -0.08982857267499483, -0.09737440758415258, 0.9, -0.09737440758415258, -0.08982857267499483, -0.07829819320310744, -0.06416377602741553, -0.049019722472303774,  -0.034417846740109885,  -0.02163457787571366, -0.011504574872912099,  -0.004348222178476784, 1.0875899412729064e-17, 0.002076356271734383, 0.0026170653011860535,  0.0023725160960826014,  0.0019472525434874582, 0.0016976527263135508 ];
var recordData = [];
var volume = 0.00;
var speakThreshold = 7000;

var isActive = false;
var isPause = false;
var isSpeaking = false;

exports.setup = function() {
  isActive = true;
  fs.writeFile('/home/root/cocoro/sound/record.wav', wavHeader);
  mic.startCapture();
};

mic.audioStream.on('data', function(data) { 
  if(data.length>=44 && isActive==true) loop(data);
});

function loop(data){

  var compressData = compressPCM(data);
  var dataBuf = new Buffer(compressData);

  setRecordData(compressData);
  setVolume(data);
  fs.appendFile('/home/root/cocoro/sound/record.wav', dataBuf);

}

function compressPCM(buf){
 
  // 48000hz 16Bit stereo -> 16000hz 16Bit mono
  var passing = 4*(48000/16000);
  var compressBuf = [];
  for(var i = 0; i<buf.length-4; i+=passing){
    compressBuf.push(buf[i+2]);
    compressBuf.push(buf[i+3]);
  }
  return compressBuf;

}

var recordData_new = [];
function setRecordData(arr){

  recordData_new = arr;
  recordData = recordData.concat(arr);
  if(recordData.length > 16000*1) {
    recordData = recordData.slice(recordData.length-16000*1, recordData.length);
  }

}

function setVolume(buf){ 
  
  // NOTE: 'MAX_WAVE' / 'AVERAGE_WAVE'
  var mode = 'AVERAGE_WAVE'; 

  var gain = 18.00;
  var passing = 2*16;
  var decimalArr = [];
  var decimalFilter = [];
  var hpfLen = hpfCoef.length;
  var waveMax = 0;
  var waveAvarage = 0;
  
  for(var i=0; i < buf.length; i+=passing){
    var a = buf[i].toString(16);
    if(a.length == 1) a = "0" + a;
    var b = buf[i+1].toString(16);
    if(b.length == 1) b = "0" + b;
    var str = b + a; // 16bit - Little Endian
    var decimalNum = parseInt(str ,16);
    if(decimalNum > 32767) decimalNum -= 65536;
    decimalArr.push(decimalNum);
  }

  for (var i=0; i < decimalArr.length; i++) { 
    decimalFilter[i] = 0.00;
    if(i < hpfLen) continue;
    for(var j=0, k=i; j < hpfLen; j++, k--){ 
      decimalFilter[i] += decimalArr[k] * hpfCoef[j];
    }
    waveAvarage += Math.abs(decimalFilter[i]);
    if(Math.abs(decimalFilter[i])>waveMax) waveMax = Math.abs(decimalFilter[i]);
  }
  waveAvarage *= (0.0001*gain);

  if(isDebug_vu == true && isPause == false) {
    var vu = '';
    if(mode == 'MAX_WAVE'){
      for(var i=0; i<waveMax/100; i+=1) {
        vu += '#';
      }
    } else if(mode == 'AVERAGE_WAVE') {
      for(var i=0; i<Math.floor(waveAvarage)/10; i+=1) {
        vu += '#';
      }
    }
    console.log("MAX_WAVE:", Math.floor(waveMax), "AVERAGE_WAVE:", Math.floor(waveAvarage));
    console.log(vu);
  }
  if(mode == 'MAX_WAVE') volume = Math.floor(waveMax);
  else if(mode == 'AVERAGE_WAVE') volume = Math.floor(waveAvarage);
}

exports.getVolume = function(){ return volume; };

exports.setSpeakThreshold = function(val){ speakThreshold = val; };

exports.getSpeaking = function(){

  var speaking;
  if(volume > speakThreshold) speaking = true;
  else speaking = false;
  return speaking;

};

exports.setPause = function(f){
  isPause = f;
};

exports.resetFile = function(file){
  fs.writeFile(file, wavHeader);
};

exports.saveRecCache = function(file){
  var a = recordData;
  console.log("test",recordData.length, recordData_new.length, a.length);
  var buf = new Buffer(a);
  fs.writeFile(file, wavHeader);
  fs.appendFile(file, buf);
};

exports.saveRecStream = function(file){
  var buf = new Buffer(recordData);
  fs.appendFile(file, buf);
};

exports.setDebugVU = function(f){
  isDebug_vu = f;
};





