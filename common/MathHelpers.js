const MATH_HELPERS = {
  getDistance: function (x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    var c = Math.sqrt(a * a + b * b);
    return c;
  },
  getDistanceVec2: function (vec1, vec2) {
    var a = vec1.x - vec2.x;
    var b = vec1.y - vec2.y;

    var c = Math.sqrt(a * a + b * b);
    return c;
  },
  getAngleRadians: function(vec1, vec2) {
    return Math.atan2(vec1.y - vec2.y, vec1.x - vec2.x);
  }
};

export default MATH_HELPERS;
