let bulbs = [

    "LEDBLE-78631FC2:g:1-1:F8-1D-78-63-1F-C2", // 1-1  F8:1D:78:63:1F:C2
    "LEDBLE-786313DD:r:1-2:F8-1D-78-63-13-DD", // 1-2  F8:1D:78:63:13:DD
    "LEDBLE-7862F141:r:1-3:F8-1D-78-62-F1-41", // 1-3  F8-1D-78-62-F1:41

    "LEDBLE-78631836:r:2-1:F8-1D-78-63-18-36", // 2-1  F8:1D:78:63:18:36
    "LEDBLE-7863123D:r:2-2:F8-1D-78-63-12-3D", // 2-2  F8:1D:78:63:12:3D
    "LEDBLE-78630E2C:b:2-3:F8-1D-78-63-0E-2C", // 2-3  F8:1D:78:63:0E:2C
  
    "LEDBLE-78631A58:g:3-1:F8-1D-78-63-1A-58", // 3-1  F8:1D:78:63:1A:58
    "LEDBLE-78633FEC:b:3-2:F8-1D-78-63-3F-EC", // 3-2  F8:1D:78:63:3F:EC
    
    // This bulb went bad, replaced by wifi device
    "WIZ-63:r:6-3:192.168.1.200",              // 3-3  192.168.1.200

    "LEDBLE-78630D85:r:4-1:F8-1D-78-63-0D-85", // 4-1  F8:1D:78:63:0D:85
    "LEDBLE-78631C80:b:4-2:F8-1D-78-63-1C-80", // 4-2  F8:1D:78:63:1C:80
    "LEDBLE-78630D44:b:4-3:F8-1D-78-63-0D-44", // 4-3  F8:1D:78:63:0D:44
  
    "LEDBLE-78631D51:r:5-1:F8-1D-78-63-1D-51", // 5-1  F8:1D:78:63:1D:51
    "LEDBLE-78633300:g:5-2:F8-1D-78-63-33-00", // 5-2  F8:1D:78:63:33:00
    "LEDBLE-78631A94:g:5-3:F8-1D-78-63-1A-94", // 5-3  F8:1D:78:63:1A:94
  
    "LEDBLE-78631D3E:r:6-1:F8-1D-78-63-1D-3E", // 6-1  F8:1D:78:63:1D:3E
    "LEDBLE-786310B1:b:6-2:F8-1D-78-63-10-B1", // 6-2  F8:1D:78:63:10:B1
    "LEDBLE-786311CD:r:6-3:F8-1D-78-63-11-CD", // 6-3  F8:1D:78:63:11:CD
    
    // This is extra build I setup "just in case"
    // "museum-xtra:r:6-3:192.168.1.201",         // 6-x  192.168.1.200
]

exports.getBulbs = function(start, end) {
    return bulbs.filter((bulb, index) => index >= start && index < end);
}