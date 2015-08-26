
var exec = require('child_process').exec;
var fs = require('fs');

exports.dialogue = function(inputFile, beaconID){
  exec(
    "curl -X POST --data-binary @" + inputFile + " http://://****.***/cocoro/v1/dialogue/" + beaconID + ".php",
    function(error, stdout, stderr){
      exec( "wget http://****.***/cocoro/v1/dialogue/output_dialogue_" + beaconID + ".raw -N -P /home/root/cocoro/sound", function(){ console.log(stdout); });
    }
  });
};

exports.aizuchi = function(beaconID, callback){
  exec(
    "curl -X POST -d beacon=" + beaconID + " http://****.***/cocoro/v1/aizuchi/index.php",
    function(error, stdout, stderr){
      console.log(stdout);
      exec( "wget http://****.***/cocoro/v1/aizuchi/output_aizuchi_" + beaconID + ".raw -N -P /home/root/cocoro/sound", function(){ callback(); });
    }
  );
};



