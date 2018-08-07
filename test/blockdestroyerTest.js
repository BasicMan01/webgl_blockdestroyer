import Blockdestroyer from "../app/model/blockdestroyer.js";

QUnit.test("Blockdestroyer.calculatePointsByBlockCount(value)", function(assert) {
	let bd = new Blockdestroyer({sizeX: 3, sizeY: 3});

	assert.equal(bd.calculatePointsByBlockCount(-1), 0, '-1 => 0 points');
	assert.equal(bd.calculatePointsByBlockCount(0), 0, '0 => 0 points');
	assert.equal(bd.calculatePointsByBlockCount(1), 0, '1 => 0 points');
	assert.equal(bd.calculatePointsByBlockCount(2), 10, '2 => 10 points');
	assert.equal(bd.calculatePointsByBlockCount(3), 30, '3 => 30 points');
	assert.equal(bd.calculatePointsByBlockCount(5), 100, '5 => 100 points');
});

QUnit.test("Blockdestroyer.isSingleBlock(x, y)", function(assert) {
	let bd = new Blockdestroyer({sizeX: 3, sizeY: 3});

	bd.blocks = [
		[3, 1, 1],
		[3, 2, 1],
		[1, 3, 3]
	];

	assert.equal(bd.isSingleBlock(1, 0), false);
	assert.equal(bd.isSingleBlock(1, 1), true);
	assert.equal(bd.isSingleBlock(0, 2), true);
	assert.equal(bd.isSingleBlock(2, 2), false);
});

QUnit.test("Blockdestroyer.remove(x, y, block[y][x], 0)", function(assert) {
	let bd = new Blockdestroyer({sizeX: 3, sizeY: 3});

	bd.blocks = [
		[3, 1, 1],
		[3, 2, 1],
		[1, 3, 3]
	];

	assert.equal(bd.remove(0, 0, bd.blocks[0][0], 0), 2);
	assert.equal(bd.remove(1, 1, bd.blocks[1][1], 0), 1);
	assert.equal(bd.remove(2, 0, bd.blocks[0][2], 0), 3);
});
