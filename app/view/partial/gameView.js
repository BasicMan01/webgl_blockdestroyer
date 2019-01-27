import helper from '../../../lib/rdo/helper.js';

import BaseView from './baseView.js';

class GameView extends BaseView {
	constructor(mainView, model) {
		super();

		this.mainView = mainView;
		this.model = model;

		this.navToMenuButton = null;
		this.textLabelLevel = null;
		this.textLabelBombs = null;
		this.textLabelPoints = null;
		this.textValueLevel = null;
		this.textValueBombs = null;
		this.textValuePoints = null;

		this.intersectMeshs = [];
		this.intersectGameMeshs = [];

		this.container = new THREE.Group();
		this.blocks = [];

		this.scene = new THREE.Scene();

		this.createObjects();
	}

	createObjects() {
		let geometryBlock = new THREE.CubeGeometry(1, 1, 1);

		this.navToMenuButton = this.mainView.addTextBasePlane(this.scene);
		this.textLabelLevel = this.mainView.addTextBasePlane(this.scene);
		this.textLabelBombs = this.mainView.addTextBasePlane(this.scene);
		this.textLabelPoints = this.mainView.addTextBasePlane(this.scene);
		this.textValueLevel = this.mainView.addTextBasePlane(this.scene);
		this.textValueBombs = this.mainView.addTextBasePlane(this.scene);
		this.textValuePoints = this.mainView.addTextBasePlane(this.scene);

		this.navToMenuButton.userData.actionHandler = 'navToMenuAction';

		this.intersectMeshs.push(this.navToMenuButton);

		this.container.position.set(0, 0, 0);
		this.container.scale.set(2, 2, 2);
		this.container.rotation.set(0, -0.45, 0);

		this.scene.add(this.container);

		for (let y = 0; y < this.model.blocks.length; y++) {
			this.blocks[y] = [];

			for (let x = 0; x < this.model.blocks[y].length; x++) {
				this.blocks[y][x] = new THREE.Mesh(geometryBlock);
				this.blocks[y][x].position.set(x - 4.5, y - 4.5, 1);
				this.blocks[y][x].userData.actionHandler = 'removeBlockAction';
				this.blocks[y][x].userData.x = x;
				this.blocks[y][x].userData.y = y;
				this.blocks[y][x].material = new THREE.MeshBasicMaterial({transparent: true});

				this.container.add(this.blocks[y][x]);
			}
		}
	}

	readjustLimit() {
		if (this.container.rotation.x > 0) {
			this.container.rotation.x = 0;
		} else if (this.container.rotation.x < -Math.PI / 2) {
			this.container.rotation.x = -Math.PI / 2;
		}
		
		if (this.container.scale.x < 2) {
			this.container.scale.set(2, 2, 2);
		} else if (this.container.scale.x > 4) {
			this.container.scale.set(4, 4, 4);
		}
	}

	rotateGameBoard(vec) {
		this.container.rotation.y += vec.x * 2;

		this.readjustLimit();
	}
	
	scaleGameBoard(val) {
		this.container.scale.x += val;
		this.container.scale.y += val;
		this.container.scale.z += val;
		
		this.readjustLimit();
	}

	show() {
		this.updateTextures();
	}

	updateTextures() {
		let texts = this.mainView.config.texts;
		
		this.mainView.fontTexture.setTextureToObject(
			this.navToMenuButton,
			{text: '\u25C4 ' + texts.navigationMenu, x: -16, y: -13, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelLevel,
			{text: texts.gameLevel + ':', x: 7, y: 13, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValueLevel,
			{text: helper.pad0(this.model.level, 2), x: 14, y: 13, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelBombs,
			{text: texts.gameBombs + ':', x: 7, y: 11.5, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValueBombs,
			{text: helper.pad0(this.model.bombs, 2), x: 14, y: 11.5, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelPoints,
			{text: texts.gamePoints + ':', x: 7, y: 10.0, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValuePoints,
			{text: helper.pad0(this.model.points, 6), x: 14, y: 10.0, align: 'right'}
		);

		this.intersectGameMeshs = [];

		for (let y = 0; y < this.model.blocks.length; y++) {
			for (let x = 0; x < this.model.blocks[y].length; x++) {
				if (this.model.blocks[y][x] > -1) {
					this.blocks[y][x].material.map = this.mainView.textureManager.get(this.model.blocks[y][x].toString());
					this.blocks[y][x].visible = true;

					this.intersectGameMeshs.push(this.blocks[y][x]);
				} else {
					this.blocks[y][x].visible = false;
				}
			}
		}
	}
}

export default GameView;