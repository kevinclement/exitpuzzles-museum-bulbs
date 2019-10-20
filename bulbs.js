const { fork } = require('child_process');

const forks = []
module.exports = class Bulbs {
  constructor(opts) {

    this.logger = opts.logger
    this.isWhite = true;
    this.idol = -1;

    this.connectToBulbs()

    // TMP: do this for real ----------------------------
    // this.cabRef = opts.fb.db.ref('museum/devices/cabinet').on('value', (snapshot) => {
    //   let cabinet = snapshot.val()
    //   if (cabinet == null) return

    //   if (this.idol != -1 && this.idol != cabinet.idol) {
    //     console.log('Detected idol change, changing lights to match');
    //     var color = 'blue';
    //     if (cabinet.idol == 3) {
    //       color = 'red';
    //     }
    //     if (cabinet.idol == 4) {
    //       color = 'green';
    //     }
    //     this.color(color);
        
    //     console.log(`Change to ${cabinet.idol}`);
    //   }

    //   this.idol = cabinet.idol;
    // })
    // ---------------------------------------------------
  }

  // NOTE: It's important to use the correct devices for these.  The built in bluetooth can't connect to enough, so 
  // we need to use the two usb ones.  To verify, cat /sys/class/bluetooth/hci0/device/uevent.  Should see DEVTYPE=usb_interface
  connectToBulbs() {
    const bulbs = require('./bulbs.devices');
    forks.push(fork('/home/pi/code/bulbs/bulbs.handler', bulbs.getBulbs(0,2),   {env: {NOBLE_HCI_DEVICE_ID: 0, DEBUG: process.env.DEBUG }}));
    forks.push(fork('/home/pi/code/bulbs/bulbs.handler', bulbs.getBulbs(2,4),   {env: {NOBLE_HCI_DEVICE_ID: 1, DEBUG: process.env.DEBUG }}));
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

  // red,green,blue
  color(color) {
    forks.forEach((f) => {
      f.send({ cmd: 'color', color: color });
    });

    this.isWhite = color == 'white';
  }
}