var spritesmith = require('spritesmith');
var path = require('path');

var _ = require('lodash');

var uniq = _.uniq;
var extend = _.extend;
var isInteger = function(n) {
  return  !isNaN(parseFloat(n)) && isFinite(n) && n % 1 === 0;
};

var escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

var createCSSPropertiesFor = function(coords) {
  return 'background-position: ' + -coords.x + 'px ' + -coords.y + 'px';
};

var normalizeRest = function(rest) {
  rest = rest.replace(/(\s+|\n|\r)/, '');
  return rest ? ' ' + rest : rest;
};

var normalizeDelimiter = function(delimiter) {
  return delimiter === '}' ? ';\n}' : ';';
};

var extractPaths = function(urlRegex, content) {
  var paths = [];
  var match;

  while (match = urlRegex.exec(content)) {
    paths.push(match[globalOptions.urlRegexPathMatchIndex]);
  }

  return paths;
};

var removeBasePath = function(prefixRegex, currentPath) {
  return currentPath.replace(prefixRegex, '');
};

var findPaths = function(prefixRegex, urlRegex, content) {
  return extractPaths(urlRegex, content).map(function(item) {
    return removeBasePath(prefixRegex, item);
  });
};

var createFullPath = function(basePath, currentPath) {
  return path.join(basePath, currentPath);
};

var replaceUrlsWithSprite = function(urlRegex, prefixRegex, options, content, coords) {
  return content.replace(urlRegex, function(match/*, path, rest, delimiter */) {

    var path = arguments[globalOptions.urlRegexPathMatchIndex];
    var rest = arguments[globalOptions.urlRegexRestMatchIndex];

    var coord = coords[createFullPath(options.path, removeBasePath(prefixRegex, path))];
    var css = createCSSPropertiesFor(coord);

    rest = normalizeRest(rest);
    var delimiter = normalizeDelimiter(arguments[isInteger(globalOptions.urlRegexDelimiterMatchIndex) ? globalOptions.urlRegexDelimiterMatchIndex : arguments.length - 1]);

    return 'url(' + options.name + ')' + rest + '; ' + css + delimiter;
  });
};

var defaultOptions = {
  name: 'sprite.png',
  path: 'images/sprites',
  prefix: '/images/sprites/',
  urlRegex: null,

  urlRegexPathMatchIndex: 1,
  urlRegexRestMatchIndex: 2,
  urlRegexDelimiterMatchIndex: 3
};
var globalOptions;

var getFullPaths = function(prefixRegex, urlRegex, basePath, cssContent) {
  var paths = uniq(findPaths(prefixRegex, urlRegex, cssContent));

  return paths.map(function(item) {
    return createFullPath(basePath, item);
  });
};

var sprite = function(options, cssContent, callback) {
  options = extend({}, defaultOptions, options);
  globalOptions = options;

  var prefixRegex = new RegExp(escapeRegExp(options.prefix));
  var urlRegex = options.urlRegex || new RegExp("url\\((?:'|\")?(" + escapeRegExp(options.prefix) + ".*?)(?:'|\")?\\)(?:(.*?|\\n*?|\\r*?))(;|})", 'gi');

  var fullPaths = getFullPaths(prefixRegex, urlRegex, options.path, cssContent);

  spritesmith({ src: fullPaths }, function(err, result) {
    if (err) { return callback(err); }

    var finalCSS = replaceUrlsWithSprite(urlRegex, prefixRegex, options, cssContent, result.coordinates);
    var image = result.image;

    callback(null, finalCSS, image);
  });
};

module.exports = sprite;
