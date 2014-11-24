// Generated by CoffeeScript 1.7.1
var shiori;

self.importScripts("node_modules/encoding-japanese/encoding.js");

self.importScripts("node_modules/shiorijk/lib/shiorijk.js");

self.importScripts("vender/coffee-script.js");

self.importScripts("node_modules/parttime/parttime.js");

self.importScripts("node_modules/partperiod/partperiod.js");

self.importScripts("node_modules/miyojs-filter-conditions/conditions.js");

self.importScripts("node_modules/miyojs-filter-default_response_headers/default_response_headers.js");

self.importScripts("node_modules/miyojs-filter-join/join.js");

self.importScripts("node_modules/miyojs-filter-no_value/no_value.js");

self.importScripts("node_modules/miyojs-filter-property/property.js");

self.importScripts("node_modules/miyojs-filter-value/value.js");

self.importScripts("node_modules/miyojs-filter-value_filters/value_filters.js");

self.importScripts("node_modules/miyojs-filter-variables/variables.js");

self.importScripts("node_modules/miyojs-filter-autotalks/autotalks.js");

self.importScripts("node_modules/miyojs-filter-talking/talking.js");

self.importScripts("node_modules/miyojs-filter-stash/stash.js");

self.importScripts("node_modules/miyojs-filter-entry_template/entry_template.js");

self.importScripts("node_modules/miyojs-filter-stash_template/stash_template.js");

self.importScripts("node_modules/miyojs-filter-child_process/child_process.js");

self.importScripts("node_modules/miyojs/node_modules/js-yaml/dist/js-yaml.min.js");

self.importScripts("node_modules/miyojs/lib/miyo.js");

shiori = null;

self.onmessage = function(_arg) {
  var data, dictionary, directory, event, paser, request, requestTxt, _ref;
  _ref = _arg.data, event = _ref.event, data = _ref.data;
  switch (event) {
    case "load":
      directory = data;
      dictionary = Object.keys(directory).filter(function(filepath) {
        return /^dictionaries\/[^/]+$/.test(filepath);
      }).reduce((function(dictionary, filepath) {
        var dic, tabIndentedYaml, uint8Arr, yaml;
        uint8Arr = new Uint8Array(directory[filepath]);
        tabIndentedYaml = Encoding.codeToString(Encoding.convert(uint8Arr, 'UNICODE', 'AUTO'));
        yaml = tabIndentedYaml.replace(/\t/g, ' ');
        dic = jsyaml.safeLoad(yaml);
        Miyo.DictionaryLoader.merge_dictionary(dic, dictionary);
        return dictionary;
      }), {});
      shiori = new Miyo(dictionary);
      console.log(Object.keys(dictionary).join(' '));
      return shiori.load('').then(function() {
        return self.postMessage({
          "event": "loaded",
          "error": null
        });
      })["catch"](function(error) {
        return console.warn(error);
      });
    case "request":
      requestTxt = data;
      paser = new ShioriJK.Shiori.Request.Parser();
      request = paser.parse(requestTxt);
      console.log(request);
      return shiori.request(request).then(function(response) {
        return self.postMessage({
          event: "response",
          error: null,
          data: '' + response
        });
      })["catch"](function(error) {
        return console.warn(error);
      });
    case "unload":
      return shiori.unload().then(function() {
        return self.postMessage({
          event: "unloaded",
          error: null
        });
      })["catch"](function(error) {
        return console.warn(error);
      });
    default:
      throw new Error(event + " event not support");
  }
};
