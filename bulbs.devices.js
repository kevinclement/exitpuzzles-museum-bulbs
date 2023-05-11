let bulbs = [

    "WIZ-11:g:1-1:192.168.1.214",              // 1-1  192.168.1.214
    "WIZ-12:r:1-2:192.168.1.217",              // 1-2  192.168.1.217
    "WIZ-13:r:1-3:192.168.1.215",              // 1-3  192.168.1.215

    "WIZ-21:r:2-1:192.168.1.209",              // 2-1  192.168.1.209
    "WIZ-22:r:2-2:192.168.1.210",              // 2-2  192.168.1.210
    "WIZ-23:b:2-3:192.168.1.212",              // 2-3  192.168.1.212
  
    "WIZ-31:g:3-1:192.168.1.211",              // 3-1  192.168.1.211
    "WIZ-32:b:3-2:192.168.1.213",              // 3-2  192.168.1.213
    "WIZ-33:r:3-3:192.168.1.200",              // 3-3  192.168.1.200

    "WIZ-41:r:4-1:192.168.1.205",              // 4-1  192.168.1.205
    "WIZ-42:b:4-2:192.168.1.201",              // 4-2  192.168.1.201
    "WIZ-43:b:4-3:192.168.1.206",              // 4-3  192.168.1.206
  
    "WIZ-51:r:5-1:192.168.1.202",              // 5-1  192.168.1.202
    "WIZ-52:g:5-2:192.168.1.204",              // 5-2  192.168.1.204
    "WIZ-53:g:5-3:192.168.1.216",              // 5-3  192.168.1.216
  
    "WIZ-61:r:6-1:192.168.1.203",              // 6-1  192.168.1.203
    "WIZ-62:b:6-2:192.168.1.207",              // 6-2  192.168.1.207
    "WIZ-63:r:6-3:192.168.1.208",              // 6-3  192.168.1.208
]

exports.getBulbs = function(start, end) {
    return bulbs.filter((bulb, index) => index >= start && index < end);
}
