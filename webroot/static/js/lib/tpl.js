/**
 * ContextLogic RequireJS template plugin
 *
 * Adapted from the RequireJS underscore plugin at
 * https://github.com/ZeeAgency/requirejs-tpl
 */
/*jslint regexp: false, nomen: false, plusplus: false, strict: false */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false */

(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],

    tplSplitRegExp = /^\/\/ ([A-Z0-9_]+) \\\\/mi,

    buildMap = {},

    templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    },

    escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\t':     't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'},

    escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    template = function(text) {
      // Combine delimiters into one regular expression via alternation.
      var matcher = new RegExp([
        (templateSettings.escape || noMatch).source,
        (templateSettings.interpolate || noMatch).source,
        (templateSettings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');

      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      text = text.replace(/[ \n\t\r]+/g, " ");
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset)
          .replace(escaper, function(match) { return '\\' + escapes[match]; });
        source +=
          escape ? "'+((__t=(" + escape + "))==null?'':_.escape(__t))+'" :
          interpolate ? "'+((__t=(" + interpolate + "))==null?'':__t)+'" :
          evaluate ? "';" + evaluate + " __p+='" : '';
        index = offset + match.length;
      });
      source += "';";
      source = source.replace(/[ \t]+/g, " ");

      source = 'with(obj||{}){' + source + '}';
      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};" +
        source + "return __p;";

      return source;
    };

  define(function () {
    var tpl;

    var get, fs;
    if (typeof window !== "undefined" && window.navigator && window.document) {
      get = function (url, callback) {

        var xhr = tpl.createXhr();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function (evt) {
          //Do not explicitly handle errors, those should be
          //visible via console output in the browser.
          if (xhr.readyState === 4) {
            callback(xhr.responseText);
          }
        };
        xhr.send(null);
      };
    } else if (typeof process !== "undefined" &&
         process.versions &&
         !!process.versions.node) {
      //Using special require.nodeRequire, something added by r.js.
      fs = require.nodeRequire('fs');

      get = function (url, callback) {

        callback(fs.readFileSync(url, 'utf8'));
      };
    }
    return tpl = {
      version: '0.24.0',
      jsEscape: function (content) {
        return content.replace(/(['\\])/g, '\\$1')
          .replace(/[\f]/g, "\\f")
          .replace(/[\b]/g, "\\b")
          .replace(/[\n]/g, " ")
          .replace(/[\t]/g, " ")
          .replace(/[\r]/g, " ");
      },

      createXhr: function () {
        //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
        var xhr, i, progId;
        if (typeof XMLHttpRequest !== "undefined") {
          return new XMLHttpRequest();
        } else {
          for (i = 0; i < 3; i++) {
            progId = progIds[i];
            try {
              xhr = new ActiveXObject(progId);
            } catch (e) {}

            if (xhr) {
              progIds = [progId];  // so faster next time
              break;
            }
          }
        }

        if (!xhr) {
          throw new Error("require.getXhr(): XMLHttpRequest not available");
        }

        return xhr;
      },

      get: get,

      load: function (name, req, onLoad, config) {
        var filePrefix = "../../templates/js/";
        if(config.locale){
          filePrefix = '../../templates/build-js-' + config.locale + "/";
        }
        var fileName = filePrefix + name;

        //Load the tpl.
        var url = 'nameToUrl' in req ?
          req.nameToUrl(fileName, ".html") : req.toUrl(fileName + ".html");

        var tplBegin  = url.indexOf(filePrefix);
        url = config.baseUrl + filePrefix + name + ".html"

        if (buildMap.hasOwnProperty(name)) {
          return onLoad(buildMap[name]);
        }

        tpl.get(url, function (content) {
          // split the tpl file into its templates... should get results in the
          // form ['', tpl1_name, tpl1_contents, tpl2_name, tpl2_contents]
          subtemplates = content.split(tplSplitRegExp);

          // in the likely case that the first element is an empty string,
          // slice it out
          if (subtemplates[0] == '') {
            subtemplates = subtemplates.slice(1)
          }

          content_obj = {}

          for (var i = 0; i < subtemplates.length; i += 2) {
            content_obj[subtemplates[i]] = template(subtemplates[i+1]);
          }

          if (config.isBuild) {
            pieces = [];
            for (tpl_name in content_obj) {
              if (content_obj.hasOwnProperty(tpl_name)) {
                pieces.push('"'+tpl_name+'"'+':function(obj){'+content_obj[tpl_name]+'}');
              }
            }

            ret_content = 'return {' + pieces.join(',')+'};';
          } else {
            ret_content = {}

            for (tpl_name in content_obj) {
              if (content_obj.hasOwnProperty(tpl_name)) {
                try {
                  ret_content[tpl_name] = new Function('obj', content_obj[tpl_name]);
                } catch (e) {
                  console.log("Exception compiling " + tpl_name);
                  console.debug("Template output (beautify & syntax check...):");
                  console.debug(content_obj[tpl_name]);
                  throw e;
                }
              }
            }
          }

          buildMap[name] = ret_content;
          onLoad(ret_content);
        });
      },

      write: function (pluginName, moduleName, write) {
        if (moduleName in buildMap) {
          var content = tpl.jsEscape(buildMap[moduleName]);
          write("define('" + pluginName + "!" + moduleName  +
              "', function() {" +
                content.replace(/(\\')/g, "'").replace(/(\\\\)/g, "\\")+
              "});\n");
        }
      }
    };
    return function() {};
  });
}());
