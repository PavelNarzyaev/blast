const {ccclass, property} = cc._decorator;

@ccclass
export default class Field extends cc.Component {
	@property
	columnsNum: number = 0;

	@property
	rowsNum: number = 0;

	@property
	prefabSize: number = 0;

	@property
	blocksContainerMargin: number = 0;

	@property([cc.Prefab])
	blocksPrefabs: cc.Prefab[] = [];

	blocksContainer: cc.Node;

	start() {
		this.node.height = this.rowsNum / this.columnsNum * this.node.width;
		this.initBlocksContainer();
	}

	initBlocksContainer() {
		this.blocksContainer = new cc.Node();
		this.node.addChild(this.blocksContainer);
		this.fillBlocksContainer();
		const totalBlocksWidth: number = this.prefabSize * this.columnsNum;
		const totalBlocksHeight: number = this.prefabSize * this.rowsNum;
		this.blocksContainer.scaleX = (this.node.width - this.blocksContainerMargin * 2) / totalBlocksWidth;
		this.blocksContainer.scaleY = (this.node.height - this.blocksContainerMargin * 2) / totalBlocksHeight;
		this.blocksContainer.x = -(totalBlocksWidth * this.blocksContainer.scaleX) / 2;
		this.blocksContainer.y = -(totalBlocksHeight * this.blocksContainer.scaleY) / 2;
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

	createRandomBlock(): cc.Node {
		return cc.instantiate(this.blocksPrefabs[Math.floor(Math.random() * this.blocksPrefabs.length)]);
	}
}