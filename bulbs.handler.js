const { exec } = require('promisify-child-process');
const { colors } = require('./bulbs.color');
let fb = new (require('./firebase'))
let ref = fb.db.ref('museum/devices/bulbs/')

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

function changeColor(addr, friendly, color, colorFriendly) {
    log(`change color: ${friendly} [${addr}]`)
    running++;
    
    // if addr is wifi address, use python script
    let proc;
    if (addr.startsWith('192.')) {
        proc = exec(`/usr/bin/python3 wiz.py ${addr} ${colorFriendly}`);
    } else {
        proc = exec(`/usr/bin/gatttool -i hci${DEV_ID} -b ${addr} --char-write-req -a 0x000b -n ${color}`);
    }
    
    let pid = proc.pid;
  
    proc.then(({ stdout, stderr }) => {
      running--;
      if (running == 0) {
        log(`### COLOR: finished color change`)
      }

      // update the database with new color
      ref.child(friendly).update({ color: colorFriendly})

      removedFinishedProcs();
    }).catch((err) => {
        running--;

        log(`err: ${pid} ${err}`)
        log(`still running: ${running} `)

        removedFinishedProcs();

        if (proc.killed) {
            if (running == 0) {
                log(`proc killed.`)
            }
        } else {
            changeColor(addr, friendly, color, colorFriendly)
        }
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
            changeColor(bulb.addr, bulb.friendly, color, bulb.color)
        }
    })
}

function turnOff() {
    log(`turning off...`)
    cleanupProcesses(() => {
        for (let n in bulbs) {
            let bulb =  bulbs[n];
            let color = colors.toSend('white')
            changeColor(bulb.addr, bulb.friendly, color, 'white')
        }
    })
}

function turnColor(color) {
    for (let n in bulbs) {
        let bulb =  bulbs[n];
        changeColor(bulb.addr, bulb.friendly, color, color)
    }
}

function log(str) {
    if (process.env.DEBUG) {
        console.log(`${prefix} ${str}`)
    }
}