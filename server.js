var http = require("http");
var fs = require("fs");
var qs = require("querystring")

var serverDB = {
    map: {}
}

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            console.log(`requested adres: ${decodeURI(req.url)}`)
            var fileEXTEN = req.url.split(".")[req.url.split(".").length - 1]
            if (req.url == "/") {
                fs.readFile(`./static/index.html`, function (error, data) {
                    if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' });
                        res.write(data);
                        res.end();
                        console.log("sent index");
                    }
                })
            }
            else if (req.url == "/game") {
                fs.readFile(`./static/html/game.html`, function (error, data) {
                    if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' });
                        res.write(data);
                        res.end();
                        console.log("sent game");
                    }
                })
            }
            else {
                fs.readFile(`.${decodeURI(req.url)}`, function (error, data) {
                    if (error) {
                        console.log(`cant find file ${decodeURI(req.url)}`);
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>Error 404 - file doesnt exist<h1>");
                        res.end();
                    }
                    else {
                        switch (fileEXTEN) {
                            case "css":
                                res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
                                break;
                            case "html":
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                                break;
                            case "js":
                                res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });
                                break;
                            case "png":
                                res.writeHead(200, { 'Content-Type': 'image/png' });
                                break;
                            case "jpg":
                                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                                break;
                            case "mp3":
                                res.writeHead(200, { "Content-type": "audio/mpeg" });
                                break
                            default:
                                res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                        }
                        res.write(data);
                        res.end();
                        console.log(`sent file: ${decodeURI(req.url)}`)
                    }
                });
            }
            break;
        case "POST":
            /* if (req.url == "/saveLevel") {
                saveLevel(req, res)
            }
            else if (req.url == "/loadLevel") {
                loadlevel(req, res)
            }
            else {
                throw "wrong POST url"
            } */
            break;
        default:
            break;
    }

})
// function servResponse(req, res) {
//     var allData = "";
//     req.on("data", function (data) {
//         //console.log("data: " + data)
//         allData += data;
//     })
//     req.on("end", function (data) {
//         var finish = qs.parse(allData)
//         //console.log(finish)
//         var reply = {
//             ok: "OK"
//         }
//         //res.writeHead(200, { 'Content-Type': 'text/plain;;charset=utf-8' });
//         res.end(JSON.stringify(reply));
//     })
// }

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
