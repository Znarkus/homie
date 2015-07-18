from tellcore.telldus import TelldusCore

core = TelldusCore()
lamp = core.add_device("lamp", "arctech", "selflearning-switch", house=12345, unit=1)
lamp.turn_on()

for device in core.devices():
    device.turn_off()