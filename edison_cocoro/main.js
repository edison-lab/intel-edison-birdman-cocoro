
var voiceThreshold = 2000;

var Mraa = require('./model/Mraa.js');
var AudioIn = require('./model/AudioIn.js');
var AudioOut = require('./model/AudioOut.js');
var Cocoro = require('./model/CocoroAPI.js');
var Beacon = require('./model/ReceiveBeacons.js');

var isRecording = false;
var isRecordInit = false;
var isSpeaking = false;

var fps = 10;
var quietCount = 0;

var isDeviceMoving_prev = false;

function setup() {

  AudioIn.setup();
  AudioIn.setDebugVU(true);
  AudioIn.setSpeakThreshold(voiceThreshold);
  Mraa.setLed('ON_RED');
  console.log('\n ／￣＼／￣＼\n｜　　　　　｜\n ＼　 OK 　／\n   ＼　　／\n     ＼／\n');
  console.log("-- MIC START");

  var loopSystem = setInterval(function() {
    update();
  }, 1000/fps);

}

function update(){

  var isSpeaking = AudioIn.getIsSpeaking();

  if(isSpeaking == true && isRecordInit == false) {
    console.log("-- Recognized the voice");
    AudioIn.saveRecCache('/home/root/cocoro/sound/record.wav');
    isRecording = isRecordInit = true;
  } 

  if(isRecording == true) {
    if(isSpeaking == true) {
      Mraa.setLed('ON_RED');
      quietCount = 0;
    }
    else if(isSpeaking == false) {
      if(quietCount == 4) {
        console.log("-- MIC END");
        isRecording = false;
        AudioIn.setPause(true);
        var nearestBeacon = Beacon.getNearestPeripheral();
        Cocoro.aizuchi(nearestBeacon, function(){
          Mraa.setLed('ON_BLUE');
          AudioOut.playSound('/home/root/cocoro/sound/output_aizuchi_'+nearestBeacon+'.raw', 16000);
        });
        Cocoro.dialogue('/home/root/cocoro/sound/record.wav', nearestBeacon, function(){ 
          AudioOut.playSound('/home/root/cocoro/sound/output_dialogue_'+nearestBeacon+'.raw', 16000, function(){ 
            restartListen();
          });
        });
      } else {
        quietCount++;
      }
    }
  }

}

function restartListen(){

  Mraa.setLed('ON_RED');
  console.log("-- MIC START");
  isRecording = isRecordInit = false;
  quietTimer = 0;
  AudioIn.setPause(false);

}

setup();
