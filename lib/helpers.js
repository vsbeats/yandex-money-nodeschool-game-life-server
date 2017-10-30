const url = require('url');

/**
 * Хэлпер выдёргивающий токен из урла
 * @throws
 * @param  {Object} req
 * @return {String}
 */
function getToken(req) {
  const {query} = url.parse(req.url, true);
  return query.token;
}

/**
 * Возвращает рандомный цвет в формате #000 - #FFF
 * @return {String} цвет
 */
function randColor(){
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

module.exports = { getToken, randColor };
