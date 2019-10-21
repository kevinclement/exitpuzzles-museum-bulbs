const { exec } = require('promisify-child-process');

var running = 0;
var procs = [];

function reset() {
    var h1 = exec(`hciconfig -a hci0 reset`);
    var h2 = exec(`hciconfig -a hci1 reset`);
  
    Promise.all([h1, h2]).then((results) => {
      // results is [ { stdout: stderr: }, ... ]
  
      console.log(`promises finished`)
      if (results[0].stderr) {
        console.log(`HCI0 reset had problems: ${results[0].stderr}`)
      }
      if (results[1].stderr) {
        console.log(`HCI1 reset had problems: ${results[1].stderr}`)
      }
    });
}

function removedFinishedProcs() {
    procs = procs.filter(proc => proc.exitCode == null || proc.killed);
}

exports.changeColor =  function(dev, addr, color) {
    console.log('change color: ' + addr + " " + color)
    running++;
  
    let proc = exec(`/usr/bin/gatttool -i ${dev} -b ${addr} --char-write-req -a 0x000b -n ${color}`);
    let pid = proc.pid;
  
    proc.then(({ stdout, stderr }) => {
      running--;
      if (running == 0) {
        console.log('ALL DONE - RESETTING...')
        //reset()
      }
      removedFinishedProcs();
    }).catch((err) => {
        running--;
  
        console.log(`err: ${pid} ${err}`)
        console.log('running ' + running)
  
        removedFinishedProcs();
  
        if (proc.killed) {
          if (running == 0) {
            console.log('## resetting ##...')
            reset()
          }
        } else {
          changeColor(addr, color)
        }
    })
  
    procs.push(proc);
  }

  color = white
  if (process.argv[3] == 'green') { color = green }
  let start = parseInt(process.argv[4]);
  let end = parseInt(process.argv[5]);
  
  // console.log(`dev: ${dev} color: ${color} start: ${start} end: ${end}`)
  for (var i=start;i<end;i++) {
    changeColor(bulbs[i], color)
  }