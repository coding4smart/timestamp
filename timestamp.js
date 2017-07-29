/*
 * timestamp microservice,
 *
 * tangjicheng@gmail.com
 *
 * accepts a request url and see whether 
 * that string contains either a unix timestamp or a natural language date 
 * (example: December 15, 2015).
 *
 * returns { "unix": 1450137600, "natural": "December 15, 2015" }.
 *
 */


//var naturegex = /^(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))/
var unixregex = /\d{10,11}/;
var naturegex = /^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}/;

var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
var http = require('http');
var dateReturn = {};

var monthNames= [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

var server = http.createServer(function (req,res) {
  var url = req.url.replace('/','').replace(/(?:%20|\s)/g,' ');
  var matchNature = naturegex.test(url);
  var matchUnix = unixregex.test(url);

  if(matchNature) {
    var natural = url.match(naturegex)[0];
    var unix = 	Math.round(new Date(natural).getTime()/1000.0);
  } else if(matchUnix) {
    var u = url.match(unixregex)[0];
    var unix = parseInt(u);
    var dat = new Date(unix*1000);
    var natural = monthNames[dat.getMonth()+12]+" "+dat.getDate()+", "+dat.getFullYear();
  } else {
    unix = null;
    natural = null;
  }
  dateReturn = {"unix":unix,"natural":natural};
  console.log(dateReturn);
  if(dateReturn) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dateReturn));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(process.env.PORT);