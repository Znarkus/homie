#!/usr/bin/env python

import argparse
import sys
import re
import tellcore.telldus as td
import tellcore.constants as const
import requests

config = {
    'transmitters': [
        {'house': 15323014, 'unit': 11}
    ],
    'homie_base_url': 'http://10.0.0.1:3000/'
}

def raw_event(data, controller_id, cid):
    string = "[RAW] {0} <- {1}".format(controller_id, data)
    print(string)

    for transmitter in config['transmitters']:
        m = re.search('house:(\d+);unit:(\d+);group:\d+;method:turn(.+);', data)

        if m:
            house, unit, status = int(m.group(1)), int(m.group(2)), m.group(3)
            print(house, unit, status)

            if house == transmitter['house'] and unit == transmitter['unit']:
                print('MATCH!!!!')
                requests.post(config['homie_base_url'] + 'remote/' + status)

try:
    import asyncio
    loop = asyncio.get_event_loop()
    dispatcher = td.AsyncioCallbackDispatcher(loop)
except ImportError:
    loop = None
    dispatcher = td.QueuedCallbackDispatcher()

core = td.TelldusCore(callback_dispatcher=dispatcher)
callbacks = [core.register_raw_device_event(raw_event)]

try:
    if loop:
        loop.run_forever()
    else:
        import time
        while True:
            core.callback_dispatcher.process_pending_callbacks()
            time.sleep(0.5)
except KeyboardInterrupt:
    pass