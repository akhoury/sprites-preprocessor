var assert = require('assert');
var sprite = require('../');

describe('sprites', function() {
  it('returns same css file if there is no url', function(done) {
    sprite({}, 'body { color: red; }', function(err, css) {
      assert.equal(css, 'body { color: red; }');
      done();
    });
  });

  it('rewrites sprite path', function(done) {
    var css = 'body { background: url(/images/sprites/a.png); }';

    sprite({ path: 'test/fixtures/' }, css, function(err, css) {
      assert.equal(css, 'body { background: url(sprite.png); background-position: 0px 0px; }');

      done();
    });
  });


  it('skips sprite base64 encoded data:image path', function(done) {
    var css = 'body { background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ExYTFhMSIgc3RvcC1vcGFjaXR5PSIwLjY1Ii8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNhMWExYTEiIHN0b3Atb3BhY2l0eT0iMCIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+); }';

    sprite({
      path: 'test/fixtures/',

      prefix: "",
      urlRegex: new RegExp("url\\((?:'|\")?((?!(data:[^'\"\\)]+))(?!([^'\"\\)]+gif))([^'\"\\)]+))(?:'|\")?\\)(?:(.*?|\n*?|\r*?))(;|})", "gi"),
      urlRegexPathMatchIndex: 1,
      urlRegexRestMatchIndex: 5,
      urlRegexDelimiterMatchIndex: 6
    }, css, function(err, css) {
      assert.equal(css, 'body { background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ExYTFhMSIgc3RvcC1vcGFjaXR5PSIwLjY1Ii8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNhMWExYTEiIHN0b3Atb3BhY2l0eT0iMCIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+); }');

      done();
    });
  });

  it('skips sprite end of .gif extension', function(done) {
    var css = 'body { background: url(/images/sprites/a.gif); }';

    sprite({
      path: 'test/fixtures/',

      prefix: "",
      urlRegex: new RegExp("url\\((?:'|\")?((?!(data:[^'\"\\)]+))(?!([^'\"\\)]+gif))([^'\"\\)]+))(?:'|\")?\\)(?:(.*?|\n*?|\r*?))(;|})", "gi"),
      urlRegexPathMatchIndex: 1,
      urlRegexRestMatchIndex: 5,
      urlRegexDelimiterMatchIndex: 6
    }, css, function(err, css) {
      assert.equal(css, 'body { background: url(/images/sprites/a.gif); }');

      done();
    });
  });


  it('rewrites url path with any quotes', function(done) {
    var css = 'body { background: url(\'/images/sprites/a.png\'); background: url("/images/sprites/b.png"); }';

    sprite({ path: 'test/fixtures/' }, css, function(err, css) {
      assert.equal(css,
        'body { background: url(sprite.png); background-position: 0px 0px; background: url(sprite.png); background-position: 0px -10px; }');

      done();
    });
  });

  it('leaves normal image paths untouched', function(done) {
    var css = 'body { background: url(image.png); }';

    sprite({ path: 'test/fixtures/' }, css, function(err, css) {
      assert.equal(css, 'body { background: url(image.png); }');

      done();
    });
  });

  it('generates correct background position', function(done) {
    var css = 'body { background2: url(/images/sprites/a.png); background: url(/images/sprites/b.png); }';

    sprite({ path: 'test/fixtures/' }, css, function(err, css) {
      assert.equal(css, 'body { background2: url(sprite.png); background-position: 0px 0px; background: url(sprite.png); background-position: 0px -10px; }');
      done();
    });
  });

  it('reutrns error if there is non existing file', function(done) {
    var css = 'body { background: url(/images/sprites/non-existing-file.png); }';

    sprite({ path: 'test/fixtures/' }, css, function(err) {
      assert(err);
      done();
    });
  });

  it('takes css prefix path in options', function(done) {
    var css = 'body { background: url(prefix/a.png); }';

    sprite({ path: 'test/fixtures/', prefix: 'prefix/' }, css, function(err, css) {
      assert.equal(css, 'body { background: url(sprite.png); background-position: 0px 0px; }');

      done();
    });
  });

  it('uses same background position for same image use', function(done) {
    var css = 'body { background: url(/images/sprites/a.png); background: url(/images/sprites/a.png); }';

    sprite({ path: 'test/fixtures/' }, css, function(err, css) {
      assert.equal(css,
        'body { background: url(sprite.png); background-position: 0px 0px; background: url(sprite.png); background-position: 0px 0px; }');

      done();
    });
  });

});
