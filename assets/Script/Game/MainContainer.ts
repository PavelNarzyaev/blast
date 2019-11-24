import Field from "./Field";
import Menu from "./Menu";
import Progress from "./Progress";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainContainer extends cc.Component {
	@property(Field)
	field: Field = null;

	@property
	fieldMaxHeightPercent: number = 1;

	@property
	fieldMaxWidthPercent: number = 1;

	@property(Menu)
	menu: Menu = null;

	@property
	menuWidthPercent: number = 1;

	@property
	gapBetweenFieldAndMenuPercent: number = 0;

	@property(Progress)
	progress: Progress = null;

	@property
	progressHeightPercent: number = .2;

	@property
	progressMaxWidthPercent: number = .8;

	onLoad() {
		this.node.on(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}

	start() {
		this.alignElements();
	}

	alignElements() {
		this.resizeField();
		this.resizeMenu();
		this.resizeProgress();

		const gap: number = this.node.width * this.gapBetweenFieldAndMenuPercent;
		const totalWidth: number = this.field.node.width + gap + (this.menu.node.width * this.menu.node.scale);
		this.field.node.x = (this.node.width - totalWidth) / 2;
		this.menu.node.x = this.field.node.x + this.field.node.width + gap;
	}

	resizeField() {
		const viewportFrameWidth: number = this.node.width * this.fieldMaxWidthPercent - this.field.calculateViewportHorizontalMargins();
		const viewportFrameHeight: number = this.node.height * this.fieldMaxHeightPercent - this.field.calculateViewportVerticalMargins();
		const viewportFrameAspectRatio: number = viewportFrameWidth / viewportFrameHeight;
		const gridAspectRatio: number = this.field.columnsNum / this.field.rowsNum;

		if (gridAspectRatio > viewportFrameAspectRatio) {
			this.field.node.width = viewportFrameWidth + this.field.calculateViewportHorizontalMargins();
			this.field.node.height = viewportFrameWidth / gridAspectRatio + this.field.calculateViewportVerticalMargins();
		} else if (gridAspectRatio < viewportFrameAspectRatio) {
			this.field.node.height = viewportFrameHeight + this.field.calculateViewportVerticalMargins();
			this.field.node.width = viewportFrameHeight * gridAspectRatio + this.field.calculateViewportHorizontalMargins();
		} else {
			this.field.node.width = viewportFrameWidth + this.field.calculateViewportHorizontalMargins();
			this.field.node.height = viewportFrameHeight + this.field.calculateViewportVerticalMargins();
		}
	}

	resizeMenu() {
		this.menu.node.scale = this.node.width * this.menuWidthPercent / this.menu.node.width;
	}

	resizeProgress() {
		const maxScale: number = this.node.width * this.progressMaxWidthPercent / this.progress.node.width;
		this.progress.node.scale = Math.min(this.node.height * this.progressHeightPercent / this.progress.node.height, maxScale);
	}

	onDestroy() {
		this.node.off(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}
}