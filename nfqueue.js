/*
 * Copyright (C) 2014  Anthony Hinsinger
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 */

const binding = require('node-gyp-build')(__dirname)

/* Constant */
var i = 0;
exports.NF_DROP = i++;
exports.NF_ACCEPT = i++;
exports.NF_STOLEN = i++;
exports.NF_QUEUE = i++;
exports.NF_REPEAT = i++;
exports.NF_STOP = i++;

/* NFQueue class */
var NFQueue = function() {
  var me = this;
  me.opened = false;
  me.bindings = new binding.NFQueue();

  /* NFQueuePacket class */
  var NFQueuePacket = function(info, payload) {
    this.info = info;
    this.payload = payload;
  };

  NFQueuePacket.prototype.setVerdict = function(verdict, mark, buffer) {
    buffer = typeof buffer !== 'undefined' ? buffer : null;
    if (mark)
      me.bindings.setVerdict(this.info.id, verdict, mark, buffer);
    else
      me.bindings.setVerdict(this.info.id, verdict, buffer);
  };

  me.NFQueuePacket = NFQueuePacket;
};

NFQueue.prototype.open = function(num, buf) {
  this.bindings.open(num, buf);
  this.opened = true;
};

NFQueue.prototype.run = function(callback) {
  var me = this;
  this.bindings.read(function(info, payload) {
    callback(new me.NFQueuePacket(info, payload));
  });
};

exports.NFQueue = NFQueue;

exports.createQueueHandler = function(num, buf, callback) {
  if (!buf) { buf = 65535; }
  var nfq = new NFQueue();

  nfq.open(num, buf);
  nfq.run(callback);

  return nfq;
};
