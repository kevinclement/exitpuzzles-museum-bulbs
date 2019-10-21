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
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

