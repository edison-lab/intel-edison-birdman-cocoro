
var m = require('mraa');

var led_red = new m.Gpio(20);
var led_green = new m.Gpio(14);
var led_blue= new m.Gpio(0);

led_red.dir(m.DIR_OUT);
led_green.dir(m.DIR_OUT);
led_blue.dir(m.DIR_OUT);

exports.setLed = function(color){

  if(color == 'ON_GREEN') {
    led_red.write(0);
    led_green.write(1);
    led_blue.write(0);
  } else if(color == 'ON_RED') {
    led_red.write(1);
    led_green.write(0);
    led_blue.write(0);
  } else if(color == 'ON_BLUE'){
    led_red.write(0);                             
    led_green.write(0);          
    led_blue.write(1);  
  } else if(color == 'ON_YELLOW') {                             
    led_red.write(1);                                        
    led_green.write(1);                                   
    led_blue.write(0);                            
  } else if(color == 'OFF') {
    led_red.write(0);
    led_green.write(0);
    led_blue.write(0);
  }
  ledColor = color;

}

exports.getLed = function(){
  return ledColor;
}

function char(x) { return parseInt(x, 16); }

