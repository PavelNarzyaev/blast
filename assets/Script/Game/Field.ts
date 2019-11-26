import Block from "./Block";
import GameModel from "./GameModel";
import BlocksManager from "./BlocksManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Field extends cc.Component {
	@property
	protected blocksMovingSpeed: number = 100;

	@property
	protected columnsNum: number = 5;

	@property
	protected rowsNum: number = 5;

	@property
	protected minGroupSize: number = 2;

	@property
	protected prefabSize: number = 171;

	@property(cc.Node)
	protected viewport: cc.Node = null;

	@property([cc.Prefab])
	protected blocksPrefabs: cc.Prefab[] = [];

	@property(cc.Prefab)
	protected particlePrefab: cc.Prefab = null;

	private blocksManager: BlocksManager;

	protected onLoad(): void {
		this.node.on(cc.Node.EventType.SIZE_CHANGED, this.alignViewport, this);
	}

	private alignViewport(): void {
		const totalBlocksWidth: number = this.prefabSize * this.columnsNum;
		const totalBlocksHeight: number = this.prefabSize * this.rowsNum;
		this.viewport.scaleY = (this.node.height - this.calculateViewportVerticalMargins()) / totalBlocksHeight;
		this.viewport.scaleX = (this.node.width - this.calculateViewportHorizontalMargins()) / totalBlocksWidth;
	}

	protected start(): void {
		Block.prefabs = this.blocksPrefabs;
		this.blocksManager = new BlocksManager();
		this.fillViewport();
	}

	private fillViewport(): void {
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

	private createBlock(x: number, y: number, column: number, row: number, animated: boolean = false): void {
		const newBlock: Block = new Block();
		newBlock.x = x;
		newBlock.y = y;
		newBlock.column = column;
		newBlock.row = row;
		this.blocksManager.registerBlockInGrid(newBlock);
		if (animated) {
			this.blocksManager.registerAnimatedBlock(newBlock);
		}
		this.viewport.addChild(newBlock);
		newBlock.getNode().on(cc.Node.EventType.TOUCH_START, function () { this.onBlockTouch(newBlock); }, this);
	}

	private onBlockTouch(block: Block): void {
		if (!this.blocksManager.blockIsAnimated(block)) {
			const group: Block[] = this.blocksManager.calculateGroupByBlock(block);
			if (group.length >= this.minGroupSize) {
				GameModel.move(group.length);
				const emptyCellsInColumns: object = {};
				let removedBlocksCounter: number = 0;
				while (removedBlocksCounter < group.length) {
					const removedBlock: Block = group[removedBlocksCounter];
					this.removeBlock(removedBlock);
					this.refreshAnimations(removedBlock);
					if (!emptyCellsInColumns[removedBlock.column]) {
						emptyCellsInColumns[removedBlock.column] = 1;
					} else {
						emptyCellsInColumns[removedBlock.column]++;
					}
					removedBlocksCounter++;
				}
				this.createTopBlocks(emptyCellsInColumns);
				this.showGroupRemovingAnimation(group);
			}
		}
	}

	private removeBlock(block: Block): void {
		this.blocksManager.unregisterAnimatedBlock(block);
		this.blocksManager.unregisterBlockFromGrid(block);
		block.parent.removeChild(block);
		this.removeBlockListeners(block);
	}

	private showGroupRemovingAnimation(group: Block[]): void {
		let i: number = 0;
		while (i < group.length) {
			const block: Block = group[i];
			this.showBlockRemovingAnimation(block);
			i++;
		}
	}

	private showBlockRemovingAnimation(removedBlock: Block): void {
		const particlesNode: cc.Node = cc.instantiate(this.particlePrefab);
		particlesNode.x = this.viewport.x + (removedBlock.x + this.prefabSize / 2) * this.viewport.scale;
		particlesNode.y = this.viewport.y + (removedBlock.y + this.prefabSize / 2) * this.viewport.scale;
		this.node.addChild(particlesNode);

		const particles: cc.ParticleSystem = particlesNode.getComponent(cc.ParticleSystem);
		particles.custom = true;
		particles.autoRemoveOnFinish = true;
		particles.emitterMode = cc.ParticleSystem.EmitterMode.GRAVITY;
		particles.duration = .1;
		particles.life = .5;
		particles.emissionRate = 300;
		particles.speed = 20;
		particles.angleVar = 180;
		particles.posVar = new cc.Vec2(this.prefabSize * this.viewport.scale / 2, this.prefabSize * this.viewport.scale / 2);
		particles.gravity = new cc.Vec2(0, -500);
	}

	private refreshAnimations(removedBlock: Block): void {
		for (let row: number = removedBlock.row; row < this.rowsNum; row++) {
			const animatedBlock: Block = this.blocksManager.getBlockFromGrid(removedBlock.column, row);
			if (animatedBlock) {
				this.blocksManager.unregisterBlockFromGrid(animatedBlock);
				animatedBlock.row--;
				this.blocksManager.registerBlockInGrid(animatedBlock);
				this.blocksManager.registerAnimatedBlock(animatedBlock);
			}
		}
	}

	private createTopBlocks(emptyCellsInColumns: object): void {
		for (let column in emptyCellsInColumns) {
			let createdBlocksCounter: number = 0;
			while (createdBlocksCounter < emptyCellsInColumns[column]) {
				const newBlockRow: number = this.rowsNum - emptyCellsInColumns[column] + createdBlocksCounter;
				const bottomBlock: Block = this.blocksManager.getBlockFromGrid(Number(column), newBlockRow - 1);
				const newBlockMinY: number = this.rowsNum * this.prefabSize;
				const newBlockY: number = bottomBlock ? Math.max(bottomBlock.y + this.prefabSize, newBlockMinY) : newBlockMinY;
				this.createBlock(
					Number(column) * this.prefabSize,
					newBlockY,
					Number(column),
					newBlockRow,
					true
				);
				createdBlocksCounter++;
			}
		}
	}

	protected update(dt: number): void {
		this.blocksManager.iterateAnimatedBlocks(
			function (animatedBlock: Block) {
				const nextY: number = animatedBlock.y - this.blocksMovingSpeed * dt;
				const maxY: number = animatedBlock.row * this.prefabSize; // TODO: target y does not should to be recalculated so often
				if (nextY > maxY) {
					animatedBlock.y = nextY;
				} else {
					animatedBlock.y = maxY;
					this.blocksManager.unregisterAnimatedBlock(animatedBlock);
				}
			},
			this
		);
	}

	protected onDestroy(): void {
		this.node.off(cc.Node.EventType.SIZE_CHANGED, this.alignViewport, this);
		this.removeAllBlocksListeners();
	}

	private removeAllBlocksListeners(): void {
		this.blocksManager.iterateGridBlocks(this.removeBlockListeners, this);
	}

	private removeBlockListeners(block: Block): void {
		block.getNode().off(cc.Node.EventType.TOUCH_START);
	}

	public calculateViewportVerticalMargins(): number {
		const viewportWidget: cc.Widget = this.viewport.getComponent(cc.Widget);
		return viewportWidget.top + viewportWidget.bottom;
	}

	public calculateViewportHorizontalMargins(): number {
		const viewportWidget: cc.Widget = this.viewport.getComponent(cc.Widget);
		return viewportWidget.left + viewportWidget.bottom;
	}

	public calculateViewportAspectRatio(): number {
		return this.columnsNum / this.rowsNum;
	}
}