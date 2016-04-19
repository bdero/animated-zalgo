/*
 * He Comes - Animated text fuck-up script.
 * 2013 Brandon DeRosier
 *
 * /web/20150101161728/http://cheesekeg.com/listings/projects/hecomes/hecomes.js
 * 
 * This javascript is licensed under the GNU General Public License, version 3 or later.
 * /web/20150101161728/http://www.gnu.org/licenses/gpl-3.0-standalone.html
 *
 *
 * TO USE: Include this script into the header of a page containing text element(s) with
 *         a class of "hecomes".
 */


// MiniDaemon - Mozilla Developer Network - ver. 1.0 rev. 1
// This framework is released under the GNU General Public License, version 3 or later.
// /web/20150101161728/http://www.gnu.org/licenses/gpl-3.0-standalone.html
 
function MiniDaemon (oOwner, fTask, nRate, nLen) {
  if (!(this && this instanceof MiniDaemon)) { return; }
  if (arguments.length < 2) { throw new TypeError("MiniDaemon - not enough arguments"); }
  if (oOwner) { this.owner = oOwner; }
  this.task = fTask;
  if (isFinite(nRate) && nRate > 0) { this.rate = Math.floor(nRate); }
  if (nLen > 0) { this.length = Math.floor(nLen); }
}
 
MiniDaemon.prototype.owner = null;
MiniDaemon.prototype.task = null;
MiniDaemon.prototype.rate = 100;
MiniDaemon.prototype.length = Infinity;
 
  /* These properties should be read-only */
 
MiniDaemon.prototype.SESSION = -1;
MiniDaemon.prototype.INDEX = 0;
MiniDaemon.prototype.PAUSED = true;
MiniDaemon.prototype.BACKW = true;
 
  /* Global methods */
 
MiniDaemon.forceCall = function (oDmn) {
  oDmn.INDEX += oDmn.BACKW ? -1 : 1;
  if (oDmn.task.call(oDmn.owner, oDmn.INDEX, oDmn.length, oDmn.BACKW) === false || oDmn.isAtEnd()) { oDmn.pause(); return false; }
  return true;
};
 
  /* Instances methods */
 
MiniDaemon.prototype.isAtEnd = function () {
  return this.BACKW ? isFinite(this.length) && this.INDEX < 1 : this.INDEX + 1 > this.length;
};
 
MiniDaemon.prototype.synchronize = function () {
  if (this.PAUSED) { return; }
  clearInterval(this.SESSION);
  this.SESSION = setInterval(MiniDaemon.forceCall, this.rate, this);
};
 
MiniDaemon.prototype.pause = function () {
  clearInterval(this.SESSION);
  this.PAUSED = true;
};
 
MiniDaemon.prototype.start = function (bReverse) {
  var bBackw = Boolean(bReverse);
  if (this.BACKW === bBackw && (this.isAtEnd() || !this.PAUSED)) { return; }
  this.BACKW = bBackw;
  this.PAUSED = false;
  this.synchronize();
};


// Character tables taken from the original Zalgo text generator.

var zalgoUp = [
    '\u030d', '\u030e', '\u0304', '\u0305',
    '\u033f', '\u0311', '\u0306', '\u0310',
    '\u0352', '\u0357', '\u0351', '\u0307',
    '\u0308', '\u030a', '\u0342', '\u0343',
    '\u0344', '\u034a', '\u034b', '\u034c',
    '\u0303', '\u0302', '\u030c', '\u0350',
    '\u0300', '\u0301', '\u030b', '\u030f',
    '\u0312', '\u0313', '\u0314', '\u033d',
    '\u0309', '\u0363', '\u0364', '\u0365',
    '\u0366', '\u0367', '\u0368', '\u0369',
    '\u036a', '\u036b', '\u036c', '\u036d',
    '\u036e', '\u036f', '\u033e', '\u035b',
    '\u0346', '\u031a'
];

var zalgoDown = [
    '\u0316', '\u0317', '\u0318', '\u0319',
    '\u031c', '\u031d', '\u031e', '\u031f',
    '\u0320', '\u0324', '\u0325', '\u0326',
    '\u0329', '\u032a', '\u032b', '\u032c',
    '\u032d', '\u032e', '\u032f', '\u0330',
    '\u0331', '\u0332', '\u0333', '\u0339',
    '\u033a', '\u033b', '\u033c', '\u0345',
    '\u0347', '\u0348', '\u0349', '\u034d',
    '\u034e', '\u0353', '\u0354', '\u0355',
    '\u0356', '\u0359', '\u035a', '\u0323'
];

var zalgoMiddle = [
    '\u0315', '\u031b', '\u0340', '\u0341',
    '\u0358', '\u0321', '\u0322', '\u0327',
    '\u0328', '\u0334', '\u0335', '\u0336',
    '\u034f', '\u035c', '\u035d', '\u035e',
    '\u035f', '\u0360', '\u0362', '\u0338',
    '\u0337', '\u0361', '\u0489'
];


// He comes....

function HeComes(container) {
    this.container = container;
    this.originalText = container.textContent;

    this.daemon = new MiniDaemon(this, this.fuckUp, 80);
    this.daemon.start();
}

HeComes.prototype.additions = ['strong', 'em', 'sub', 'sup'];
HeComes.prototype.faces = ['Comic Sans', 'Alial', 'Georgia', 'Papyrus', 'Mono'];
HeComes.prototype.zalgo = [zalgoMiddle, zalgoDown, zalgoUp];

HeComes.prototype.fuckUp = function() {
    var newHtml = '';
    
    for (var i = 0; i < this.originalText.length; i++) {
	var c = this.originalText[i];

	// upper or lower case
	c = Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase();

	// added tags
	for (var j = 0; j < this.additions.length; j++)
	    c = Math.random() > 0.5 ?
	        '<' + this.additions[j] + '>' + c + '</' + this.additions[j] + '>' : c;

	// zalgo
	for (var j = 0; j < this.zalgo.length; j++)
	    for (var k = 0; k < Math.floor(Math.random()*3) + 1; k++)
		c += this.zalgo[j][Math.floor(Math.random()*this.zalgo[j].length)];

	// font color
	var color = Math.random() < 0.2 ? 'color="#700"' : '';

	// font face and color
	c = '<font face="' +
	     this.faces[Math.floor(Math.random()*this.faces.length)] +
	     '"' + color + '>' + c + '</font>';

	newHtml += c;
    }

    this.container.innerHTML = newHtml;
};


// Initialize

var heComesInstances = [];

window.onload = function(e) {
    containers = document.getElementsByClassName('hecomes');

    for (var i = 0; i < containers.length; i++) {
	heComesInstances.push(new HeComes(containers[i]));
    }
};
