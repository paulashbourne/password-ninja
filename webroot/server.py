import tornado.ioloop
import tornado.web
import tornado.options
from core.uri_mapping import URI_MAPPING
import mongoengine

passwordninja = tornado.web.Application(URI_MAPPING)

if __name__ == "__main__":
    mongoengine.connect('password_ninja')
    tornado.options.options['log_file_prefix'].set('password-ninja.server.log')
    tornado.options.parse_command_line()
    passwordninja.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
