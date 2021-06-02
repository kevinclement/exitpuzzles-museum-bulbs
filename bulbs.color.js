exports.colors = {
    toHex: (color) => {
        let r = g = b = 0;
        if (color == 'red' || color == 'r') {
            r = 255
        } else if (color == 'blue' || color == 'b') {
            b = 255
        } else if (color == 'green' || color == 'g') {
            g = 255
        } else if (color == 'random') {
            r = getRandomInt(255)
            g = getRandomInt(255)
            b = getRandomInt(255)
        }

        return {r:r, g:g, b:b};
    },
    toSend: (color) => {
        let r = '00'
        let g = '00'
        let b = '00'

        if (color == 'red' || color == 'r') {
            r = 'ff'
        } else if (color == 'green' || color == 'g') {
            g = 'ff'
        } else if (color == 'blue' || color == 'b') {
            b = 'ff'
        }
        
        let w = color == 'white' || color == 'w' ? 'ff0f' : '00f0'

        return `56${r}${g}${b}${w}aa3b070001`
    }

    // NOTE: below is string used for 'MINGER' bulb after a night of debugging
    //  This is in case we want to use that one as a backup.  I have one still around
    //  command I used when manually running
    //    /usr/bin/gatttool -b A4:C1:38:A0:4C:22 --char-write-req -a 0x0015 -n '3305020000ff00000000000000000000000000cb'
    //  format is:
    //    '330502${r}${g}${b}00000000000000000000000000cb'
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

