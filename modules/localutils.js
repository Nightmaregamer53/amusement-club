module.exports = {
    getRegexString,
    parseToSeconds,
    msToTime,
    HEXToVBColor,
    getSourceFormat,
    toTitleCase,
    getMinutesDifference,
    getHoursDifference,
    getFullTimeDifference,
    isInt,
    sortByStars
}

function getSourceFormat(str) {
    return str.replace(' ', '');
}

function getRegexString(arr) {
    var ln = _formatSymbols(arr[0]);
    for(var j=1; j<arr.length; j++) {
        ln += '.*' + _formatSymbols(arr[j]);
    }
    return ln;
}

function _formatSymbols(word) {
    return word 
        .replace('.', '\\.')
        .replace('?', '\\?')
        .replace('_', ' ');
}

function HEXToVBColor(rrggbb) {
    var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
    return parseInt(bbggrr, 16);
}

function parseToSeconds(inp) {
    var c = inp.split(':');
    return parseInt(c[0]) * 3600 
    + parseInt(c[1]) * 60
    + parseFloat(c[2]);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function msToTime(s) {

  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

function getHoursDifference(tg) {
    let mil = new Date() - tg;
    return Math.floor(mil / (1000*60*60));
}

function getMinutesDifference(tg) {
    let mil = new Date() - tg;
    return Math.floor(mil / (1000*60));
}

function getFullTimeDifference(tg) {
    let mil = new Date() - tg;
    return msToTime(mil);
}

function isInt(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}

function sortByStars(cards) {
    cards.sort((a, b) => {
        let match1 = a.name.match(/★/g);
        let match2 = b.name.match(/★/g);

        if(!match1) return 1;
        if(!match2) return -1;
        if(match1 < match2) return 1;
        if(match1 > match2) return -1;
        return 0;
    });
    return cards;
}