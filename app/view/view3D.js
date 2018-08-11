import * as THREE from '../../lib/threejs_95/three.module.js';

var View3D = (function() {
	var View = function(model) {
		this.model = model;

		this.buttonNewGame = document.getElementById('newGame');
		this.gameArea = document.getElementById('gameArea');

		document.getElementById('tab2D').addEventListener('click', function() {
			window.location.href = '?mode=2D';
		});

		document.getElementById('tab3D').addEventListener('click', function() {
			window.location.href = '?mode=3D';
		});


		this.canvas = document.createElement('div');
		this.canvas.style.width = '500px';
		this.canvas.style.height = '500px';

		this.gameArea.appendChild(this.canvas);



		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(70, this.getCameraAspect(), 1, 1000);
		this.camera.position.set(11, 8.5, 20);
		this.camera.rotation.set(0, 0.45, 0);

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.getGameAreaWidth(), this.getGameAreaHeight());

		this.canvas.appendChild(this.renderer.domElement);

		this.intersectMeshs = [];
		this.meshs = [];
		this.raycaster = new THREE.Raycaster();
		this.textures = [];

		var geometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
		var textureLoader =  new THREE.TextureLoader();

		this.textures[0] = textureLoader.load('resources/texture/1.png');
		this.textures[1] = textureLoader.load('resources/texture/2.png');
		this.textures[2] = textureLoader.load('resources/texture/3.png');
		this.textures[3] = textureLoader.load('resources/texture/4.png');

		for(var y = 0; y < this.model.blocks.length; y++) {
			this.meshs[y] = [];

			for(var x = 0; x < this.model.blocks[y].length; x++) {
				var mesh = new THREE.Mesh(geometry);

				mesh.position.set(x * 2 - 9, y * 2, 1);
				mesh.scale.set(2, 2, 2);
				mesh.userData.x = x;
				mesh.userData.y = y;

				this.scene.add(mesh);
				this.meshs[y][x] = mesh;
			}
		}

		this.render();
	};

	View.prototype.bindHandler = function(action, handler) {
		var self = this;

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
					self.raycaster.setFromCamera(self.getMouseVector2(), self.camera);

					var intersects = self.raycaster.intersectObjects(self.intersectMeshs, true);

					if (intersects.length > 0) {
						var firstObject = intersects[0].object;

						handler(firstObject.userData.x, firstObject.userData.y);
					}
				});

			} break;
		}
	};

	View.prototype.show = function() {
		this.updateData();

		document.getElementById('bombsInfo').innerHTML = this.model.bombs;
		document.getElementById('levelInfo').innerHTML = this.model.level;
		document.getElementById('pointsInfo').innerHTML = this.model.points;

		if(!this.model.canMove()) {
			document.getElementById('gameOver').innerHTML = 'GAME OVER';
		} else {
			document.getElementById('gameOver').innerHTML = '';
		}

		// optional call of render() if no render loop is available
	};

	View.prototype.render = function() {
		requestAnimationFrame(this.render.bind(this));

		this.renderer.render(this.scene, this.camera);
	};

	View.prototype.updateData = function() {
		this.intersectMeshs = [];

		for(var y = 0; y < this.model.blocks.length; y++) {
			for(var x = 0; x < this.model.blocks[y].length; x++) {
				if (this.model.blocks[y][x] > -1) {
					var material = new THREE.MeshBasicMaterial({ map: this.textures[this.model.blocks[y][x]] });

					this.meshs[y][x].visible = true;
					this.meshs[y][x].material = material;

					this.intersectMeshs.push(this.meshs[y][x]);
				} else {
					this.meshs[y][x].visible = false;
				}
			}
		}
	};

	View.prototype.getGameAreaHeight = function() { return this.canvas.offsetHeight; };
	View.prototype.getGameAreaWidth = function() { return this.canvas.offsetWidth; };

	View.prototype.getCameraAspect = function() { return this.getGameAreaWidth() / this.getGameAreaHeight(); };

	View.prototype.getMouseVector2 = function() {
		var rect = this.canvas.getBoundingClientRect();
		var mouseVector2 = new THREE.Vector2();

		mouseVector2.x = ((event.clientX - rect.left) / this.getGameAreaWidth()) * 2 - 1;
		mouseVector2.y = -((event.clientY - rect.top) / this.getGameAreaHeight()) * 2 + 1;

		return mouseVector2;
	};

	return View;
}());

export default View3D;
