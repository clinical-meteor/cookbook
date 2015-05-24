(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTML = Package.htmljs.HTML;
var HTMLTools = Package['html-tools'].HTMLTools;
var BlazeTools = Package['blaze-tools'].BlazeTools;
var _ = Package.underscore._;

/* Package-scope variables */
var SpacebarsCompiler, TemplateTag;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/spacebars-compiler/templatetag.js                                             //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
SpacebarsCompiler = {};                                                                   // 1
                                                                                          // 2
// A TemplateTag is the result of parsing a single `{{...}}` tag.                         // 3
//                                                                                        // 4
// The `.type` of a TemplateTag is one of:                                                // 5
//                                                                                        // 6
// - `"DOUBLE"` - `{{foo}}`                                                               // 7
// - `"TRIPLE"` - `{{{foo}}}`                                                             // 8
// - `"COMMENT"` - `{{! foo}}`                                                            // 9
// - `"BLOCKCOMMENT" - `{{!-- foo--}}`                                                    // 10
// - `"INCLUSION"` - `{{> foo}}`                                                          // 11
// - `"BLOCKOPEN"` - `{{#foo}}`                                                           // 12
// - `"BLOCKCLOSE"` - `{{/foo}}`                                                          // 13
// - `"ELSE"` - `{{else}}`                                                                // 14
// - `"ESCAPE"` - `{{|`, `{{{|`, `{{{{|` and so on                                        // 15
//                                                                                        // 16
// Besides `type`, the mandatory properties of a TemplateTag are:                         // 17
//                                                                                        // 18
// - `path` - An array of one or more strings.  The path of `{{foo.bar}}`                 // 19
//   is `["foo", "bar"]`.  Applies to DOUBLE, TRIPLE, INCLUSION, BLOCKOPEN,               // 20
//   and BLOCKCLOSE.                                                                      // 21
//                                                                                        // 22
// - `args` - An array of zero or more argument specs.  An argument spec                  // 23
//   is a two or three element array, consisting of a type, value, and                    // 24
//   optional keyword name.  For example, the `args` of `{{foo "bar" x=3}}`               // 25
//   are `[["STRING", "bar"], ["NUMBER", 3, "x"]]`.  Applies to DOUBLE,                   // 26
//   TRIPLE, INCLUSION, and BLOCKOPEN.                                                    // 27
//                                                                                        // 28
// - `value` - A string of the comment's text. Applies to COMMENT and                     // 29
//   BLOCKCOMMENT.                                                                        // 30
//                                                                                        // 31
// These additional are typically set during parsing:                                     // 32
//                                                                                        // 33
// - `position` - The HTMLTools.TEMPLATE_TAG_POSITION specifying at what sort             // 34
//   of site the TemplateTag was encountered (e.g. at element level or as                 // 35
//   part of an attribute value). Its absence implies                                     // 36
//   TEMPLATE_TAG_POSITION.ELEMENT.                                                       // 37
//                                                                                        // 38
// - `content` and `elseContent` - When a BLOCKOPEN tag's contents are                    // 39
//   parsed, they are put here.  `elseContent` will only be present if                    // 40
//   an `{{else}}` was found.                                                             // 41
                                                                                          // 42
var TEMPLATE_TAG_POSITION = HTMLTools.TEMPLATE_TAG_POSITION;                              // 43
                                                                                          // 44
TemplateTag = SpacebarsCompiler.TemplateTag = function () {                               // 45
  HTMLTools.TemplateTag.apply(this, arguments);                                           // 46
};                                                                                        // 47
TemplateTag.prototype = new HTMLTools.TemplateTag;                                        // 48
TemplateTag.prototype.constructorName = 'SpacebarsCompiler.TemplateTag';                  // 49
                                                                                          // 50
var makeStacheTagStartRegex = function (r) {                                              // 51
  return new RegExp(r.source + /(?![{>!#/])/.source,                                      // 52
                    r.ignoreCase ? 'i' : '');                                             // 53
};                                                                                        // 54
                                                                                          // 55
// "starts" regexes are used to see what type of template                                 // 56
// tag the parser is looking at.  They must match a non-empty                             // 57
// result, but not the interesting part of the tag.                                       // 58
var starts = {                                                                            // 59
  ESCAPE: /^\{\{(?=\{*\|)/,                                                               // 60
  ELSE: makeStacheTagStartRegex(/^\{\{\s*else(?=[\s}])/i),                                // 61
  DOUBLE: makeStacheTagStartRegex(/^\{\{\s*(?!\s)/),                                      // 62
  TRIPLE: makeStacheTagStartRegex(/^\{\{\{\s*(?!\s)/),                                    // 63
  BLOCKCOMMENT: makeStacheTagStartRegex(/^\{\{\s*!--/),                                   // 64
  COMMENT: makeStacheTagStartRegex(/^\{\{\s*!/),                                          // 65
  INCLUSION: makeStacheTagStartRegex(/^\{\{\s*>\s*(?!\s)/),                               // 66
  BLOCKOPEN: makeStacheTagStartRegex(/^\{\{\s*#\s*(?!\s)/),                               // 67
  BLOCKCLOSE: makeStacheTagStartRegex(/^\{\{\s*\/\s*(?!\s)/)                              // 68
};                                                                                        // 69
                                                                                          // 70
var ends = {                                                                              // 71
  DOUBLE: /^\s*\}\}/,                                                                     // 72
  TRIPLE: /^\s*\}\}\}/                                                                    // 73
};                                                                                        // 74
                                                                                          // 75
// Parse a tag from the provided scanner or string.  If the input                         // 76
// doesn't start with `{{`, returns null.  Otherwise, either succeeds                     // 77
// and returns a SpacebarsCompiler.TemplateTag, or throws an error (using                 // 78
// `scanner.fatal` if a scanner is provided).                                             // 79
TemplateTag.parse = function (scannerOrString) {                                          // 80
  var scanner = scannerOrString;                                                          // 81
  if (typeof scanner === 'string')                                                        // 82
    scanner = new HTMLTools.Scanner(scannerOrString);                                     // 83
                                                                                          // 84
  if (! (scanner.peek() === '{' &&                                                        // 85
         (scanner.rest()).slice(0, 2) === '{{'))                                          // 86
    return null;                                                                          // 87
                                                                                          // 88
  var run = function (regex) {                                                            // 89
    // regex is assumed to start with `^`                                                 // 90
    var result = regex.exec(scanner.rest());                                              // 91
    if (! result)                                                                         // 92
      return null;                                                                        // 93
    var ret = result[0];                                                                  // 94
    scanner.pos += ret.length;                                                            // 95
    return ret;                                                                           // 96
  };                                                                                      // 97
                                                                                          // 98
  var advance = function (amount) {                                                       // 99
    scanner.pos += amount;                                                                // 100
  };                                                                                      // 101
                                                                                          // 102
  var scanIdentifier = function (isFirstInPath) {                                         // 103
    var id = BlazeTools.parseIdentifierName(scanner);                                     // 104
    if (! id)                                                                             // 105
      expected('IDENTIFIER');                                                             // 106
    if (isFirstInPath &&                                                                  // 107
        (id === 'null' || id === 'true' || id === 'false'))                               // 108
      scanner.fatal("Can't use null, true, or false, as an identifier at start of path"); // 109
                                                                                          // 110
    return id;                                                                            // 111
  };                                                                                      // 112
                                                                                          // 113
  var scanPath = function () {                                                            // 114
    var segments = [];                                                                    // 115
                                                                                          // 116
    // handle initial `.`, `..`, `./`, `../`, `../..`, `../../`, etc                      // 117
    var dots;                                                                             // 118
    if ((dots = run(/^[\.\/]+/))) {                                                       // 119
      var ancestorStr = '.'; // eg `../../..` maps to `....`                              // 120
      var endsWithSlash = /\/$/.test(dots);                                               // 121
                                                                                          // 122
      if (endsWithSlash)                                                                  // 123
        dots = dots.slice(0, -1);                                                         // 124
                                                                                          // 125
      _.each(dots.split('/'), function(dotClause, index) {                                // 126
        if (index === 0) {                                                                // 127
          if (dotClause !== '.' && dotClause !== '..')                                    // 128
            expected("`.`, `..`, `./` or `../`");                                         // 129
        } else {                                                                          // 130
          if (dotClause !== '..')                                                         // 131
            expected("`..` or `../`");                                                    // 132
        }                                                                                 // 133
                                                                                          // 134
        if (dotClause === '..')                                                           // 135
          ancestorStr += '.';                                                             // 136
      });                                                                                 // 137
                                                                                          // 138
      segments.push(ancestorStr);                                                         // 139
                                                                                          // 140
      if (!endsWithSlash)                                                                 // 141
        return segments;                                                                  // 142
    }                                                                                     // 143
                                                                                          // 144
    while (true) {                                                                        // 145
      // scan a path segment                                                              // 146
                                                                                          // 147
      if (run(/^\[/)) {                                                                   // 148
        var seg = run(/^[\s\S]*?\]/);                                                     // 149
        if (! seg)                                                                        // 150
          error("Unterminated path segment");                                             // 151
        seg = seg.slice(0, -1);                                                           // 152
        if (! seg && ! segments.length)                                                   // 153
          error("Path can't start with empty string");                                    // 154
        segments.push(seg);                                                               // 155
      } else {                                                                            // 156
        var id = scanIdentifier(! segments.length);                                       // 157
        if (id === 'this') {                                                              // 158
          if (! segments.length) {                                                        // 159
            // initial `this`                                                             // 160
            segments.push('.');                                                           // 161
          } else {                                                                        // 162
            error("Can only use `this` at the beginning of a path.\nInstead of `foo.this` or `../this`, just write `foo` or `..`.");
          }                                                                               // 164
        } else {                                                                          // 165
          segments.push(id);                                                              // 166
        }                                                                                 // 167
      }                                                                                   // 168
                                                                                          // 169
      var sep = run(/^[\.\/]/);                                                           // 170
      if (! sep)                                                                          // 171
        break;                                                                            // 172
    }                                                                                     // 173
                                                                                          // 174
    return segments;                                                                      // 175
  };                                                                                      // 176
                                                                                          // 177
  // scan the keyword portion of a keyword argument                                       // 178
  // (the "foo" portion in "foo=bar").                                                    // 179
  // Result is either the keyword matched, or null                                        // 180
  // if we're not at a keyword argument position.                                         // 181
  var scanArgKeyword = function () {                                                      // 182
    var match = /^([^\{\}\(\)\>#=\s"'\[\]]+)\s*=\s*/.exec(scanner.rest());                // 183
    if (match) {                                                                          // 184
      scanner.pos += match[0].length;                                                     // 185
      return match[1];                                                                    // 186
    } else {                                                                              // 187
      return null;                                                                        // 188
    }                                                                                     // 189
  };                                                                                      // 190
                                                                                          // 191
  // scan an argument; succeeds or errors.                                                // 192
  // Result is an array of two or three items:                                            // 193
  // type , value, and (indicating a keyword argument)                                    // 194
  // keyword name.                                                                        // 195
  var scanArg = function () {                                                             // 196
    var keyword = scanArgKeyword(); // null if not parsing a kwarg                        // 197
    var value = scanArgValue();                                                           // 198
    return keyword ? value.concat(keyword) : value;                                       // 199
  };                                                                                      // 200
                                                                                          // 201
  // scan an argument value (for keyword or positional arguments);                        // 202
  // succeeds or errors.  Result is an array of type, value.                              // 203
  var scanArgValue = function () {                                                        // 204
    var startPos = scanner.pos;                                                           // 205
    var result;                                                                           // 206
    if ((result = BlazeTools.parseNumber(scanner))) {                                     // 207
      return ['NUMBER', result.value];                                                    // 208
    } else if ((result = BlazeTools.parseStringLiteral(scanner))) {                       // 209
      return ['STRING', result.value];                                                    // 210
    } else if (/^[\.\[]/.test(scanner.peek())) {                                          // 211
      return ['PATH', scanPath()];                                                        // 212
    } else if ((result = BlazeTools.parseIdentifierName(scanner))) {                      // 213
      var id = result;                                                                    // 214
      if (id === 'null') {                                                                // 215
        return ['NULL', null];                                                            // 216
      } else if (id === 'true' || id === 'false') {                                       // 217
        return ['BOOLEAN', id === 'true'];                                                // 218
      } else {                                                                            // 219
        scanner.pos = startPos; // unconsume `id`                                         // 220
        return ['PATH', scanPath()];                                                      // 221
      }                                                                                   // 222
    } else {                                                                              // 223
      expected('identifier, number, string, boolean, or null');                           // 224
    }                                                                                     // 225
  };                                                                                      // 226
                                                                                          // 227
  var type;                                                                               // 228
                                                                                          // 229
  var error = function (msg) {                                                            // 230
    scanner.fatal(msg);                                                                   // 231
  };                                                                                      // 232
                                                                                          // 233
  var expected = function (what) {                                                        // 234
    error('Expected ' + what);                                                            // 235
  };                                                                                      // 236
                                                                                          // 237
  // must do ESCAPE first, immediately followed by ELSE                                   // 238
  // order of others doesn't matter                                                       // 239
  if (run(starts.ESCAPE)) type = 'ESCAPE';                                                // 240
  else if (run(starts.ELSE)) type = 'ELSE';                                               // 241
  else if (run(starts.DOUBLE)) type = 'DOUBLE';                                           // 242
  else if (run(starts.TRIPLE)) type = 'TRIPLE';                                           // 243
  else if (run(starts.BLOCKCOMMENT)) type = 'BLOCKCOMMENT';                               // 244
  else if (run(starts.COMMENT)) type = 'COMMENT';                                         // 245
  else if (run(starts.INCLUSION)) type = 'INCLUSION';                                     // 246
  else if (run(starts.BLOCKOPEN)) type = 'BLOCKOPEN';                                     // 247
  else if (run(starts.BLOCKCLOSE)) type = 'BLOCKCLOSE';                                   // 248
  else                                                                                    // 249
    error('Unknown stache tag');                                                          // 250
                                                                                          // 251
  var tag = new TemplateTag;                                                              // 252
  tag.type = type;                                                                        // 253
                                                                                          // 254
  if (type === 'BLOCKCOMMENT') {                                                          // 255
    var result = run(/^[\s\S]*?--\s*?\}\}/);                                              // 256
    if (! result)                                                                         // 257
      error("Unclosed block comment");                                                    // 258
    tag.value = result.slice(0, result.lastIndexOf('--'));                                // 259
  } else if (type === 'COMMENT') {                                                        // 260
    var result = run(/^[\s\S]*?\}\}/);                                                    // 261
    if (! result)                                                                         // 262
      error("Unclosed comment");                                                          // 263
    tag.value = result.slice(0, -2);                                                      // 264
  } else if (type === 'BLOCKCLOSE') {                                                     // 265
    tag.path = scanPath();                                                                // 266
    if (! run(ends.DOUBLE))                                                               // 267
      expected('`}}`');                                                                   // 268
  } else if (type === 'ELSE') {                                                           // 269
    if (! run(ends.DOUBLE))                                                               // 270
      expected('`}}`');                                                                   // 271
  } else if (type === 'ESCAPE') {                                                         // 272
    var result = run(/^\{*\|/);                                                           // 273
    tag.value = '{{' + result.slice(0, -1);                                               // 274
  } else {                                                                                // 275
    // DOUBLE, TRIPLE, BLOCKOPEN, INCLUSION                                               // 276
    tag.path = scanPath();                                                                // 277
    tag.args = [];                                                                        // 278
    var foundKwArg = false;                                                               // 279
    while (true) {                                                                        // 280
      run(/^\s*/);                                                                        // 281
      if (type === 'TRIPLE') {                                                            // 282
        if (run(ends.TRIPLE))                                                             // 283
          break;                                                                          // 284
        else if (scanner.peek() === '}')                                                  // 285
          expected('`}}}`');                                                              // 286
      } else {                                                                            // 287
        if (run(ends.DOUBLE))                                                             // 288
          break;                                                                          // 289
        else if (scanner.peek() === '}')                                                  // 290
          expected('`}}`');                                                               // 291
      }                                                                                   // 292
      var newArg = scanArg();                                                             // 293
      if (newArg.length === 3) {                                                          // 294
        foundKwArg = true;                                                                // 295
      } else {                                                                            // 296
        if (foundKwArg)                                                                   // 297
          error("Can't have a non-keyword argument after a keyword argument");            // 298
      }                                                                                   // 299
      tag.args.push(newArg);                                                              // 300
                                                                                          // 301
      if (run(/^(?=[\s}])/) !== '')                                                       // 302
        expected('space');                                                                // 303
    }                                                                                     // 304
  }                                                                                       // 305
                                                                                          // 306
  return tag;                                                                             // 307
};                                                                                        // 308
                                                                                          // 309
// Returns a SpacebarsCompiler.TemplateTag parsed from `scanner`, leaving scanner         // 310
// at its original position.                                                              // 311
//                                                                                        // 312
// An error will still be thrown if there is not a valid template tag at                  // 313
// the current position.                                                                  // 314
TemplateTag.peek = function (scanner) {                                                   // 315
  var startPos = scanner.pos;                                                             // 316
  var result = TemplateTag.parse(scanner);                                                // 317
  scanner.pos = startPos;                                                                 // 318
  return result;                                                                          // 319
};                                                                                        // 320
                                                                                          // 321
// Like `TemplateTag.parse`, but in the case of blocks, parse the complete                // 322
// `{{#foo}}...{{/foo}}` with `content` and possible `elseContent`, rather                // 323
// than just the BLOCKOPEN tag.                                                           // 324
//                                                                                        // 325
// In addition:                                                                           // 326
//                                                                                        // 327
// - Throws an error if `{{else}}` or `{{/foo}}` tag is encountered.                      // 328
//                                                                                        // 329
// - Returns `null` for a COMMENT.  (This case is distinguishable from                    // 330
//   parsing no tag by the fact that the scanner is advanced.)                            // 331
//                                                                                        // 332
// - Takes an HTMLTools.TEMPLATE_TAG_POSITION `position` and sets it as the               // 333
//   TemplateTag's `.position` property.                                                  // 334
//                                                                                        // 335
// - Validates the tag's well-formedness and legality at in its position.                 // 336
TemplateTag.parseCompleteTag = function (scannerOrString, position) {                     // 337
  var scanner = scannerOrString;                                                          // 338
  if (typeof scanner === 'string')                                                        // 339
    scanner = new HTMLTools.Scanner(scannerOrString);                                     // 340
                                                                                          // 341
  var startPos = scanner.pos; // for error messages                                       // 342
  var result = TemplateTag.parse(scannerOrString);                                        // 343
  if (! result)                                                                           // 344
    return result;                                                                        // 345
                                                                                          // 346
  if (result.type === 'BLOCKCOMMENT')                                                     // 347
    return null;                                                                          // 348
                                                                                          // 349
  if (result.type === 'COMMENT')                                                          // 350
    return null;                                                                          // 351
                                                                                          // 352
  if (result.type === 'ELSE')                                                             // 353
    scanner.fatal("Unexpected {{else}}");                                                 // 354
                                                                                          // 355
  if (result.type === 'BLOCKCLOSE')                                                       // 356
    scanner.fatal("Unexpected closing template tag");                                     // 357
                                                                                          // 358
  position = (position || TEMPLATE_TAG_POSITION.ELEMENT);                                 // 359
  if (position !== TEMPLATE_TAG_POSITION.ELEMENT)                                         // 360
    result.position = position;                                                           // 361
                                                                                          // 362
  if (result.type === 'BLOCKOPEN') {                                                      // 363
    // parse block contents                                                               // 364
                                                                                          // 365
    // Construct a string version of `.path` for comparing start and                      // 366
    // end tags.  For example, `foo/[0]` was parsed into `["foo", "0"]`                   // 367
    // and now becomes `foo,0`.  This form may also show up in error                      // 368
    // messages.                                                                          // 369
    var blockName = result.path.join(',');                                                // 370
                                                                                          // 371
    var textMode = null;                                                                  // 372
      if (blockName === 'markdown' ||                                                     // 373
          position === TEMPLATE_TAG_POSITION.IN_RAWTEXT) {                                // 374
        textMode = HTML.TEXTMODE.STRING;                                                  // 375
      } else if (position === TEMPLATE_TAG_POSITION.IN_RCDATA ||                          // 376
                 position === TEMPLATE_TAG_POSITION.IN_ATTRIBUTE) {                       // 377
        textMode = HTML.TEXTMODE.RCDATA;                                                  // 378
      }                                                                                   // 379
      var parserOptions = {                                                               // 380
        getTemplateTag: TemplateTag.parseCompleteTag,                                     // 381
        shouldStop: isAtBlockCloseOrElse,                                                 // 382
        textMode: textMode                                                                // 383
      };                                                                                  // 384
    result.content = HTMLTools.parseFragment(scanner, parserOptions);                     // 385
                                                                                          // 386
    if (scanner.rest().slice(0, 2) !== '{{')                                              // 387
      scanner.fatal("Expected {{else}} or block close for " + blockName);                 // 388
                                                                                          // 389
    var lastPos = scanner.pos; // save for error messages                                 // 390
    var tmplTag = TemplateTag.parse(scanner); // {{else}} or {{/foo}}                     // 391
                                                                                          // 392
    if (tmplTag.type === 'ELSE') {                                                        // 393
      // parse {{else}} and content up to close tag                                       // 394
      result.elseContent = HTMLTools.parseFragment(scanner, parserOptions);               // 395
                                                                                          // 396
      if (scanner.rest().slice(0, 2) !== '{{')                                            // 397
        scanner.fatal("Expected block close for " + blockName);                           // 398
                                                                                          // 399
      lastPos = scanner.pos;                                                              // 400
      tmplTag = TemplateTag.parse(scanner);                                               // 401
    }                                                                                     // 402
                                                                                          // 403
    if (tmplTag.type === 'BLOCKCLOSE') {                                                  // 404
      var blockName2 = tmplTag.path.join(',');                                            // 405
      if (blockName !== blockName2) {                                                     // 406
        scanner.pos = lastPos;                                                            // 407
        scanner.fatal('Expected tag to close ' + blockName + ', found ' +                 // 408
                      blockName2);                                                        // 409
      }                                                                                   // 410
    } else {                                                                              // 411
      scanner.pos = lastPos;                                                              // 412
      scanner.fatal('Expected tag to close ' + blockName + ', found ' +                   // 413
                    tmplTag.type);                                                        // 414
    }                                                                                     // 415
  }                                                                                       // 416
                                                                                          // 417
  var finalPos = scanner.pos;                                                             // 418
  scanner.pos = startPos;                                                                 // 419
  validateTag(result, scanner);                                                           // 420
  scanner.pos = finalPos;                                                                 // 421
                                                                                          // 422
  return result;                                                                          // 423
};                                                                                        // 424
                                                                                          // 425
var isAtBlockCloseOrElse = function (scanner) {                                           // 426
  // Detect `{{else}}` or `{{/foo}}`.                                                     // 427
  //                                                                                      // 428
  // We do as much work ourselves before deferring to `TemplateTag.peek`,                 // 429
  // for efficiency (we're called for every input token) and to be                        // 430
  // less obtrusive, because `TemplateTag.peek` will throw an error if it                 // 431
  // sees `{{` followed by a malformed tag.                                               // 432
  var rest, type;                                                                         // 433
  return (scanner.peek() === '{' &&                                                       // 434
          (rest = scanner.rest()).slice(0, 2) === '{{' &&                                 // 435
          /^\{\{\s*(\/|else\b)/.test(rest) &&                                             // 436
          (type = TemplateTag.peek(scanner).type) &&                                      // 437
          (type === 'BLOCKCLOSE' || type === 'ELSE'));                                    // 438
};                                                                                        // 439
                                                                                          // 440
// Validate that `templateTag` is correctly formed and legal for its                      // 441
// HTML position.  Use `scanner` to report errors. On success, does                       // 442
// nothing.                                                                               // 443
var validateTag = function (ttag, scanner) {                                              // 444
                                                                                          // 445
  if (ttag.type === 'INCLUSION' || ttag.type === 'BLOCKOPEN') {                           // 446
    var args = ttag.args;                                                                 // 447
    if (args.length > 1 && args[0].length === 2 && args[0][0] !== 'PATH') {               // 448
      // we have a positional argument that is not a PATH followed by                     // 449
      // other arguments                                                                  // 450
      scanner.fatal("First argument must be a function, to be called on the rest of the arguments; found " + args[0][0]);
    }                                                                                     // 452
  }                                                                                       // 453
                                                                                          // 454
  var position = ttag.position || TEMPLATE_TAG_POSITION.ELEMENT;                          // 455
  if (position === TEMPLATE_TAG_POSITION.IN_ATTRIBUTE) {                                  // 456
    if (ttag.type === 'DOUBLE' || ttag.type === 'ESCAPE') {                               // 457
      return;                                                                             // 458
    } else if (ttag.type === 'BLOCKOPEN') {                                               // 459
      var path = ttag.path;                                                               // 460
      var path0 = path[0];                                                                // 461
      if (! (path.length === 1 && (path0 === 'if' ||                                      // 462
                                   path0 === 'unless' ||                                  // 463
                                   path0 === 'with' ||                                    // 464
                                   path0 === 'each'))) {                                  // 465
        scanner.fatal("Custom block helpers are not allowed in an HTML attribute, only built-in ones like #each and #if");
      }                                                                                   // 467
    } else {                                                                              // 468
      scanner.fatal(ttag.type + " template tag is not allowed in an HTML attribute");     // 469
    }                                                                                     // 470
  } else if (position === TEMPLATE_TAG_POSITION.IN_START_TAG) {                           // 471
    if (! (ttag.type === 'DOUBLE')) {                                                     // 472
      scanner.fatal("Reactive HTML attributes must either have a constant name or consist of a single {{helper}} providing a dictionary of names and values.  A template tag of type " + ttag.type + " is not allowed here.");
    }                                                                                     // 474
    if (scanner.peek() === '=') {                                                         // 475
      scanner.fatal("Template tags are not allowed in attribute names, only in attribute values or in the form of a single {{helper}} that evaluates to a dictionary of name=value pairs.");
    }                                                                                     // 477
  }                                                                                       // 478
                                                                                          // 479
};                                                                                        // 480
                                                                                          // 481
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/spacebars-compiler/optimizer.js                                               //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
// Optimize parts of an HTMLjs tree into raw HTML strings when they don't                 // 1
// contain template tags.                                                                 // 2
                                                                                          // 3
var constant = function (value) {                                                         // 4
  return function () { return value; };                                                   // 5
};                                                                                        // 6
                                                                                          // 7
var OPTIMIZABLE = {                                                                       // 8
  NONE: 0,                                                                                // 9
  PARTS: 1,                                                                               // 10
  FULL: 2                                                                                 // 11
};                                                                                        // 12
                                                                                          // 13
// We can only turn content into an HTML string if it contains no template                // 14
// tags and no "tricky" HTML tags.  If we can optimize the entire content                 // 15
// into a string, we return OPTIMIZABLE.FULL.  If the we are given an                     // 16
// unoptimizable node, we return OPTIMIZABLE.NONE.  If we are given a tree                // 17
// that contains an unoptimizable node somewhere, we return OPTIMIZABLE.PARTS.            // 18
//                                                                                        // 19
// For example, we always create SVG elements programmatically, since SVG                 // 20
// doesn't have innerHTML.  If we are given an SVG element, we return NONE.               // 21
// However, if we are given a big tree that contains SVG somewhere, we                    // 22
// return PARTS so that the optimizer can descend into the tree and optimize              // 23
// other parts of it.                                                                     // 24
var CanOptimizeVisitor = HTML.Visitor.extend();                                           // 25
CanOptimizeVisitor.def({                                                                  // 26
  visitNull: constant(OPTIMIZABLE.FULL),                                                  // 27
  visitPrimitive: constant(OPTIMIZABLE.FULL),                                             // 28
  visitComment: constant(OPTIMIZABLE.FULL),                                               // 29
  visitCharRef: constant(OPTIMIZABLE.FULL),                                               // 30
  visitRaw: constant(OPTIMIZABLE.FULL),                                                   // 31
  visitObject: constant(OPTIMIZABLE.NONE),                                                // 32
  visitFunction: constant(OPTIMIZABLE.NONE),                                              // 33
  visitArray: function (x) {                                                              // 34
    for (var i = 0; i < x.length; i++)                                                    // 35
      if (this.visit(x[i]) !== OPTIMIZABLE.FULL)                                          // 36
        return OPTIMIZABLE.PARTS;                                                         // 37
    return OPTIMIZABLE.FULL;                                                              // 38
  },                                                                                      // 39
  visitTag: function (tag) {                                                              // 40
    var tagName = tag.tagName;                                                            // 41
    if (tagName === 'textarea') {                                                         // 42
      // optimizing into a TEXTAREA's RCDATA would require being a little                 // 43
      // more clever.                                                                     // 44
      return OPTIMIZABLE.NONE;                                                            // 45
    } else if (! (HTML.isKnownElement(tagName) &&                                         // 46
                  ! HTML.isKnownSVGElement(tagName))) {                                   // 47
      // foreign elements like SVG can't be stringified for innerHTML.                    // 48
      return OPTIMIZABLE.NONE;                                                            // 49
    } else if (tagName === 'table') {                                                     // 50
      // Avoid ever producing HTML containing `<table><tr>...`, because the               // 51
      // browser will insert a TBODY.  If we just `createElement("table")` and            // 52
      // `createElement("tr")`, on the other hand, no TBODY is necessary                  // 53
      // (assuming IE 8+).                                                                // 54
      return OPTIMIZABLE.NONE;                                                            // 55
    }                                                                                     // 56
                                                                                          // 57
    var children = tag.children;                                                          // 58
    for (var i = 0; i < children.length; i++)                                             // 59
      if (this.visit(children[i]) !== OPTIMIZABLE.FULL)                                   // 60
        return OPTIMIZABLE.PARTS;                                                         // 61
                                                                                          // 62
    if (this.visitAttributes(tag.attrs) !== OPTIMIZABLE.FULL)                             // 63
      return OPTIMIZABLE.PARTS;                                                           // 64
                                                                                          // 65
    return OPTIMIZABLE.FULL;                                                              // 66
  },                                                                                      // 67
  visitAttributes: function (attrs) {                                                     // 68
    if (attrs) {                                                                          // 69
      var isArray = HTML.isArray(attrs);                                                  // 70
      for (var i = 0; i < (isArray ? attrs.length : 1); i++) {                            // 71
        var a = (isArray ? attrs[i] : attrs);                                             // 72
        if ((typeof a !== 'object') || (a instanceof HTMLTools.TemplateTag))              // 73
          return OPTIMIZABLE.PARTS;                                                       // 74
        for (var k in a)                                                                  // 75
          if (this.visit(a[k]) !== OPTIMIZABLE.FULL)                                      // 76
            return OPTIMIZABLE.PARTS;                                                     // 77
      }                                                                                   // 78
    }                                                                                     // 79
    return OPTIMIZABLE.FULL;                                                              // 80
  }                                                                                       // 81
});                                                                                       // 82
                                                                                          // 83
var getOptimizability = function (content) {                                              // 84
  return (new CanOptimizeVisitor).visit(content);                                         // 85
};                                                                                        // 86
                                                                                          // 87
var toRaw = function (x) {                                                                // 88
  return HTML.Raw(HTML.toHTML(x));                                                        // 89
};                                                                                        // 90
                                                                                          // 91
var TreeTransformer = HTML.TransformingVisitor.extend();                                  // 92
TreeTransformer.def({                                                                     // 93
  visitAttributes: function (attrs/*, ...*/) {                                            // 94
    // pass template tags through by default                                              // 95
    if (attrs instanceof HTMLTools.TemplateTag)                                           // 96
      return attrs;                                                                       // 97
                                                                                          // 98
    return HTML.TransformingVisitor.prototype.visitAttributes.apply(                      // 99
      this, arguments);                                                                   // 100
  }                                                                                       // 101
});                                                                                       // 102
                                                                                          // 103
// Replace parts of the HTMLjs tree that have no template tags (or                        // 104
// tricky HTML tags) with HTML.Raw objects containing raw HTML.                           // 105
var OptimizingVisitor = TreeTransformer.extend();                                         // 106
OptimizingVisitor.def({                                                                   // 107
  visitNull: toRaw,                                                                       // 108
  visitPrimitive: toRaw,                                                                  // 109
  visitComment: toRaw,                                                                    // 110
  visitCharRef: toRaw,                                                                    // 111
  visitArray: function (array) {                                                          // 112
    var optimizability = getOptimizability(array);                                        // 113
    if (optimizability === OPTIMIZABLE.FULL) {                                            // 114
      return toRaw(array);                                                                // 115
    } else if (optimizability === OPTIMIZABLE.PARTS) {                                    // 116
      return TreeTransformer.prototype.visitArray.call(this, array);                      // 117
    } else {                                                                              // 118
      return array;                                                                       // 119
    }                                                                                     // 120
  },                                                                                      // 121
  visitTag: function (tag) {                                                              // 122
    var optimizability = getOptimizability(tag);                                          // 123
    if (optimizability === OPTIMIZABLE.FULL) {                                            // 124
      return toRaw(tag);                                                                  // 125
    } else if (optimizability === OPTIMIZABLE.PARTS) {                                    // 126
      return TreeTransformer.prototype.visitTag.call(this, tag);                          // 127
    } else {                                                                              // 128
      return tag;                                                                         // 129
    }                                                                                     // 130
  },                                                                                      // 131
  visitChildren: function (children) {                                                    // 132
    // don't optimize the children array into a Raw object!                               // 133
    return TreeTransformer.prototype.visitArray.call(this, children);                     // 134
  },                                                                                      // 135
  visitAttributes: function (attrs) {                                                     // 136
    return attrs;                                                                         // 137
  }                                                                                       // 138
});                                                                                       // 139
                                                                                          // 140
// Combine consecutive HTML.Raws.  Remove empty ones.                                     // 141
var RawCompactingVisitor = TreeTransformer.extend();                                      // 142
RawCompactingVisitor.def({                                                                // 143
  visitArray: function (array) {                                                          // 144
    var result = [];                                                                      // 145
    for (var i = 0; i < array.length; i++) {                                              // 146
      var item = array[i];                                                                // 147
      if ((item instanceof HTML.Raw) &&                                                   // 148
          ((! item.value) ||                                                              // 149
           (result.length &&                                                              // 150
            (result[result.length - 1] instanceof HTML.Raw)))) {                          // 151
        // two cases: item is an empty Raw, or previous item is                           // 152
        // a Raw as well.  In the latter case, replace the previous                       // 153
        // Raw with a longer one that includes the new Raw.                               // 154
        if (item.value) {                                                                 // 155
          result[result.length - 1] = HTML.Raw(                                           // 156
            result[result.length - 1].value + item.value);                                // 157
        }                                                                                 // 158
      } else {                                                                            // 159
        result.push(item);                                                                // 160
      }                                                                                   // 161
    }                                                                                     // 162
    return result;                                                                        // 163
  }                                                                                       // 164
});                                                                                       // 165
                                                                                          // 166
// Replace pointless Raws like `HTMl.Raw('foo')` that contain no special                  // 167
// characters with simple strings.                                                        // 168
var RawReplacingVisitor = TreeTransformer.extend();                                       // 169
RawReplacingVisitor.def({                                                                 // 170
  visitRaw: function (raw) {                                                              // 171
    var html = raw.value;                                                                 // 172
    if (html.indexOf('&') < 0 && html.indexOf('<') < 0) {                                 // 173
      return html;                                                                        // 174
    } else {                                                                              // 175
      return raw;                                                                         // 176
    }                                                                                     // 177
  }                                                                                       // 178
});                                                                                       // 179
                                                                                          // 180
SpacebarsCompiler.optimize = function (tree) {                                            // 181
  tree = (new OptimizingVisitor).visit(tree);                                             // 182
  tree = (new RawCompactingVisitor).visit(tree);                                          // 183
  tree = (new RawReplacingVisitor).visit(tree);                                           // 184
  return tree;                                                                            // 185
};                                                                                        // 186
                                                                                          // 187
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/spacebars-compiler/codegen.js                                                 //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
// ============================================================                           // 1
// Code-generation of template tags                                                       // 2
                                                                                          // 3
// The `CodeGen` class currently has no instance state, but in theory                     // 4
// it could be useful to track per-function state, like whether we                        // 5
// need to emit `var self = this` or not.                                                 // 6
var CodeGen = SpacebarsCompiler.CodeGen = function () {};                                 // 7
                                                                                          // 8
var builtInBlockHelpers = SpacebarsCompiler._builtInBlockHelpers = {                      // 9
  'if': 'Blaze.If',                                                                       // 10
  'unless': 'Blaze.Unless',                                                               // 11
  'with': 'Spacebars.With',                                                               // 12
  'each': 'Blaze.Each'                                                                    // 13
};                                                                                        // 14
                                                                                          // 15
                                                                                          // 16
// Mapping of "macros" which, when preceded by `Template.`, expand                        // 17
// to special code rather than following the lookup rules for dotted                      // 18
// symbols.                                                                               // 19
var builtInTemplateMacros = {                                                             // 20
  // `view` is a local variable defined in the generated render                           // 21
  // function for the template in which `Template.contentBlock` or                        // 22
  // `Template.elseBlock` is invoked.                                                     // 23
  'contentBlock': 'view.templateContentBlock',                                            // 24
  'elseBlock': 'view.templateElseBlock',                                                  // 25
                                                                                          // 26
  // Confusingly, this makes `{{> Template.dynamic}}` an alias                            // 27
  // for `{{> __dynamic}}`, where "__dynamic" is the template that                        // 28
  // implements the dynamic template feature.                                             // 29
  'dynamic': 'Template.__dynamic',                                                        // 30
                                                                                          // 31
  'subscriptionsReady': 'view.templateInstance().subscriptionsReady()'                    // 32
};                                                                                        // 33
                                                                                          // 34
// A "reserved name" can't be used as a <template> name.  This                            // 35
// function is used by the template file scanner.                                         // 36
//                                                                                        // 37
// Note that the runtime imposes additional restrictions, for example                     // 38
// banning the name "body" and names of built-in object properties                        // 39
// like "toString".                                                                       // 40
SpacebarsCompiler.isReservedName = function (name) {                                      // 41
  return builtInBlockHelpers.hasOwnProperty(name) ||                                      // 42
    builtInTemplateMacros.hasOwnProperty(name);                                           // 43
};                                                                                        // 44
                                                                                          // 45
var makeObjectLiteral = function (obj) {                                                  // 46
  var parts = [];                                                                         // 47
  for (var k in obj)                                                                      // 48
    parts.push(BlazeTools.toObjectLiteralKey(k) + ': ' + obj[k]);                         // 49
  return '{' + parts.join(', ') + '}';                                                    // 50
};                                                                                        // 51
                                                                                          // 52
_.extend(CodeGen.prototype, {                                                             // 53
  codeGenTemplateTag: function (tag) {                                                    // 54
    var self = this;                                                                      // 55
    if (tag.position === HTMLTools.TEMPLATE_TAG_POSITION.IN_START_TAG) {                  // 56
      // Special dynamic attributes: `<div {{attrs}}>...`                                 // 57
      // only `tag.type === 'DOUBLE'` allowed (by earlier validation)                     // 58
      return BlazeTools.EmitCode('function () { return ' +                                // 59
          self.codeGenMustache(tag.path, tag.args, 'attrMustache')                        // 60
          + '; }');                                                                       // 61
    } else {                                                                              // 62
      if (tag.type === 'DOUBLE' || tag.type === 'TRIPLE') {                               // 63
        var code = self.codeGenMustache(tag.path, tag.args);                              // 64
        if (tag.type === 'TRIPLE') {                                                      // 65
          code = 'Spacebars.makeRaw(' + code + ')';                                       // 66
        }                                                                                 // 67
        if (tag.position !== HTMLTools.TEMPLATE_TAG_POSITION.IN_ATTRIBUTE) {              // 68
          // Reactive attributes are already wrapped in a function,                       // 69
          // and there's no fine-grained reactivity.                                      // 70
          // Anywhere else, we need to create a View.                                     // 71
          code = 'Blaze.View("lookup:' + tag.path.join('.') + '", ' +                     // 72
            'function () { return ' + code + '; })';                                      // 73
        }                                                                                 // 74
        return BlazeTools.EmitCode(code);                                                 // 75
      } else if (tag.type === 'INCLUSION' || tag.type === 'BLOCKOPEN') {                  // 76
        var path = tag.path;                                                              // 77
                                                                                          // 78
        if (tag.type === 'BLOCKOPEN' &&                                                   // 79
            builtInBlockHelpers.hasOwnProperty(path[0])) {                                // 80
          // if, unless, with, each.                                                      // 81
          //                                                                              // 82
          // If someone tries to do `{{> if}}`, we don't                                  // 83
          // get here, but an error is thrown when we try to codegen the path.            // 84
                                                                                          // 85
          // Note: If we caught these errors earlier, while scanning, we'd be able to     // 86
          // provide nice line numbers.                                                   // 87
          if (path.length > 1)                                                            // 88
            throw new Error("Unexpected dotted path beginning with " + path[0]);          // 89
          if (! tag.args.length)                                                          // 90
            throw new Error("#" + path[0] + " requires an argument");                     // 91
                                                                                          // 92
          // `args` must exist (tag.args.length > 0)                                      // 93
          var dataCode = self.codeGenInclusionDataFunc(tag.args) || 'null';               // 94
          // `content` must exist                                                         // 95
          var contentBlock = (('content' in tag) ?                                        // 96
                              self.codeGenBlock(tag.content) : null);                     // 97
          // `elseContent` may not exist                                                  // 98
          var elseContentBlock = (('elseContent' in tag) ?                                // 99
                                  self.codeGenBlock(tag.elseContent) : null);             // 100
                                                                                          // 101
          var callArgs = [dataCode, contentBlock];                                        // 102
          if (elseContentBlock)                                                           // 103
            callArgs.push(elseContentBlock);                                              // 104
                                                                                          // 105
          return BlazeTools.EmitCode(                                                     // 106
            builtInBlockHelpers[path[0]] + '(' + callArgs.join(', ') + ')');              // 107
                                                                                          // 108
        } else {                                                                          // 109
          var compCode = self.codeGenPath(path, {lookupTemplate: true});                  // 110
          if (path.length > 1) {                                                          // 111
            // capture reactivity                                                         // 112
            compCode = 'function () { return Spacebars.call(' + compCode +                // 113
              '); }';                                                                     // 114
          }                                                                               // 115
                                                                                          // 116
          var dataCode = self.codeGenInclusionDataFunc(tag.args);                         // 117
          var content = (('content' in tag) ?                                             // 118
                         self.codeGenBlock(tag.content) : null);                          // 119
          var elseContent = (('elseContent' in tag) ?                                     // 120
                             self.codeGenBlock(tag.elseContent) : null);                  // 121
                                                                                          // 122
          var includeArgs = [compCode];                                                   // 123
          if (content) {                                                                  // 124
            includeArgs.push(content);                                                    // 125
            if (elseContent)                                                              // 126
              includeArgs.push(elseContent);                                              // 127
          }                                                                               // 128
                                                                                          // 129
          var includeCode =                                                               // 130
                'Spacebars.include(' + includeArgs.join(', ') + ')';                      // 131
                                                                                          // 132
          // calling convention compat -- set the data context around the                 // 133
          // entire inclusion, so that if the name of the inclusion is                    // 134
          // a helper function, it gets the data context in `this`.                       // 135
          // This makes for a pretty confusing calling convention --                      // 136
          // In `{{#foo bar}}`, `foo` is evaluated in the context of `bar`                // 137
          // -- but it's what we shipped for 0.8.0.  The rationale is that                // 138
          // `{{#foo bar}}` is sugar for `{{#with bar}}{{#foo}}...`.                      // 139
          if (dataCode) {                                                                 // 140
            includeCode =                                                                 // 141
              'Blaze._TemplateWith(' + dataCode + ', function () { return ' +             // 142
              includeCode + '; })';                                                       // 143
          }                                                                               // 144
                                                                                          // 145
          // XXX BACK COMPAT - UI is the old name, Template is the new                    // 146
          if ((path[0] === 'UI' || path[0] === 'Template') &&                             // 147
              (path[1] === 'contentBlock' || path[1] === 'elseBlock')) {                  // 148
            // Call contentBlock and elseBlock in the appropriate scope                   // 149
            includeCode = 'Blaze._InOuterTemplateScope(view, function () { return '       // 150
              + includeCode + '; })';                                                     // 151
          }                                                                               // 152
                                                                                          // 153
          return BlazeTools.EmitCode(includeCode);                                        // 154
        }                                                                                 // 155
      } else if (tag.type === 'ESCAPE') {                                                 // 156
        return tag.value;                                                                 // 157
      } else {                                                                            // 158
        // Can't get here; TemplateTag validation should catch any                        // 159
        // inappropriate tag types that might come out of the parser.                     // 160
        throw new Error("Unexpected template tag type: " + tag.type);                     // 161
      }                                                                                   // 162
    }                                                                                     // 163
  },                                                                                      // 164
                                                                                          // 165
  // `path` is an array of at least one string.                                           // 166
  //                                                                                      // 167
  // If `path.length > 1`, the generated code may be reactive                             // 168
  // (i.e. it may invalidate the current computation).                                    // 169
  //                                                                                      // 170
  // No code is generated to call the result if it's a function.                          // 171
  //                                                                                      // 172
  // Options:                                                                             // 173
  //                                                                                      // 174
  // - lookupTemplate {Boolean} If true, generated code also looks in                     // 175
  //   the list of templates. (After helpers, before data context).                       // 176
  //   Used when generating code for `{{> foo}}` or `{{#foo}}`. Only                      // 177
  //   used for non-dotted paths.                                                         // 178
  codeGenPath: function (path, opts) {                                                    // 179
    if (builtInBlockHelpers.hasOwnProperty(path[0]))                                      // 180
      throw new Error("Can't use the built-in '" + path[0] + "' here");                   // 181
    // Let `{{#if Template.contentBlock}}` check whether this template was                // 182
    // invoked via inclusion or as a block helper, in addition to supporting              // 183
    // `{{> Template.contentBlock}}`.                                                     // 184
    // XXX BACK COMPAT - UI is the old name, Template is the new                          // 185
    if (path.length >= 2 &&                                                               // 186
        (path[0] === 'UI' || path[0] === 'Template')                                      // 187
        && builtInTemplateMacros.hasOwnProperty(path[1])) {                               // 188
      if (path.length > 2)                                                                // 189
        throw new Error("Unexpected dotted path beginning with " +                        // 190
                        path[0] + '.' + path[1]);                                         // 191
      return builtInTemplateMacros[path[1]];                                              // 192
    }                                                                                     // 193
                                                                                          // 194
    var firstPathItem = BlazeTools.toJSLiteral(path[0]);                                  // 195
    var lookupMethod = 'lookup';                                                          // 196
    if (opts && opts.lookupTemplate && path.length === 1)                                 // 197
      lookupMethod = 'lookupTemplate';                                                    // 198
    var code = 'view.' + lookupMethod + '(' + firstPathItem + ')';                        // 199
                                                                                          // 200
    if (path.length > 1) {                                                                // 201
      code = 'Spacebars.dot(' + code + ', ' +                                             // 202
        _.map(path.slice(1), BlazeTools.toJSLiteral).join(', ') + ')';                    // 203
    }                                                                                     // 204
                                                                                          // 205
    return code;                                                                          // 206
  },                                                                                      // 207
                                                                                          // 208
  // Generates code for an `[argType, argValue]` argument spec,                           // 209
  // ignoring the third element (keyword argument name) if present.                       // 210
  //                                                                                      // 211
  // The resulting code may be reactive (in the case of a PATH of                         // 212
  // more than one element) and is not wrapped in a closure.                              // 213
  codeGenArgValue: function (arg) {                                                       // 214
    var self = this;                                                                      // 215
                                                                                          // 216
    var argType = arg[0];                                                                 // 217
    var argValue = arg[1];                                                                // 218
                                                                                          // 219
    var argCode;                                                                          // 220
    switch (argType) {                                                                    // 221
    case 'STRING':                                                                        // 222
    case 'NUMBER':                                                                        // 223
    case 'BOOLEAN':                                                                       // 224
    case 'NULL':                                                                          // 225
      argCode = BlazeTools.toJSLiteral(argValue);                                         // 226
      break;                                                                              // 227
    case 'PATH':                                                                          // 228
      argCode = self.codeGenPath(argValue);                                               // 229
      break;                                                                              // 230
    default:                                                                              // 231
      // can't get here                                                                   // 232
      throw new Error("Unexpected arg type: " + argType);                                 // 233
    }                                                                                     // 234
                                                                                          // 235
    return argCode;                                                                       // 236
  },                                                                                      // 237
                                                                                          // 238
  // Generates a call to `Spacebars.fooMustache` on evaluated arguments.                  // 239
  // The resulting code has no function literals and must be wrapped in                   // 240
  // one for fine-grained reactivity.                                                     // 241
  codeGenMustache: function (path, args, mustacheType) {                                  // 242
    var self = this;                                                                      // 243
                                                                                          // 244
    var nameCode = self.codeGenPath(path);                                                // 245
    var argCode = self.codeGenMustacheArgs(args);                                         // 246
    var mustache = (mustacheType || 'mustache');                                          // 247
                                                                                          // 248
    return 'Spacebars.' + mustache + '(' + nameCode +                                     // 249
      (argCode ? ', ' + argCode.join(', ') : '') + ')';                                   // 250
  },                                                                                      // 251
                                                                                          // 252
  // returns: array of source strings, or null if no                                      // 253
  // args at all.                                                                         // 254
  codeGenMustacheArgs: function (tagArgs) {                                               // 255
    var self = this;                                                                      // 256
                                                                                          // 257
    var kwArgs = null; // source -> source                                                // 258
    var args = null; // [source]                                                          // 259
                                                                                          // 260
    // tagArgs may be null                                                                // 261
    _.each(tagArgs, function (arg) {                                                      // 262
      var argCode = self.codeGenArgValue(arg);                                            // 263
                                                                                          // 264
      if (arg.length > 2) {                                                               // 265
        // keyword argument (represented as [type, value, name])                          // 266
        kwArgs = (kwArgs || {});                                                          // 267
        kwArgs[arg[2]] = argCode;                                                         // 268
      } else {                                                                            // 269
        // positional argument                                                            // 270
        args = (args || []);                                                              // 271
        args.push(argCode);                                                               // 272
      }                                                                                   // 273
    });                                                                                   // 274
                                                                                          // 275
    // put kwArgs in options dictionary at end of args                                    // 276
    if (kwArgs) {                                                                         // 277
      args = (args || []);                                                                // 278
      args.push('Spacebars.kw(' + makeObjectLiteral(kwArgs) + ')');                       // 279
    }                                                                                     // 280
                                                                                          // 281
    return args;                                                                          // 282
  },                                                                                      // 283
                                                                                          // 284
  codeGenBlock: function (content) {                                                      // 285
    return SpacebarsCompiler.codeGen(content);                                            // 286
  },                                                                                      // 287
                                                                                          // 288
  codeGenInclusionDataFunc: function (args) {                                             // 289
    var self = this;                                                                      // 290
                                                                                          // 291
    var dataFuncCode = null;                                                              // 292
                                                                                          // 293
    if (! args.length) {                                                                  // 294
      // e.g. `{{#foo}}`                                                                  // 295
      return null;                                                                        // 296
    } else if (args[0].length === 3) {                                                    // 297
      // keyword arguments only, e.g. `{{> point x=1 y=2}}`                               // 298
      var dataProps = {};                                                                 // 299
      _.each(args, function (arg) {                                                       // 300
        var argKey = arg[2];                                                              // 301
        dataProps[argKey] = 'Spacebars.call(' + self.codeGenArgValue(arg) + ')';          // 302
      });                                                                                 // 303
      dataFuncCode = makeObjectLiteral(dataProps);                                        // 304
    } else if (args[0][0] !== 'PATH') {                                                   // 305
      // literal first argument, e.g. `{{> foo "blah"}}`                                  // 306
      //                                                                                  // 307
      // tag validation has confirmed, in this case, that there is only                   // 308
      // one argument (`args.length === 1`)                                               // 309
      dataFuncCode = self.codeGenArgValue(args[0]);                                       // 310
    } else if (args.length === 1) {                                                       // 311
      // one argument, must be a PATH                                                     // 312
      dataFuncCode = 'Spacebars.call(' + self.codeGenPath(args[0][1]) + ')';              // 313
    } else {                                                                              // 314
      // Multiple positional arguments; treat them as a nested                            // 315
      // "data mustache"                                                                  // 316
      dataFuncCode = self.codeGenMustache(args[0][1], args.slice(1),                      // 317
                                          'dataMustache');                                // 318
    }                                                                                     // 319
                                                                                          // 320
    return 'function () { return ' + dataFuncCode + '; }';                                // 321
  }                                                                                       // 322
                                                                                          // 323
});                                                                                       // 324
                                                                                          // 325
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/spacebars-compiler/compiler.js                                                //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
                                                                                          // 1
SpacebarsCompiler.parse = function (input) {                                              // 2
                                                                                          // 3
  var tree = HTMLTools.parseFragment(                                                     // 4
    input,                                                                                // 5
    { getTemplateTag: TemplateTag.parseCompleteTag });                                    // 6
                                                                                          // 7
  return tree;                                                                            // 8
};                                                                                        // 9
                                                                                          // 10
SpacebarsCompiler.compile = function (input, options) {                                   // 11
  var tree = SpacebarsCompiler.parse(input);                                              // 12
  return SpacebarsCompiler.codeGen(tree, options);                                        // 13
};                                                                                        // 14
                                                                                          // 15
SpacebarsCompiler._TemplateTagReplacer = HTML.TransformingVisitor.extend();               // 16
SpacebarsCompiler._TemplateTagReplacer.def({                                              // 17
  visitObject: function (x) {                                                             // 18
    if (x instanceof HTMLTools.TemplateTag) {                                             // 19
                                                                                          // 20
      // Make sure all TemplateTags in attributes have the right                          // 21
      // `.position` set on them.  This is a bit of a hack                                // 22
      // (we shouldn't be mutating that here), but it allows                              // 23
      // cleaner codegen of "synthetic" attributes like TEXTAREA's                        // 24
      // "value", where the template tags were originally not                             // 25
      // in an attribute.                                                                 // 26
      if (this.inAttributeValue)                                                          // 27
        x.position = HTMLTools.TEMPLATE_TAG_POSITION.IN_ATTRIBUTE;                        // 28
                                                                                          // 29
      return this.codegen.codeGenTemplateTag(x);                                          // 30
    }                                                                                     // 31
                                                                                          // 32
    return HTML.TransformingVisitor.prototype.visitObject.call(this, x);                  // 33
  },                                                                                      // 34
  visitAttributes: function (attrs) {                                                     // 35
    if (attrs instanceof HTMLTools.TemplateTag)                                           // 36
      return this.codegen.codeGenTemplateTag(attrs);                                      // 37
                                                                                          // 38
    // call super (e.g. for case where `attrs` is an array)                               // 39
    return HTML.TransformingVisitor.prototype.visitAttributes.call(this, attrs);          // 40
  },                                                                                      // 41
  visitAttribute: function (name, value, tag) {                                           // 42
    this.inAttributeValue = true;                                                         // 43
    var result = this.visit(value);                                                       // 44
    this.inAttributeValue = false;                                                        // 45
                                                                                          // 46
    if (result !== value) {                                                               // 47
      // some template tags must have been replaced, because otherwise                    // 48
      // we try to keep things `===` when transforming.  Wrap the code                    // 49
      // in a function as per the rules.  You can't have                                  // 50
      // `{id: Blaze.View(...)}` as an attributes dict because the View                   // 51
      // would be rendered more than once; you need to wrap it in a function              // 52
      // so that it's a different View each time.                                         // 53
      return BlazeTools.EmitCode(this.codegen.codeGenBlock(result));                      // 54
    }                                                                                     // 55
    return result;                                                                        // 56
  }                                                                                       // 57
});                                                                                       // 58
                                                                                          // 59
SpacebarsCompiler.codeGen = function (parseTree, options) {                               // 60
  // is this a template, rather than a block passed to                                    // 61
  // a block helper, say                                                                  // 62
  var isTemplate = (options && options.isTemplate);                                       // 63
  var isBody = (options && options.isBody);                                               // 64
                                                                                          // 65
  var tree = parseTree;                                                                   // 66
                                                                                          // 67
  // The flags `isTemplate` and `isBody` are kind of a hack.                              // 68
  if (isTemplate || isBody) {                                                             // 69
    // optimizing fragments would require being smarter about whether we are              // 70
    // in a TEXTAREA, say.                                                                // 71
    tree = SpacebarsCompiler.optimize(tree);                                              // 72
  }                                                                                       // 73
                                                                                          // 74
  var codegen = new SpacebarsCompiler.CodeGen;                                            // 75
  tree = (new SpacebarsCompiler._TemplateTagReplacer(                                     // 76
    {codegen: codegen})).visit(tree);                                                     // 77
                                                                                          // 78
  var code = '(function () { ';                                                           // 79
  if (isTemplate || isBody) {                                                             // 80
    code += 'var view = this; ';                                                          // 81
  }                                                                                       // 82
  code += 'return ';                                                                      // 83
  code += BlazeTools.toJS(tree);                                                          // 84
  code += '; })';                                                                         // 85
                                                                                          // 86
  code = SpacebarsCompiler._beautify(code);                                               // 87
                                                                                          // 88
  return code;                                                                            // 89
};                                                                                        // 90
                                                                                          // 91
SpacebarsCompiler._beautify = function (code) {                                           // 92
  if (Package.minifiers && Package.minifiers.UglifyJSMinify) {                            // 93
    var result = Package.minifiers.UglifyJSMinify(                                        // 94
      code,                                                                               // 95
      { fromString: true,                                                                 // 96
        mangle: false,                                                                    // 97
        compress: false,                                                                  // 98
        output: { beautify: true,                                                         // 99
                  indent_level: 2,                                                        // 100
                  width: 80 } });                                                         // 101
    var output = result.code;                                                             // 102
    // Uglify interprets our expression as a statement and may add a semicolon.           // 103
    // Strip trailing semicolon.                                                          // 104
    output = output.replace(/;$/, '');                                                    // 105
    return output;                                                                        // 106
  } else {                                                                                // 107
    // don't actually beautify; no UglifyJS                                               // 108
    return code;                                                                          // 109
  }                                                                                       // 110
};                                                                                        // 111
                                                                                          // 112
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['spacebars-compiler'] = {
  SpacebarsCompiler: SpacebarsCompiler
};

})();

//# sourceMappingURL=spacebars-compiler.js.map
