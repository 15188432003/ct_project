var a = function (a, r) {
    for (var t = [], h = 0; h < r.length; h++)
      a.indexOf(r[h]) >= 0 || t.push(r[h]);
    return a.concat(t);
  },
  r = Math.log2(4294967296),
  t = function (a, t) {
    var h = Math.floor((t + r) / r) - 1,
      i = Math.pow(2, t - h * r);
    a[h] = a[h] | i;
  },
  h = function (a, r) {
    for (var t = a.slice(), h = 0; h < t.length; h++) t[h] = t[h] & r[h];
    return t;
  },
  i = function (a) {
    for (var r = 0; r < a.length; r++) if (0 !== a[r]) return !1;
    return !0;
  },
  s = function (a) {
    (this._variants = a.variants), (this._paramSchema = []);
    for (var h = 0; h < this._variants.length; h++)
      for (var i = this._variants[h], s = 0; s < i.length; s++)
        (void 0 === this._paramSchema[s] || this._paramSchema[s] <= i[s]) &&
          (this._paramSchema[s] = i[s] + 1);
    if (
      ((this._allValidParams = null),
      (this._matrixIndexParamSchemaMap = {}),
      (this._matrix = a.matrix),
      this._matrix)
    )
      for (h = 0; h < this._paramSchema.length; h++)
        for (s = 0; s < this._paramSchema[h]; s++)
          this._matrixIndexParamSchemaMap[e + s] = [h, s];
    else {
      this._matrix = [];
      var e = 0,
        n = (function (a) {
          if (a <= 0) throw "Number of variant must greater than 0.";
          for (
            var t = Math.floor((a + r - 1) / r), h = [], i = [], s = 0;
            s < t;
            s++
          )
            h.push(0), i.push(4294967295);
          return { empty: h, full: i };
        })(this._variants.length),
        m = {};
      for (h = 0; h < this._paramSchema.length; h++) {
        for (s = 0; s < this._paramSchema[h]; s++) {
          var l = [];
          this._matrix.push(l),
            (this._matrixIndexParamSchemaMap[e + s] = [h, s]),
            (m[h] = m[h] || {}),
            (m[h][s] = e + s);
          for (var o = 0; o < this._paramSchema.length; o++)
            for (var f = 0; f < this._paramSchema[o]; f++)
              if (h !== o) {
                var _ = n.empty.slice();
                l.push(_);
              } else l.push(n.full);
        }
        e += this._paramSchema[h];
      }
      for (h = 0; h < this._variants.length; h++)
        for (i = this._variants[h], s = 0; s < i.length - 1; s++) {
          var p, v;
          i[s] < 0
            ? ((p = m[s][0]), (v = m[s][this._paramSchema[s] - 1]))
            : (v = p = m[s][i[s]]);
          for (var c = p; c <= v; c++)
            for (o = s + 1; o < i.length; o++) {
              var u, g;
              i[o] < 0
                ? ((u = m[o][0]), (g = m[o][this._paramSchema[o] - 1]))
                : (g = u = m[o][i[o]]);
              for (var S = u; S <= g; S++)
                t(this._matrix[c][S], h), t(this._matrix[S][c], h);
            }
        }
    }
  };
(s.prototype.getAllOptionalParams = function () {
  if (this._allValidParams) return this._allValidParams;
  for (var r = [], t = 0; t < this._variants.length; t++)
    for (var h = 0; h < this._variants[t].length; h++)
      r[h] = a(r[h] || [], [this._variants[t][h]]);
  for (t = 0; t < r.length; t++) r[t].sort();
  return (this._allValidParams = r), r;
}),
  (s.prototype.calculateOptionalParams = function (a) {
    for (var r = 0, t = [], s = 0; s < a.length; s++) {
      if (a[s] >= 0 && a[s] < this._paramSchema[s]) {
        var e = r + a[s];
        t.push(this._matrix[e]);
      }
      r += this._paramSchema[s];
    }
    if (0 === t.length) return this.getAllOptionalParams();
    var n = [];
    t.forEach((a) => {
      for (var r = 0; r < a.length; r++)
        void 0 === n[r] ? (n[r] = a[r]) : i(n[r]) || (n[r] = h(n[r], a[r]));
    });
    var m = [];
    for (s = 0; s < n.length; s++) {
      var l = this._matrixIndexParamSchemaMap[s],
        o = l[0],
        f = l[1];
      (m[o] = m[o] || []), i(n[s]) || m[o].push(f);
    }
    return m;
  });
export { s as default };
