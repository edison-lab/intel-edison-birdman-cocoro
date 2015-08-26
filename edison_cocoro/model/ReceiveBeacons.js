
Bleacon = require('bleacon');
Bleacon.startScanning();

var nearestPeripheral;
Bleacon.on('discover', function(bleacon) {
  if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 1 ){
  	if(bleacon.proximity == 'immediate') nearestPeripheral = 'monkey';
  } else if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 2) {
  	if(bleacon.proximity == 'immediate') nearestPeripheral = 'fridge';
  } else if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 3) {
  	if(bleacon.proximity == 'immediate') nearestPeripheral = 'tv';
  } else if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 4) {
  	if(bleacon.proximity == 'immediate') nearestPeripheral = 'table';
  } else if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 5) { 
    if(bleacon.proximity == 'immediate') nearestPeripheral = 'light';           
  } else if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 6) {
    if(bleacon.proximity == 'immediate') nearestPeripheral = 'plant';
  } else if(bleacon.uuid == 'da41e595b25f4248919813bc80baedc5' && bleacon.major == 6 && bleacon.minor  == 7) { 
    if(bleacon.proximity == 'immediate') nearestPeripheral = 'sofa';           
  } 
});

exports.getNearestPeripheral = function(){
  if(nearestPeripheral=='monkey'|nearestPeripheral=='fridge'|nearestPeripheral=='tv'|nearestPeripheral=='table'|nearestPeripheral=='light'|nearestPeripheral=='plant'|nearestPeripheral=='sofa'){
    console.log("NEAR BEACON: "+nearestPeripheral);
  } else {
    console.log("NOT BEACON");
    nearestPeripheral = 'monkey';
  }
	return nearestPeripheral;
}
