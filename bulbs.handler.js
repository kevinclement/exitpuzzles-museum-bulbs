const { exec } = require('promisify-child-process');
const { colors } = require('./bulbs.color');
let fb = new (require('./firebase'))
let ref = fb.db.ref('museum/devices/bulbs/')
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

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
var procs = [];
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
function reset() {  
    exec(`hciconfig -a hci${DEV_ID} reset`).then((error, stdout, stderr) => {
      log(`### RESET: device reset finished`)  
      myEmitter.emit('reset');
    });
}

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

function removedFinishedProcs() {
    procs = procs.filter(proc => proc.exitCode == null || proc.killed);
}

function changeColor(addr, color) {
    log(`change color: ${addr} ${color}`)
    running++;

    let proc = exec(`/usr/bin/gatttool -i hci${DEV_ID} -b ${addr} --char-write-req -a 0x000b -n ${color}`);
    let pid = proc.pid;
  
    proc.then(({ stdout, stderr }) => {
      running--;
      if (running == 0) {
        log(`### COLOR: finished color change`)
        //reset()
      }
      removedFinishedProcs();
    }).catch((err) => {
        running--;

        log(`err: ${pid} ${err}`)
        log(`still running: ${running} `)

        removedFinishedProcs();

        if (proc.killed) {
            if (running == 0) {
                log(`proc killed.  resetting.`)
                //reset()
            }
        } else {
            changeColor(addr, color)
        }

        // setTimeout(()=> {
        //     log(`RETRYING ${addr} in 1s...`)
        //     changeColor(addr, color)
        // }, 1000)
    })

    procs.push(proc);
  }

function cleanupProcesses(cb) {
    if (procs.length) {
        log(`still running, need to kill all`)
        procs.forEach(proc => {
            log(`PROC:`)
            console.dir(proc)
            if (proc.exitCode == null && !proc.killed) {
              log(`killing ${proc.pid}`)
              proc.kill();
            }
        })

        removedFinishedProcs()
        cb()

        // wait for reset to be done before doing next one
        //myEmitter.once('reset', cb);
    } else {
        cb()
    }
}

function turnOn() {
    log(`turning on...`)
    cleanupProcesses(() => {
        for (let n in bulbs) {
            let bulb =  bulbs[n];
            let color = colors.toSend(bulb.color)
            changeColor(bulb.addr, color)
        }
    })
}

function turnOff() {
    log(`turning off...`)
    cleanupProcesses(() => {
        for (let n in bulbs) {
            let bulb =  bulbs[n];
            let color = colors.toSend('white')
            changeColor(bulb.addr, color)
        }
    })
}

function turnColor(color) {
    for (let n in bulbs) {
        let bulb =  bulbs[n];
        changeColor(bulb.addr, color)
    }
}

function log(str) {
    if (process.env.DEBUG) {
        console.log(`${prefix} ${str}`)
    }
}

function err(str) {
    console.log(`${prefix} ${str}`)
}