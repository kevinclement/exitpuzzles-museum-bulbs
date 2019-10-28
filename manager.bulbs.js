let Manager = require('./manager')

module.exports = class HandsManager extends Manager {
    constructor(opts) {
        let ref = opts.fb.db.ref('museum/devices/bulbs')

        let incoming = [];
        let handlers = {};

        super({ ...opts, handlers: handlers, incoming:incoming })

        console.log(this.logPrefix + `spawning bulb processes...`)
        this.bulbs = new (require('./bulbs'))({ logger: opts.logger, fb:opts.fb })
        
        // watch the hands for either touching or toggle
        opts.fb.db.ref('museum/devices/hands').on('value', (snapshot) => {
            let hands = snapshot.val();

            this.on = hands.touching || hands.toggle

            if (this.on && this.bulbs.isWhite) {
                this.bulbs.on();
            } else if (!this.on && !this.bulbs.isWhite) {
                this.bulbs.off();
            }
        });

        this.ref = ref
        this.logger = opts.logger
        this.on = false
    }

    activity() {
    }

    connecting() {
    }

    connected() {
    }
}