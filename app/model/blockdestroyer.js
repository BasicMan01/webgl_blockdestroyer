class Blockdestroyer {
	constructor(config) {
		// configuration part
		config = config || {};
		this.sizeX = config.sizeX || 10;
		this.sizeY = config.sizeY || 10;

		this.blocks = [];

		this.newGame();
	}

	calculatePointsByBlockCount(countOfBlocks) {
		let pointsPerBlock = 0;

		for (let c = 1; c < countOfBlocks; c++) {
			pointsPerBlock += c * 10;
		}

		return pointsPerBlock;
	}

	canMove() {
		if (this.bombs > 0)
			return true;

		for (let y = 0; y < this.sizeY - 1; y++) {
			for (let x = 0; x < this.sizeX - 1; x++) {
				if (this.blocks[y][x] !== -1) {
					if (this.blocks[y][x] === this.blocks[y][x+1] || this.blocks[y][x] === this.blocks[y+1][x]) {
						return true;
					}
				}
			}
		}

		return false;
	}

	createBlocks() {
		for (let y = 0; y < this.sizeY; y++) {
			this.blocks[y] = [];

			for (var x = 0; x < this.sizeX; x++) {
				this.blocks[y][x] = Math.floor(Math.random() * 100) % 4;
			}
		}
	}

	displace() {
		let x, y, z, temp;

		for (y = 1; y < this.sizeY; y++) {
			for (x = 0; x < this.sizeX; x++) {
				if (this.blocks[y][x] !== -1) {
					z = 1;

					while ((y-z) >= 0 && this.blocks[y-z][x] === -1)	{
						temp = this.blocks[y-z][x];
						this.blocks[y-z][x] = this.blocks[y-(z-1)][x];
						this.blocks[y-(z-1)][x] = temp;

						z++;
					}
				}
			}
		}

		for (x = 1; x < this.sizeX; x++)	{
			if (this.blocks[0][x] !== -1) {
				z = 1;

				while (x >= z && this.blocks[0][x-z] === -1)	{
					for (y = 0; y < this.sizeY; y++) {
						if (this.blocks[y][x-(z-1)] !== -1) {
							temp = this.blocks[y][x-(z-1)];
							this.blocks[y][x-(z-1)] = this.blocks[y][x-z];
							this.blocks[y][x-z] = temp;
						}
					}
					z++;
				}
			}
		}

		if (this.blocks[0][0] === -1)
			this.newLevel();
	}

	isSingleBlock(x, y) {
		let value = this.blocks[y][x];

		if (x + 1 < this.sizeX && this.blocks[y][x+1] === value)
			return false;

		if (x - 1 >= 0 && this.blocks[y][x-1] === value)
			return false;

		if (y + 1 < this.sizeY && this.blocks[y+1][x] === value)
			return false;

		if (y - 1 >= 0 && this.blocks[y-1][x] === value)
			return false;

		return true;
	};

	newGame() {
		this.level = 1;
		this.points = 0;
		this.bombs = 3;
		this.mark = 10000;

		this.createBlocks();
	}

	newLevel() {
		this.level++;
		this.bombs++;

		this.createBlocks();
	}

	remove(x, y, value, countOfBlocks) {
		this.blocks[y][x] = -1;
		countOfBlocks++;

		// left part
		if (x - 1 >= 0 && this.blocks[y][x-1] === value) {
			countOfBlocks = this.remove(x - 1, y, value, countOfBlocks);
		}

		// right part
		if (x + 1 < this.sizeX && this.blocks[y][x+1] === value) {
			countOfBlocks = this.remove(x + 1, y, value, countOfBlocks);
		}

		// bottom part
		if (y - 1 >= 0 && this.blocks[y-1][x] === value) {
			countOfBlocks = this.remove(x, y - 1, value, countOfBlocks);
		}

		// top part
		if (y + 1 < this.sizeY && this.blocks[y+1][x] === value) {
			countOfBlocks = this.remove(x, y + 1, value, countOfBlocks);
		}

		return countOfBlocks;
	}

	triggerBlock(x, y) {
		if (this.blocks[y][x] !== -1) {
			let countOfBlocks = 0;

			if (this.isSingleBlock(x, y)) {
				if (this.bombs > 0) {
					this.bombs--;
					this.blocks[y][x] = -1;
				}
			} else {
				countOfBlocks = this.remove(x, y, this.blocks[y][x], countOfBlocks);
			}

			this.points += this.calculatePointsByBlockCount(countOfBlocks);

			if (this.points >= this.mark) {
				this.bombs++;
				this.mark += 10000;
			}

			this.displace();
		}
	}
}

export default Blockdestroyer;
