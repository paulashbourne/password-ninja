from base_handler import BaseHandler
import tornado.web

class HomePageHandler(BaseHandler):

    def get(self):
        self.render("templates/page/home.html")

class ErrorPageHandler(BaseHandler):

    def get(self):
        self.set_status(404)
        self.render("templates/page/404.html")

    def post(self):
        self.set_status(404)

class JSTemplateHandler(tornado.web.RequestHandler):

    def get(self, tpl):
        with open("templates/js/%s" % tpl) as f:
            return self.write(f.read())
        event_json = ujson.loads()

