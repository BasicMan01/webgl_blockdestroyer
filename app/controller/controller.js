import Blockdestroyer from "../model/blockdestroyer.js";
import View from "../view/view2D.js";

var Controller = (function() {
	var Controller = function() {
		var self = this;

		this.model = new Blockdestroyer({sizeX: 10, sizeY: 10});
		this.view = new View(this.model);

		this.view.bindHandler('newGame', function() {
			self.newGame();
		});

		this.view.bindHandler('triggerBlock', function(x, y) {
			self.triggerBlock(x, y);
		});

		this.view.render();
	};

	Controller.prototype.newGame = function() {
		this.model.newGame();
		this.view.render();
	};

	Controller.prototype.triggerBlock = function(x, y) {
		var canMove = this.model.canMove();

		if(canMove) {
			this.model.triggerBlock(parseInt(x), parseInt(y));
		}

		this.view.render();
	};

	return Controller;
})();

export default Controller;
