export default class Block extends cc.Node {
	public static prefabs: cc.Prefab[];
	private static createdBlocksCounter: number = 0;
	public column: number;
	public row: number; // current row or target row if block animated
	public prefabIndex: number;
	private node: cc.Node;
	private id: number;

	constructor() {
		super();
		Block.createdBlocksCounter++;
		this.id = Block.createdBlocksCounter;
		this.prefabIndex = Math.floor(Math.random() * Block.prefabs.length);
		this.node = cc.instantiate(Block.prefabs[this.prefabIndex]);
		this.addChild(this.node);
	}

	public getNode(): cc.Node {
		return this.node;
	}

	public getId(): number {
		return this.id;
	}
}