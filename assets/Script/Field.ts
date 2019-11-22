const {ccclass, property} = cc._decorator;

@ccclass
export default class Field extends cc.Component {
	@property
	maxWidthPercent: number = .5;

	@property
	maxHeightPercent: number = .8;

	@property
	xPercent: number = .3;

	@property
	padding: number = 60;

	@property
	columnsNum: number = 5;

	@property
	rowsNum: number = 5;

	@property
	minGroupSize: number = 2;

	@property
	prefabSize: number = 171;

	@property([cc.Prefab])
	blocksPrefabs: cc.Prefab[] = [];

	blocksContainer: cc.Node;
	grid: object = {};

	start() {
		Block.prefabs = this.blocksPrefabs;
		this.alignNode();
		this.initBlocksContainer();
	}

	alignNode() {
		this.node.height = (this.rowsNum / this.columnsNum) * (this.node.width - this.padding * 2) + this.padding * 2;
		const nodeScaleByWidth: number = this.node.parent.width * this.maxWidthPercent / this.node.width;
		const nodeScaleByHeight: number = this.node.parent.height * this.maxHeightPercent / this.node.height;
		this.node.scale = Math.min(nodeScaleByWidth, nodeScaleByHeight);
		this.node.x = -this.node.parent.width / 2 + this.node.parent.width * this.xPercent;
	}

	initBlocksContainer() {
		this.blocksContainer = new cc.Node();
		this.node.addChild(this.blocksContainer);
		this.fillBlocksContainer();
		this.alignBlocksContainer();
	}

	fillBlocksContainer() {
		for (let row: number = 0; row < this.rowsNum; row++) {
			for (let column: number = 0; column < this.columnsNum; column++) {
				let randomBlock: Block = this.createRandomBlock();
				randomBlock.row = row;
				randomBlock.column = column;
				this.registerBlockInGrid(randomBlock);
				randomBlock.x = this.prefabSize * column;
				randomBlock.y = this.prefabSize * row;
				this.blocksContainer.addChild(randomBlock);
				randomBlock.getNode().on(cc.Node.EventType.TOUCH_START, function () { this.onBlockTouch(randomBlock); }, this);
			}
		}
	}

	onBlockTouch(block: Block) {
		const group: Block[] = this.calculateBlockGroup(block);
		if (group.length >= this.minGroupSize) {
			group.forEach(this.removeBlock.bind(this));
		}
	}

	calculateBlockGroup(block: Block) {
		let group: Block[] = [block];
		let alreadyCheckedKeys: object = { [this.getGridKey(block.column, block.row)]: true };

		let checkBlockNeighbors = function (checkedBlock: Block) {
			checkNeighbor.bind(this)(checkedBlock.column - 1, checkedBlock.row);
			checkNeighbor.bind(this)(checkedBlock.column + 1, checkedBlock.row);
			checkNeighbor.bind(this)(checkedBlock.column, checkedBlock.row - 1);
			checkNeighbor.bind(this)(checkedBlock.column, checkedBlock.row + 1);
		}

		let checkNeighbor = function (neighborColumn: number, neighborRow: number) {
			let gridKey: string = this.getGridKey(neighborColumn, neighborRow);
			if (!alreadyCheckedKeys[gridKey]) {
				alreadyCheckedKeys[gridKey] = true;
				let neighbor: Block = this.grid[gridKey];
				if (neighbor && neighbor.prefabIndex == block.prefabIndex) {
					group.push(neighbor);
					checkBlockNeighbors.bind(this)(neighbor);
				}
			}
		}

		checkBlockNeighbors.bind(this)(block);
		return group;
	}

	removeBlock(block: Block) {
		block.parent.removeChild(block);
		this.unregisterBlockFromGrid(block);
		this.removeBlockListeners(block);
	}

	alignBlocksContainer() {
		const totalBlocksWidth: number = this.prefabSize * this.columnsNum;
		const totalBlocksHeight: number = this.prefabSize * this.rowsNum;
		this.blocksContainer.scaleX = (this.node.width - this.padding * 2) / totalBlocksWidth;
		this.blocksContainer.scaleY = (this.node.height - this.padding * 2) / totalBlocksHeight;
		this.blocksContainer.x = -(totalBlocksWidth * this.blocksContainer.scaleX) / 2;
		this.blocksContainer.y = -(totalBlocksHeight * this.blocksContainer.scaleY) / 2;
	}

	createRandomBlock(): Block {
		return new Block();
	}

	registerBlockInGrid(block: Block) {
		this.grid[this.getGridKey(block.column, block.row)] = block;
	}

	unregisterBlockFromGrid(block: Block) {
		this.grid[this.getGridKey(block.column, block.row)] = null;
	}

	getGridKey(column: number, row: number): string {
		return column + 'x' + row;
	}

	onDestroy() {
		this.removeAllBlocksListeners();
	}

	removeAllBlocksListeners() {
		for (let key in this.grid) {
			let block: Block = this.grid[key];
			if (block) {
				this.removeBlockListeners(block);
			}
		}
	}

	removeBlockListeners(block: Block) {
		block.getNode().off(cc.Node.EventType.TOUCH_START);
	}
}

class Block extends cc.Node {
	public static prefabs: cc.Prefab[];
	public column: number;
	public row: number;
	public prefabIndex: number;
	private node: cc.Node;

	constructor() {
		super();
		this.prefabIndex = Math.floor(Math.random() * Block.prefabs.length);
		this.node = cc.instantiate(Block.prefabs[this.prefabIndex]);
		this.addChild(this.node);
	}

	getNode(): cc.Node {
		return this.node;
	}
}