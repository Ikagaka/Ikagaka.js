self.onmessage = function(e) {
  var b, g, i, imgdata, r, _ref;
  imgdata = e.data;
  i = 0;
  _ref = [imgdata.data[0], imgdata.data[1], imgdata.data[2]], r = _ref[0], g = _ref[1], b = _ref[2];
  while (i < imgdata.data.length) {
    if (r === imgdata.data[i] && g === imgdata.data[i + 1] && b === imgdata.data[i + 2]) {
      imgdata.data[i + 3] = 0;
    }
    i += 4;
  }
  self.postMessage(imgdata);
};