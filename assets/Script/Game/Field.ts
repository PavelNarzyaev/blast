import Model from "../Model";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Field extends cc.Component {
	@property
	blocksMovingSpeed: number = 100;

	@property
	columnsNum: number = 5;

	@property
	rowsNum: number = 5;

	@property
	minGroupSize: number = 2;

	@property
	prefabSize: number = 171;

	@property(cc.Node)
	viewport: cc.Node = null;

	@property([cc.Prefab])
	blocksPrefabs: cc.Prefab[] = [];

	grid: object = {}; // key = "{column}x{row}" value = block
	animatedBlocks: object = {}; // key = "block.id" value = block

	onLoad() {
		this.node.on(cc.Node.EventType.SIZE_CHANGED, this.alignViewport, this);
	}

	alignViewport() {
		const totalBlocksWidth: number = this.prefabSize * this.columnsNum;
		const totalBlocksHeight: number = this.prefabSize * this.rowsNum;
		this.viewport.scaleY = (this.node.height - this.calculateViewportVerticalMargins()) / totalBlocksHeight;
		this.viewport.scaleX = (this.node.width - this.calculateViewportHorizontalMargins()) / totalBlocksWidth;
	}

	start() {
		Block.prefabs = this.blocksPrefabs;
		this.fillViewport();
	}

	fillViewport() {
		for (let row: number = 0; row < this.rowsNum; row++) {
			for (let column: number = 0; column < this.columnsNum; column++) {
				this.createBlock(
					this.prefabSize * column,
					this.prefabSize * row,
					column,
					row
				);
			}
		}
	}

	createBlock(x: number, y: number, column: number, row: number, animationCallerBlock: Block = null) {
		let newBlock: Block = new Block();
		newBlock.x = x;
		newBlock.y = y;
		newBlock.column = column;
		newBlock.row = row;
		this.registerBlockInGrid(newBlock);
		if (animationCallerBlock) {
			this.startBlockAnimation(newBlock, animationCallerBlock);
		}
		this.viewport.addChild(newBlock);
		newBlock.getNode().on(cc.Node.EventType.TOUCH_START, function () { this.onBlockTouch(newBlock); }, this);
	}

	onBlockTouch(block: Block) {
		const group: Block[] = this.calculateBlockGroup(block);
		if (group.length >= this.minGroupSize) {
			Model.addPointsForGroup(group.length);
			let emptyCellsInColumns: object = {};
			while (group.length) {
				let removedBlock: Block = group.pop();
				this.removeBlock(removedBlock);
				this.refreshAnimations(block, removedBlock);
				if (!emptyCellsInColumns[removedBlock.column]) {
					emptyCellsInColumns[removedBlock.column] = 1;
				} else {
					emptyCellsInColumns[removedBlock.column]++;
				}
			}
			this.createTopBlocks(emptyCellsInColumns, block);
		}
	}

	calculateBlockGroup(block: Block) {
		let group: Block[] = [block];
		let alreadyCheckedKeys: object = { [this.getGridKey(block.column, block.row)]: true };

		let checkBlockNeighbors = function (checkedBlock: Block) {
			checkNeighborBlock.bind(this)(checkedBlock.column - 1, checkedBlock.row);
			checkNeighborBlock.bind(this)(checkedBlock.column + 1, checkedBlock.row);
			checkNeighborBlock.bind(this)(checkedBlock.column, checkedBlock.row - 1);
			checkNeighborBlock.bind(this)(checkedBlock.column, checkedBlock.row + 1);
		}

		let checkNeighborBlock = function (neighborColumn: number, neighborRow: number) {
			let gridKey: string = this.getGridKey(neighborColumn, neighborRow);
			if (!alreadyCheckedKeys[gridKey]) {
				alreadyCheckedKeys[gridKey] = true;
				let neighborBlock: Block = this.grid[gridKey];
				if (
					neighborBlock &&
					neighborBlock.prefabIndex == block.prefabIndex &&
					neighborBlock.getAnimationCallerId() == block.getAnimationCallerId() // not animated blocks or animated in one time
				) {
					group.push(neighborBlock);
					checkBlockNeighbors.bind(this)(neighborBlock);
				}
			}
		}

		checkBlockNeighbors.bind(this)(block);
		return group;
	}

	removeBlock(block: Block) {
		this.stopBlockAnimation(block);
		block.parent.removeChild(block);
		this.unregisterBlockFromGrid(block);
		this.removeBlockListeners(block);
	}

	refreshAnimations(animationCallerBlock: Block, removedBlock: Block) {
		for (let row: number = removedBlock.row; row < this.rowsNum; row++) {
			let animatedBlock: Block = this.getBlockFromGrid(removedBlock.column, row);
			if (animatedBlock) {
				this.unregisterBlockFromGrid(animatedBlock);
				animatedBlock.row--;
				this.registerBlockInGrid(animatedBlock);
				this.startBlockAnimation(animatedBlock, animationCallerBlock);
			}
		}
	}

	startBlockAnimation(animatedBlock: Block, animationCallerBlock: Block) {
		if (!this.animatedBlocks[animatedBlock.getId()]) {
			animatedBlock.startAnimation(animationCallerBlock.getId());
			this.animatedBlocks[animatedBlock.getId()] = animatedBlock;
		}
	}

	stopBlockAnimation(animatedBlock: Block) {
		animatedBlock.stopAnimation();
		delete this.animatedBlocks[animatedBlock.getId()];
	}

	createTopBlocks(emptyCellsInColumns: object, animationCallerBlock: Block) {
		for (let column in emptyCellsInColumns) {
			let createdBlocksCounter: number = 0;
			while (createdBlocksCounter < emptyCellsInColumns[column]) {
				const newBlockRow: number = this.rowsNum - emptyCellsInColumns[column] + createdBlocksCounter;
				const bottomBlock: Block = this.getBlockFromGrid(Number(column), newBlockRow - 1);
				const newBlockMinY: number = this.rowsNum * this.prefabSize;
				const newBlockY: number = bottomBlock ? Math.max(bottomBlock.y + this.prefabSize, newBlockMinY) : newBlockMinY;
				this.createBlock(
					Number(column) * this.prefabSize,
					newBlockY,
					Number(column),
					newBlockRow,
					animationCallerBlock
				);
				createdBlocksCounter++;
			}
		}
	}

	update(dt: number) {
		for (let id in this.animatedBlocks) {
			let animatedBlock: Block = this.animatedBlocks[id];
			let nextY: number = animatedBlock.y - this.blocksMovingSpeed * dt;
			let maxY: number = animatedBlock.row * this.prefabSize; // TODO: target y does not should to be recalculated so often
			if (nextY > maxY) {
				animatedBlock.y = nextY;
			} else {
				animatedBlock.y = maxY;
				this.stopBlockAnimation(animatedBlock);
			}
		}
	}

	registerBlockInGrid(block: Block) {
		this.grid[this.getGridKey(block.column, block.row)] = block;
	}

	getBlockFromGrid(column: number, row: number): Block {
		return this.grid[this.getGridKey(column, row)];
	}

	unregisterBlockFromGrid(block: Block) {
		if (this.grid[this.getGridKey(block.column, block.row)] == block) {
			delete this.grid[this.getGridKey(block.column, block.row)];
		}
	}

	getGridKey(column: number, row: number): string {
		return column + 'x' + row;
	}

	onDestroy() {
		this.node.off(cc.Node.EventType.SIZE_CHANGED, this.alignViewport, this);
		this.removeAllBlocksListeners();
	}

	removeAllBlocksListeners() {
		for (let key in this.grid) {
			let block: Block = this.grid[key];
			this.removeBlockListeners(block);
		}
	}

	removeBlockListeners(block: Block) {
		block.getNode().off(cc.Node.EventType.TOUCH_START);
	}

	calculateViewportVerticalMargins(): number {
		const viewportWidget: cc.Widget = this.viewport.getComponent(cc.Widget);
		return viewportWidget.top + viewportWidget.bottom;
	}

	calculateViewportHorizontalMargins(): number {
		const viewportWidget: cc.Widget = this.viewport.getComponent(cc.Widget);
		return viewportWidget.left + viewportWidget.bottom;
	}
}

class Block extends cc.Node {
	public static prefabs: cc.Prefab[];
	private static createdBlocksCounter: number = 0;
	public column: number;
	public row: number; // current row or target row if block animated
	public prefabIndex: number;
	private node: cc.Node;
	private id: number;
	private animationCallerId: number = null;

	constructor() {
		super();
		Block.createdBlocksCounter++;
		this.id = Block.createdBlocksCounter;
		this.prefabIndex = Math.floor(Math.random() * Block.prefabs.length);
		this.node = cc.instantiate(Block.prefabs[this.prefabIndex]);
		this.addChild(this.node);
	}

	getNode(): cc.Node {
		return this.node;
	}

	getId(): number {
		return this.id;
	}

	getAnimationCallerId() {
		return this.animationCallerId;
	}

	startAnimation(callerId: number) {
		this.animationCallerId = callerId;
	}

	stopAnimation() {
		this.animationCallerId = null;
	}
}