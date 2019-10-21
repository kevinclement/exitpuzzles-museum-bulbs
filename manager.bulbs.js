let Manager = require('./manager')

let datestr = getDateStr()

module.exports = class HandsManager extends Manager {
    constructor(opts) {
        let ref = opts.fb.db.ref('museum/devices/bulbs')

        let incoming = [];
        let handlers = {};

        super({ ...opts, handlers: handlers, incoming:incoming })

        // copy the stats to an archive
        console.log(this.logPrefix + `archiving old stats...`)
        ref.once('value', (snapshot) => {
            let stats = snapshot.val().stats

            ref.child('archive').child(datestr).set(stats).then((e) => {
                console.log(this.logPrefix + `stats archived to ${datestr}.`)
    
                // clear stats
                ref.child('stats').update({
                    start: datestr,
                    connects: 0,
                    disconnects: 0,
                    timeDisconnectedMS: 0
                }).then((e) => {
                    console.log(this.logPrefix + `stats reset.`)

                    // once database is updated, connect bulbs
                    console.log(this.logPrefix + `connecting bulbs...`)
                    this.bulbs = new (require('./bulbs'))({ logger: opts.logger, fb:opts.fb })

                    // watch the hands for either touching or mock
                    opts.fb.db.ref('museum/devices/hands').on('value', (snapshot) => {
                        let hands = snapshot.val();

                        this.on = hands.touching || hands.mock

                        if (this.on && this.bulbs.isWhite) {
                            this.bulbs.on();
                        } else if (!this.on && !this.bulbs.isWhite) {
                            this.bulbs.off();
                        }
                    });
                });
            });
        });

        this.ref = ref
        this.logger = opts.logger
        this.on = false
    }

    activity() {
         this.ref.child('info').update({
             lastActivity: (new Date()).toLocaleString()
        })
    }

    connecting() {
        // NOTE: while connecting, mark device as disabled, since it defaults to that
        this.ref.child('info').update({
            isConnected: false
        })
    }

    connected() {

        this.ref.child('info').update({
            isConnected: true,
            lastActivity: (new Date()).toLocaleString()
        })
    }
}

function getDateStr() {
    let now = new Date();

    let M = now.getMonth() + 1
    M = M < 10 ? "0" + M : M
    let d = now.getDate()
    d = d < 10 ? "0" + d : d
    let y = now.getFullYear()
    let h = now.getHours()
    h = h < 10 ? "0" + h : h
    let m = now.getMinutes()
    m = m < 10 ? "0" + m : m
    let s = now.getSeconds()
    s = s < 10 ? "0" + s : s

    return `${M}-${d}-${y} ${h}:${m}:${s}`
}