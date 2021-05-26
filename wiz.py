# Support for alternative wifi bulb - wiz
# to make this work I installed
#   pip3 install asyncio
#   pip3 install pywizlight

import sys
import asyncio
from pywizlight import wizlight, PilotBuilder, discovery

# allow to pass 'red' or 'white' as color in arguments, otherwise default to white
color = sys.argv[1] if len(sys.argv) > 1 else "white" 
if color != "white" and color != "red":
    color = "white"

pb = PilotBuilder(warm_white = 255)
if color == "red":
    pb = PilotBuilder(rgb = (255, 0, 0))

pb.brightness = 255
pb.speed = 100

###########################################
# NOTE: bulb is hard coded to this IP so  #
# that I don't have to discover it        #
###########################################

async def main():
    # 6.3
    light = wizlight("192.168.1.200")
    await light.turn_on(pb)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())