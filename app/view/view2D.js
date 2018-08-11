var View2D = (function() {
	var View = function(model) {
		this.model = model;

		this.colors = ['000000', 'FF8888', '88FF88', '8888FF', 'FFFF88'];

		this.buttonNewGame = document.getElementById('newGame');
		this.gameArea = document.getElementById('gameArea');

		document.getElementById('tab2D').addEventListener('click', function() {
			window.location.href = '?mode=2D';
		});

		document.getElementById('tab3D').addEventListener('click', function() {
			window.location.href = '?mode=3D';
		});
	};

	View.prototype.bindHandler = function(action, handler) {
		if(typeof handler !== 'function') {
			return;
		}

		switch(action) {
			case 'newGame': {
				this.buttonNewGame.addEventListener('click', function(event) {
					handler();
				});
			} break;

			case 'triggerBlock': {
				this.gameArea.addEventListener('click', function(event) {
					var target = event.target;

					if (target.nodeName === 'TD') {
						handler(target.dataset.x, target.dataset.y);
					}
				});
			} break;
		}
	};

	View.prototype.show = function() {
		var html = [];

		html[html.length] = '<table cellspacing="0" cellpadding="0" border="1">';

		for(var y = this.model.blocks.length - 1; y >= 0; y--) {
			html[html.length] = '<tr>';

			for(var x = 0; x < this.model.blocks[y].length; x++) {
				html[html.length] = '<td data-x="' + x + '" data-y="' + y + '" ';
				html[html.length] = 'style="width:50px; height:50px; background-color:#' + this.colors[this.model.blocks[y][x]+1] + ';">&nbsp;</td>';
			}

			html[html.length] = '</tr>';
		}
		html[html.length] = '</table>';

		document.getElementById('gameArea').innerHTML = html.join('');
		document.getElementById('bombsInfo').innerHTML = this.model.bombs;
		document.getElementById('levelInfo').innerHTML = this.model.level;
		document.getElementById('pointsInfo').innerHTML = this.model.points;

		if(!this.model.canMove()) {
			document.getElementById('gameOver').innerHTML = 'GAME OVER';
		} else {
			document.getElementById('gameOver').innerHTML = '';
		}
	};

	return View;
}());

export default View2D;
