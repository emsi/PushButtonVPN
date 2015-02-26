var express = require('express');

var app = express();

app.set('port', 3000); // port to listen on


function registerCall(url,command,args)
{
	app.get(url,function(req,res) {
		var spawn = require('child_process').spawn;
		var process = spawn(command, args);
		
		res.setHeader('Connection', 'Transfer-Encoding');
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Transfer-Encoding', 'chunked');	
		res.write(url+"</br>");

		writeData=function (data) {
			var str = data.toString();
			console.log(str);
			str = str.replace(/[\n\r]/gm,"</br>");
			res.write(str);
		}
		
		process.stdout.setEncoding('utf8');
		process.stdout.on('data',writeData);

		process.stderr.setEncoding('utf8');
		process.stderr.on('data', writeData);

		process.on('close',function(code) {
			console.log('process exit code ' + code);
			res.setTimeout(1);
		});
	});
}

registerCall('/vagrantUp', 'vagrant', ['up']);
registerCall('/vagrantStatus', 'vagrant', ['status']);
registerCall('/vagrantDestroy', 'vagrant', ['destroy', '-f']);

app.get('/',function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/plain'})
	res.write('GO AWAY!\n');
	res.end('AWAY!');
});

app.use(function(req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(app.get('port'),function() {
	console.log('Started on port '+app.get('port')+'.');
});
