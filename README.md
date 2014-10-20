# sprites-preprocessor [![Build Status](https://secure.travis-ci.org/madebysource/sprites-preprocessor.png?branch=master)](https://travis-ci.org/madebysource/sprites-preprocessor)

> create sprite images from css files

## Install

```bash
$ npm install --save-dev sprites-preprocessor
```

## Usage

```js
var sprites = require('sprites-preprocessor');

var options = {
  name: 'sprite.png',
  path: 'images/sprites',
  prefix: '/images/sprites/',


  // advanced, pass in custom url regex but make sure to pass in an empty prefix if you're including your prefix rule in this regex
  urlRegex: null // used to override the url Regex built using the prefix

  /* for example: if you want to skip all base64 encoded urls and all the gif images, use something like this

	prefix: "",
	// probably not the most optimized regex, but it works
  	urlRegex: new RegExp("url\\((?:'|\")?((?!(data:[^'\"\\)]+))(?!([^'\"\\)]+gif))([^'\"\\)]+))(?:'|\")?\\)(?:(.*?|\n*?|\r*?))(;|})", "gi")

    // also make sure your URL match indexes matches your RegExp matches order
    // for example they are different for this custom RegExp

	urlRegexPathMatchIndex: 1, // 1, the default urlRegex's is 1
  	urlRegexRestMatchIndex: 5, // 2, the default urlRegex's is 2
  	urlRegexDelimiterMatchIndex: 6 // 3, the default urlRegex's is 2

  */
};

sprites(options, 'body { background: url(/images/sprite/file.png); }', function(err, css, image) {
  // code
});
```

### Gulp usage

For gulp tasks there is gulp plugin [gulp-sprite-preprocessor](https://github.com/madebysource/gulp-sprites-preprocessor)

## API

### sprites(options)

#### Options

##### name

Type: `String`
Default: `sprite.png`

Name of the output sprite file.

##### path

Type: `String`
Default: `images/sprites`

Path to the source image files

##### prefix

Type: `String`
Default: `/images/sprites/`

Css prefix in image url to know what images transform into sprites

## License

[MIT license](http://opensource.org/licenses/mit-license.php)
