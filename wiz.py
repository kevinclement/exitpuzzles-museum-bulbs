# Support for alternative wifi bulb - wiz
# to make this work I installed
#   pip3 install asyncio
#   pip3 install pywizlight

# Usage
#   wiz.py <IP> <COLOR>
#     COLOR - only supports "red" or "r", "blue" or "b", "green" or "g"
#             defaults to "white"

import sys
import asyncio
from pywizlight import wizlight, PilotBuilder, discovery

addr = sys.argv[1]

# allow to pass 'red', 'blue', 'green', 'white' as color in arguments, otherwise default to white
color = sys.argv[2] if len(sys.argv) > 2 else "white" 
if (color != "white" and 
    color != "red" and color != "r" and 
    color != "blue" and color != "b" and
    color != "green" and color != "g"):
    color = "white"

pb = PilotBuilder(warm_white = 230, brightness = 110, speed = 100)
if (color != "white"):
    if color == "red" or color == "r":
        pb = PilotBuilder(rgb = (255, 0, 0), brightness = 255, speed = 100)
    elif color == "green" or color == "g":
        pb = PilotBuilder(rgb = (0, 255, 0), brightness = 255, speed = 100)    
    elif color == "blue" or color == "b":
        pb = PilotBuilder(rgb = (0, 0, 255), brightness = 255, speed = 100)
    else:
        raise ValueError("color wasn't white but couldn't parse to true color")

async def main():
    light = wizlight(addr)
    await light.turn_on(pb)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())