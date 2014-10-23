import tornado.web
import python

class HomePageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("templates/home.html")

class ErrorPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Error")

class FacebookAPIHookHandler(tornado.web.RequestHandler):

