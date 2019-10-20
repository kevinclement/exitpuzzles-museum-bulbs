let Manager = require('./manager')

module.exports = class HandsManager extends Manager {
    constructor(opts) {
        let ref = opts.fb.db.ref('museum/devices/bulb')

        let incoming = [];
        let handlers = {};

        super({ ...opts, handlers: handlers, incoming:incoming })

        // hookup bulb handling
        this.bulbs = new (require('./bulbs'))({ logger: opts.logger, fb:opts.fb })

        // setup supported commands
        handlers['hands.toggle'] = (s,cb) => { 
            bt.write('mock');

            // optimistic update to db, so it doesn't flip back and forth
            ref.update({ mock: !this.mock })

            cb();
        }

        this.ref = ref
        this.logger = opts.logger
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