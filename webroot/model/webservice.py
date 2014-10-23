from mongoengine import EmbeddedDocument, fields as f
from pa.utils.basedocument import BaseDocument

class WebService(BaseDocument):
    meta = {
        'indexes' : ['name', 'hostname'],
        'db_name' : "webService"
    }

    name                = f.StringField(db_field="a", max_length=500)
    hostname            = f.StringField(db_field="b", max_length=500)
    loginURL            = f.StringField(db_field="c")
    loginSteps          = f.ListField(f.EmbeddedDocumentField("UIInstruction"),
        db_field="e")
    changePasswordURL   = f.StringField(db_field="d")
    changePasswordSteps = f.ListField(f.EmbeddedDocumentField("UIInstruction"),
        db_field="e")

class HTMLElement(EmbeddedDocument):

    TYPES = {
        'INPUT'          : 1,
        'BUTTON'         : 2
    }

    element_type  = f.IntField(db_field="a", choices=TYPES.values())
    selector      = f.StringField(db_field="b") # jQuery Selector for this element

class UIInstruction(EmbeddedDocument):

    ACTIONS = {
        'CLICK'          : 1, # click on the element
        'USERNAME'       : 2, # enter username
        'PASSWORD'       : 3, # enter old password
        'NEW_PASSWORD'   : 4  # enter new password
    }

    element = f.EmbeddedDocumentField("HTMLELEMENT", db_field="a")
    action  = f.IntField(db_field="b", choices=ACTIONS.values())
