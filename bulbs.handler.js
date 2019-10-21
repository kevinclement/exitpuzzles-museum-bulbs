const { exec } = require('promisify-child-process');
const { colors } = require('./bulbs.color');
let fb = new (require('./firebase'))
let ref = fb.db.ref('museum/devices/bulbs/')

let stats = {
    connects: 0,
    disconnects: 0,
    timeDisconnectedMS: 0
}

ref.child('stats').on('value', (snapshot) => {
    let s = snapshot.val()
    stats.connects = s.connects
    stats.disconnects = s.disconnects
    stats.timeDisconnectedMS = s.timeDisconnectedMS
});

let bulbs = {};
let running = 0;
const DEV_ID = process.env.DEVICE_ID
var prefix = DEV_ID + ":"

process.argv.forEach((val, index) => {
    if (index < 2) return;

    // format is -> name:color:friendly:addr
    let parts = val.split(':');
    let name = parts[0];
    let color = parts[1];
    let friendly = parts[2];
    let addr = parts[3].replace(/-/g, ':');

    bulbs[name] = { color: color, friendly: friendly, addr:addr }
});

// reset devices
exec(`hciconfig -a hci${DEV_ID} reset`, (error, stdout, stderr) => {
    if (error) {
      console.log(`${prefix} exec error: ${error}`);
      return;
    }
});

// handle commands
process.on('message', (msg) => {
    if (msg.cmd == 'on') {
        turnOn();
    } else if (msg.cmd == 'off') {
        turnOff();
    } else if (msg.cmd == 'color') {
        turnColor(msg.color);
    }
});

function changeColor(addr, color) {
    console.log(`${prefix} change color: ${addr} ${color}`)
    running++;

    let proc = exec(`/usr/bin/gatttool -i hci${DEV_ID} -b ${addr} --char-write-req -a 0x000b -n ${color}`);
    let pid = proc.pid;
  
    proc.then(({ stdout, stderr }) => {
      running--;
      if (running == 0) {
        console.log(`${prefix} finished color change`)
      }
    }).catch((err) => {
        running--;

        console.log(`${prefix} err: ${pid} ${err}`)
        console.log(`${prefix} still running: ${running} `)

        setTimeout(()=> {
            console.log(`${prefix} RETRYING ${addr} in 1s...`)
            changeColor(addr, color)
        }, 1000)
    })
  }

function turnOn() {
    for (let n in bulbs) {
        let bulb =  bulbs[n];
        let color = colors.toSend(bulb.color)
        changeColor(bulb.addr, color)
    }
}

function turnOff() {
    for (let n in bulbs) {
        let bulb =  bulbs[n];
        let color = colors.toSend('white')
        changeColor(bulb.addr, color)
    }
}

function turnColor(color) {
    for (let n in bulbs) {
        let bulb =  bulbs[n];
        changeColor(bulb.addr, color)
    }
}