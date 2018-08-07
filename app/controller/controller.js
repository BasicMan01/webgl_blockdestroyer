var Controller = (function() {
	'use strict';

	var Controller = function() {
		var self = this;
		var urlParams = new URLSearchParams(window.location.search);

		this.model = new Blockdestroyer({sizeX: 10, sizeY: 10});

		if (urlParams.get('mode') === '3D') {
			this.view = new View3D(this.model);

			document.getElementById('tab2D').className = 'tab';
			document.getElementById('tab3D').className = 'tab active';
		} else {
			this.view = new View2D(this.model);

			document.getElementById('tab2D').className = 'tab active';
			document.getElementById('tab3D').className = 'tab';
		}

		this.view.bindHandler('newGame', function() {
			self.newGame();
		});

		this.view.bindHandler('triggerBlock', function(x, y) {
			self.triggerBlock(x, y);
		});

		this.view.show();
	};

	Controller.prototype.newGame = function() {
		this.model.newGame();
		this.view.show();
	};

	Controller.prototype.triggerBlock = function(x, y) {
		var canMove = this.model.canMove();

		if(canMove) {
			this.model.triggerBlock(parseInt(x), parseInt(y));
		}

		this.view.show();
	};

	return Controller;
}());
