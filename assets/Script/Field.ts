const {ccclass, property} = cc._decorator;

@ccclass
export default class Field extends cc.Component {

	@property
	rowsNum: number = 0;

	@property
	columnsNum: number = 0;

	@property([cc.Prefab])
	blocksPrefabs: cc.Prefab[] = [];

	start() {
		this.node.height = this.columnsNum / this.rowsNum * this.node.width;
	}
}