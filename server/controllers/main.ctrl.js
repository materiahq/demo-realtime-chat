const url = require('url');

class mainCtrl {
	constructor(app) {
		this.app = app;
		this.users = [];
		this.id = 0;
	}


	websocket(wss) {
		wss.instance.on('connection', (ws, req) => {
			const parameters = url.parse(req.url, true);
			ws.nickname = parameters.query.nickname;
			ws.id = this.id++;

			const leave = () => {
				this.users = this.users.filter(user => user.id !== ws.id);
				wss.broadcast({
					type: 'LEAVE',
					nickname: ws.nickname,
					id: ws.id
				});
			}

			const join = () => {
				this.users = [...this.users, {
					nickname: ws.nickname,
					id: ws.id
				}];

				wss.broadcast({
					type: 'JOIN',
					nickname: ws.nickname,
					id: ws.id
				});
			}

			ws.send(JSON.stringify({
				type: 'REFRESH',
				users: this.users
			}));

			join();

			ws.on('message', (message) => {
				const data = JSON.parse(message);
				wss.broadcast({
					type: 'MESSAGE',
					data: data.data,
					nickname: ws.nickname,
					id: ws.id
				});
			});

			ws.on('close', () => {
				leave()
			})
		});
	}
}

module.exports = mainCtrl;
