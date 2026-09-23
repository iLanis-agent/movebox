/* MoveBox engine - pure moving-box inventory logic, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MoveBoxEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  function nextNum(boxes){
    return boxes.reduce(function(m, b){ return Math.max(m, b.num); }, 0) + 1;
  }

  function addBox(boxes, room, contents, opts){
    opts = opts || {};
    if (!room.trim() || !contents.trim()) return {boxes:boxes, added:null};
    var b = {
      num: nextNum(boxes),
      room: room.trim(),
      contents: contents.trim(),
      fragile: !!opts.fragile,
      openFirst: !!opts.openFirst,
      unpacked: false
    };
    return {boxes: boxes.concat([b]), added: b};
  }

  /* search across box number, room and contents; case-insensitive, all words must hit */
  function search(boxes, q){
    var words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return boxes;
    return boxes.filter(function(b){
      var hay = ('box ' + b.num + ' ' + b.room + ' ' + b.contents).toLowerCase();
      return words.every(function(w){ return hay.indexOf(w) !== -1; });
    });
  }

  function stats(boxes){
    var unpacked = boxes.filter(function(b){ return b.unpacked; }).length;
    return {
      total: boxes.length,
      fragile: boxes.filter(function(b){ return b.fragile; }).length,
      openFirst: boxes.filter(function(b){ return b.openFirst && !b.unpacked; }).length,
      unpacked: unpacked,
      pct: boxes.length ? Math.round(unpacked / boxes.length * 100) : 0
    };
  }

  /* night-one essentials, still sealed */
  function nightOne(boxes){
    return boxes.filter(function(b){ return b.openFirst && !b.unpacked; })
      .sort(function(a, b){ return a.num - b.num; });
  }

  return {nextNum:nextNum, addBox:addBox, search:search, stats:stats, nightOne:nightOne};
});
