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
	prefabSize: number = 171;

	@property([cc.Prefab])
	blocksPrefabs: cc.Prefab[] = [];

	blocksContainer: cc.Node;

	start() {
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
				let randomBlock: cc.Node = this.createRandomBlock();
				randomBlock.x = this.prefabSize * column;
				randomBlock.y = this.prefabSize * row;
				this.blocksContainer.addChild(randomBlock);
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

	createRandomBlock(): cc.Node {
		return cc.instantiate(this.blocksPrefabs[Math.floor(Math.random() * this.blocksPrefabs.length)]);
	}
}