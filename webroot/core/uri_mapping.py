from tornado.web import URLSpec, StaticFileHandler
import handlers as h

URI_MAPPING = [
    # Page handlers
    URLSpec(r'/', h.HomePageHandler),

    # Misc.
    URLSpec(r'/static/(.*)', StaticFileHandler, {'path': 'static/'}),
    URLSpec(r'/templates/js/(.*)', h.JSTemplateHandler),
    URLSpec(r'.*', h.ErrorPageHandler),
]
