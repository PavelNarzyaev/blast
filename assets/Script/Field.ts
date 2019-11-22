const {ccclass, property} = cc._decorator;

@ccclass
export default class Field extends cc.Component {
	@property
	blocksMovingSpeed: number = 100;

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
	animatedBlocks: object = {};

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
			while (group.length) {
				let removedBlock: Block = group.pop();
				for (let row: number = removedBlock.row; row < this.rowsNum; row++) {
					let animatedBlock: Block = this.getBlockFromGrid(removedBlock.column, row);
					if (animatedBlock) {
						if (!animatedBlock.animationInProgress()) {
							animatedBlock.startAnimation(block.getId());
						}
						animatedBlock.decreaseAnimationTargetRow();
						this.animatedBlocks[animatedBlock.getId()] = animatedBlock;
					}
				}
			}
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
		block.stopAnimation();
		delete this.animatedBlocks[block.getId()];
		block.parent.removeChild(block);
		this.unregisterBlockFromGrid(block);
		this.removeBlockListeners(block);
	}

	update(dt: number) {
		for (let id in this.animatedBlocks) {
			let animatedBlock: Block = this.animatedBlocks[id];
			let nextY: number = animatedBlock.y - this.blocksMovingSpeed * dt;
			let maxY: number = animatedBlock.getAnimationTargetRow() * this.prefabSize; // TODO: target y does not should recalculated so often
			if (nextY > maxY) {
				animatedBlock.y = nextY;
			} else {
				this.unregisterBlockFromGrid(animatedBlock);
				animatedBlock.row = animatedBlock.getAnimationTargetRow();
				this.registerBlockInGrid(animatedBlock);
				animatedBlock.stopAnimation();
				animatedBlock.y = maxY;
				delete this.animatedBlocks[id];
			}
		}
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

	getBlockFromGrid(column: number, row: number): Block {
		return this.grid[this.getGridKey(column, row)];
	}

	unregisterBlockFromGrid(block: Block) {
		delete this.grid[this.getGridKey(block.column, block.row)];
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
			this.removeBlockListeners(block);
		}
	}

	removeBlockListeners(block: Block) {
		block.getNode().off(cc.Node.EventType.TOUCH_START);
	}
}

class Block extends cc.Node {
	public static prefabs: cc.Prefab[];
	private static createdBlocksCounter: number = 0;
	public column: number;
	public row: number;
	public prefabIndex: number;
	private node: cc.Node;
	private id: number;
	private animationTargetRow: number = null;
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

	decreaseAnimationTargetRow() {
		if (this.animationTargetRow === null) {
			this.animationTargetRow = this.row - 1;
		} else {
			this.animationTargetRow--;
		}
	}

	getAnimationTargetRow() {
		return this.animationTargetRow;
	}

	getAnimationCallerId() {
		return this.animationCallerId;
	}

	startAnimation(callerId: number) {
		this.animationCallerId = callerId;
	}

	animationInProgress() {
		return this.animationCallerId !== null;
	}

	stopAnimation() {
		this.animationTargetRow = null;
		this.animationCallerId = null;
	}
}