from tornado.web import URLSpec, StaticFileHandler
import handlers as h

URI_MAPPING = [
    URLSpec(r'/', h.HomePageHandler),
    URLSpec(r'/static/(.*)', StaticFileHandler, {'path': 'static/'}),
    URLSpec(r'.*', h.ErrorPageHandler),
]
