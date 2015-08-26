
var exec = require('child_process').exec;
var speechText = '';

exports.playSound = function(file, freq, callback) {
  setTimeout(function(){
  exec('sox -v 1 -r 48k -e signed -b 16 -c 2 --endian big ' + file + ' /home/root/cocoro/sound/file_addHeader.wav', function(error, stdout, stderr){
  	exec('sox /home/root/cocoro/sound/file_addHeader.wav /home/root/cocoro/sound/file_lowspeed.wav speed 0.166', function(error, stdout, stderr){
  		exec('aplay -f S16_LE -c 2 -D hw:1,0 /home/root/cocoro/sound/file_lowspeed.wav');
  		exec('wc -c /home/root/cocoro/sound/file_lowspeed.wav | cut -d " " -f1 -', function(error, stdout, stderr){
    		var delay = 0;
    		delay = Math.floor(stdout/158);
    		setTimeout(callback, delay);
  		});
  	});
  });
  }, 500);
};

exports.playSoundAizuchi = function(file, freq, callback) {
  //exec('aplay -D sysdefault:CARD=U0x41e0x30d3 -r ' + freq + ' -c 1 -f S16_BE ' + file);
  exec('sox -v 1 -r 48k -e signed -b 16 -c 2 --endian big ' + file + ' /home/root/cocoro/sound/file_addHeaderAizuchi.wav', function(error, stdout, stderr){
    exec('sox /home/root/cocoro/sound/file_addHeaderAizuchi.wav /home/root/cocoro/sound/file_lowspeedAizuchi.wav speed 0.166', function(error, stdout, stderr){
      exec('aplay -f S16_LE -c 2 -D hw:1,0 /home/root/cocoro/sound/file_lowspeedAizuchi.wav');
      exec('wc -c /home/root/cocoro/sound/file_lowspeedAizuchi.wav | cut -d " " -f1 -', function(error, stdout, stderr){
        var delay = 0;
        delay = Math.floor(stdout/158);
        setTimeout(callback, delay);
      });
    });
  });
};