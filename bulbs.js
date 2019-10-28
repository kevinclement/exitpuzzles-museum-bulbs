const { fork } = require('child_process');

const forks = []
module.exports = class Bulbs {
  constructor(opts) {

    this.logger = opts.logger
    this.isWhite = true;
    this.idol = -1;

    // NOTE: It's important to use the correct devices for these.  The built in bluetooth can't connect to enough, so 
    // we need to use the two usb ones.  To verify, cat /sys/class/bluetooth/hci0/device/uevent.  Should see DEVTYPE=usb_interface
    const bulbs = require('./bulbs.devices');
    forks.push(fork('/home/pi/code/bulbs/bulbs.handler', bulbs.getBulbs(0,9),   {env: {DEVICE_ID: 0, DEBUG: process.env.DEBUG }}))
    forks.push(fork('/home/pi/code/bulbs/bulbs.handler', bulbs.getBulbs(9,18),   {env: {DEVICE_ID: 1, DEBUG: process.env.DEBUG }}))
  
    // hookup message passing back
    forks.forEach((f) => {
      f.on('message', this.childMessage)
    });
  }

  off()  {
    forks.forEach((f) => {
      f.send({ cmd: 'off' });
    });

    this.isWhite = true;
  }

  on()  {
    forks.forEach((f) => {
      f.send({ cmd: 'on' });
    });

    this.isWhite = false;
  }

  childMessage(msg) {
  }

  // red,green,blue
  color(color) {
    forks.forEach((f) => {
      f.send({ cmd: 'color', color: color });
    });

    this.isWhite = color == 'white';
  }
}