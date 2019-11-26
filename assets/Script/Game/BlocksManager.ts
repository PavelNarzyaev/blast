import Block from "./Block";

export default class BlocksManager {
	private grid: object = {};
	private animatedBlocks: object = {};

	public registerBlockInGrid(block: Block): void {
		this.grid[this.getGridKey(block.column, block.row)] = block;
	}

	public getBlockFromGrid(column: number, row: number): Block {
		return this.grid[this.getGridKey(column, row)];
	}

	public unregisterBlockFromGrid(block: Block): void {
		if (this.grid[this.getGridKey(block.column, block.row)] == block) {
			delete this.grid[this.getGridKey(block.column, block.row)];
		}
	}

	public calculateGroupByBlock(block: Block): Block[] {
		const group: Block[] = [block];
		const alreadyCheckedKeys: object = { [this.getGridKey(block.column, block.row)]: true };

		const checkBlockNeighbors = function (checkedBlock: Block) {
			checkNeighborBlock.bind(this)(checkedBlock.column - 1, checkedBlock.row);
			checkNeighborBlock.bind(this)(checkedBlock.column + 1, checkedBlock.row);
			checkNeighborBlock.bind(this)(checkedBlock.column, checkedBlock.row - 1);
			checkNeighborBlock.bind(this)(checkedBlock.column, checkedBlock.row + 1);
		}

		const checkNeighborBlock = function (neighborColumn: number, neighborRow: number) {
			const gridKey: string = this.getGridKey(neighborColumn, neighborRow);
			if (!alreadyCheckedKeys[gridKey]) {
				alreadyCheckedKeys[gridKey] = true;
				const neighborBlock: Block = this.grid[gridKey];
				if (
					neighborBlock &&
					neighborBlock.prefabIndex == block.prefabIndex &&
					!this.blockIsAnimated(neighborBlock)
				) {
					group.push(neighborBlock);
					checkBlockNeighbors.bind(this)(neighborBlock);
				}
			}
		}

		checkBlockNeighbors.bind(this)(block);
		return group;
	}

	public iterateGridBlocks(callBack: (block: Block) => void, context: any): void {
		for (let key in this.grid) {
			callBack.apply(context, [this.grid[key]]);
		}
	}

	private getGridKey(column: number, row: number): string {
		return column + 'x' + row;
	}

	public registerAnimatedBlock(block: Block): void {
		this.animatedBlocks[block.getId()] = block;
	}

	public unregisterAnimatedBlock(block: Block): void {
		delete this.animatedBlocks[block.getId()];
	}

	public blockIsAnimated(block: Block): boolean {
		return this.animatedBlocks.hasOwnProperty(block.getId());
	}

	public iterateAnimatedBlocks(callBack: (block: Block) => void, context: any): void {
		for (let key in this.animatedBlocks) {
			callBack.apply(context, [this.animatedBlocks[key]]);
		}
	}
}