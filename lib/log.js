/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var util = require('util');
/**
 * Initialize a `Loggeer` with the given log `level` defaulting
 * to __DEBUG__ and `viewMode` defaulting to __PROD__.
 *
 * @param {Number} level
 * @param {Object} viewMode
 * @api public
 */

var Log = exports = module.exports = function Log(level, viewMode){
  if ('string' == typeof level) {
    level = exports[level.toUpperCase()];
  }
  this.level = isFinite(level) ? level : exports.DEBUG;

  if ('string' == typeof viewMode && ~['DEV', 'PROD'].indexOf(viewMode.toUpperCase())) {
    this.viewMode = viewMode.toUpperCase();
  } else {
    this.viewMode = 'PROD';
  }

  this.stream = process.stdout;
};

/**
 * System is unusable.
 *
 * @type Number
 */

exports.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 *
 * @type Number
 */

exports.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

exports.CRITICAL = 2;

/**
 * Error condition.
 *
 * @type Number
 */

exports.ERROR = 3;

/**
 * Warning condition.
 *
 * @type Number
 */

exports.WARNING = 4;

/**
 * Normal but significant condition.
 *
 * @type Number
 */

exports.NOTICE = 5;

/**
 * Purely informational message.
 *
 * @type Number
 */

exports.INFO = 6;

/**
 * Application debug messages.
 *
 * @type Number
 */

exports.DEBUG = 7;

function levelStringFormat (levelStr) {
  var bg_color = [31, 30, 33, 32, 29, 29, 26, -7]; 
  var colorNo = exports[levelStr] + bg_color[exports[levelStr]];
  for (var l = levelStr.length; l < 9; l++) {
    levelStr += " ";
  }
  return "\033[" + colorNo + "m" + levelStr + "\033[0m";
}

/**
 * prototype.
 */

Log.prototype = {

  /**
   * Log output message.
   *
   * @param  {String} levelStr
   * @param  {Array} args
   * @api private
   */

  log: function(levelStr, args) {
    if (exports[levelStr] <= this.level) {
      var msg = util.format.apply(null, args);
      var out;
      if (this.viewMode == 'PROD') {
        var json = {
          date: (new Date).toString(),
          level: levelStr,
          message: msg
        }
        out = util.inspect(json, false, null);
      } else {
        out = '[' + new Date + ']'
          + ' ' + levelStringFormat(levelStr)
          + ' ' + msg;
      }
      this.stream.write(out + '\n');
    }
  },


  /**
   * Log emergency `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  emergency: function(msg){
    this.log('EMERGENCY', arguments);
  },

  /**
   * Log alert `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  alert: function(msg){
    this.log('ALERT', arguments);
  },

  /**
   * Log critical `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  critical: function(msg){
    this.log('CRITICAL', arguments);
  },

  /**
   * Log error `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  error: function(msg){
    this.log('ERROR', arguments);
  },

  /**
   * Log warning `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  warning: function(msg){
    this.log('WARNING', arguments);
  },

  /**
   * Log notice `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  notice: function(msg){
    this.log('NOTICE', arguments);
  },

  /**
   * Log info `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  info: function(msg){
    this.log('INFO', arguments);
  },

  /**
   * Log debug `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  debug: function(msg){
    this.log('DEBUG', arguments);
  }
};