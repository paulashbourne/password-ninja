import tornado.ioloop
import tornado.web
from tornado.options import options, define, parse_command_line
import tornado.autoreload
import os
import sys
import signal
from core.uri_mapping import URI_MAPPING
from core import constants
from bunch import Bunch

def set_exit_handler(func):
    signal.signal(signal.SIGTERM, func)
def on_exit(sig, func=None):
    print "Exit handler triggered"
    sys.exit(1)

settings = {
    'cookie_secret' : '65eb32b902404316aafceba172970c5b'
}


def prepare_environment():

    define("debug", type=bool, default=True, help="Debug True/False")
    define("port", type=int, default=8000, help="The port to run from")
    parse_command_line()
    settings['debug'] = options.debug

if __name__ == "__main__":
    print "Server starting..."
    set_exit_handler(on_exit)
    prepare_environment()
    app = tornado.web.Application(URI_MAPPING, **settings)
    app.debug = options.debug
    app.listen(options.port)
    ioloop = tornado.ioloop.IOLoop.instance()
    print "Server is running on port %d" % options.port
    ioloop.start()
    if options.debug:
        tornado.autoreload.start(ioloop)
