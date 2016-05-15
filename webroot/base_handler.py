import tornado.web
import ujson

class BaseHandler(tornado.web.RequestHandler):
    COOKIE_LIFETIME = 7 # Days

    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)

    def on_finish(self):
        pass

    def validate_request(self):
        return True

    def redirect_login(self):
        self.redirect('/login')

    def not_authorized(self):
        self.set_status(403)
        # TODO: Show 403

    def base_url(self, path='/'):
        if path[0] != "/":
            path = "/" + path
        return path

    def static_url(self, path='/'):
        if path[0] != "/":
            path = "/" + path
        return self.base_url('static' + path)

    def js_url(self, path='/'):
        if path[0] != "/":
            path = "/" + path
        return self.static_url('js' + path)

    def css_url(self, path='/'):
        if path[0] != "/":
            path = "/" + path
        return self.static_url('css' + path)

    def img_url(self, path='/'):
        if path[0] != "/":
            path = "/" + path
        return self.static_url('img' + path)

    def get(self):
        pass

    def render(self, template, **kwargs):
        page_params = kwargs.get('page_params', {})
        kwargs['pageParams'] = ujson.dumps(page_params)
        kwargs['base_url']   = self.base_url
        kwargs['static_url'] = self.static_url
        kwargs['js_url']     = self.js_url
        kwargs['css_url']    = self.css_url
        kwargs['img_url']    = self.img_url

        super(BaseHandler, self).render(template, **kwargs)

class ApiException(Exception):
    pass

class BaseApiHandler(BaseHandler):
    
    def __init__(self, *args, **kwargs):
        super(BaseApiHandler, self).__init__(*args, **kwargs)
        self._params = None
        self.requestClosed = False

    def callback(self, data, success=True, message=None):
        if success:
            self.set_status(200)
        else:
            self.set_status(400)
        response = {
            'data'    : data,
            'success' : success,
            'message' : message
        }
        self.write(ujson.dumps(response))
        self.finish()
        self.requestClosed = True

    def post(self):
        self._params = ujson.loads(self.request.body)
        try:
            self.run()
        except ApiException as e:
            self.callback({}, success = False, message = e.message)
            return
        if not self.requestClosed:
            self.callback({})

    @property
    def param_dict(self):
        return self._params

    def get_param(self, name, default=None, required=False):
        if name in self.param_dict:
            return self.param_dict[name]
        elif required:
            raise ApiException("Required field %s missing" % name)
        else:
            return default

    def run(self):
        pass
