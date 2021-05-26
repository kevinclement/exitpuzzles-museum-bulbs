# Support for alternative wifi bulb - wiz
# to make this work I installed
#   pip3 install asyncio
#   pip3 install pywizlight

# Usage
#   wiz.py <IP> <COLOR>
#     COLOR - only supports "red" or "r"
#             defaults to "white"

import sys
import asyncio
from pywizlight import wizlight, PilotBuilder, discovery

addr = sys.argv[1]

# allow to pass 'red' or 'white' as color in arguments, otherwise default to white
color = sys.argv[2] if len(sys.argv) > 2 else "white" 
if color != "white" and color != "red" and color != "r":
    color = "white"

pb = PilotBuilder(warm_white = 230, brightness = 140, speed = 100)
if color == "red" or color == "r":
    pb = PilotBuilder(rgb = (255, 0, 0), brightness = 255, speed = 100)

###########################################
# NOTE: bulb is hard coded to this IP so  #
# that I don't have to discover it        #
###########################################

async def main():
    # 6.3
    light = wizlight(addr)
    await light.turn_on(pb)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())