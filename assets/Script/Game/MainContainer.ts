import Field from "./Field";
import Menu from "./Menu";
import Progress from "./Progress";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainContainer extends cc.Component {
	@property(Field)
	protected field: Field = null;

	@property
	protected fieldMaxHeightPercent: number = 1;

	@property
	protected fieldMaxWidthPercent: number = 1;

	@property(Menu)
	protected menu: Menu = null;

	@property
	protected menuWidthPercent: number = 1;

	@property
	protected gapBetweenFieldAndMenuPercent: number = 0;

	@property(Progress)
	protected progress: Progress = null;

	@property
	protected progressHeightPercent: number = .2;

	@property
	protected progressMaxWidthPercent: number = .8;

	protected onLoad(): void {
		this.node.on(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}

	protected start(): void {
		this.alignElements();
	}

	private alignElements(): void {
		this.resizeField();
		this.resizeMenu();
		this.resizeProgress();

		const gap: number = this.node.width * this.gapBetweenFieldAndMenuPercent;
		const totalWidth: number = this.field.node.width + gap + (this.menu.node.width * this.menu.node.scale);
		this.field.node.x = (this.node.width - totalWidth) / 2;
		this.menu.node.x = this.field.node.x + this.field.node.width + gap;
	}

	private resizeField(): void {
		const viewportFrameWidth: number = this.node.width * this.fieldMaxWidthPercent - this.field.calculateViewportHorizontalMargins();
		const viewportFrameHeight: number = this.node.height * this.fieldMaxHeightPercent - this.field.calculateViewportVerticalMargins();
		const viewportFrameAspectRatio: number = viewportFrameWidth / viewportFrameHeight;
		const viewportAspectRatio: number = this.field.calculateViewportAspectRatio();

		if (viewportAspectRatio > viewportFrameAspectRatio) {
			this.field.node.width = viewportFrameWidth + this.field.calculateViewportHorizontalMargins();
			this.field.node.height = viewportFrameWidth / viewportAspectRatio + this.field.calculateViewportVerticalMargins();
		} else if (viewportAspectRatio < viewportFrameAspectRatio) {
			this.field.node.height = viewportFrameHeight + this.field.calculateViewportVerticalMargins();
			this.field.node.width = viewportFrameHeight * viewportAspectRatio + this.field.calculateViewportHorizontalMargins();
		} else {
			this.field.node.width = viewportFrameWidth + this.field.calculateViewportHorizontalMargins();
			this.field.node.height = viewportFrameHeight + this.field.calculateViewportVerticalMargins();
		}
	}

	private resizeMenu(): void {
		this.menu.node.scale = this.node.width * this.menuWidthPercent / this.menu.node.width;
	}

	private resizeProgress(): void {
		const maxScale: number = this.node.width * this.progressMaxWidthPercent / this.progress.node.width;
		this.progress.node.scale = Math.min(this.node.height * this.progressHeightPercent / this.progress.node.height, maxScale);
	}

	protected onDestroy(): void {
		this.node.off(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}
}