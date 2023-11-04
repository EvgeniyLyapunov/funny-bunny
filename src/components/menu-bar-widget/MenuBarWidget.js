/**
 * экземпляр класса управляет показом и скрытием элемента, переданного в конструктор. Аргументы:
 * 1 - родительский элемент, в котором нужно показывать и скрывать что-то;
 * 2 - элемент, по клику на который будет происходить показ и скрытие;
 * 3 - элемент, который нужно скрывать и показывать;
 * 4 - экземпляр FunnyDoggyWidget;
 */
class MenuBarWidget {
	constructor(paraentElement, button, contentWidget, funnybunny) {
		this.paraentElement = paraentElement;
		this.button = button;
		this.contentWidget = contentWidget;
		this.funnybunny = funnybunny;

		this.menubarElement = null;

		this.menuShow = this.menuShow.bind(this);
		this.menuClose = this.menuClose.bind(this);

		this.button.addEventListener('click', this.menuShow);
	}

	menuShow() {
		if (this.funnybunny.activeElementInView.length > 0) {
			this.funnybunny.activeElementInView.pop().removeElement();
			setTimeout(() => {
				this.show();
			}, 1000);
		} else {
			this.show();
		}
	}

	show() {
		if (!this.menubarElement) {
			this.menubarElement = this.contentWidget.renderToDOM();
			this.paraentElement.insertAdjacentElement('afterbegin', this.menubarElement);
			this.menubarElement.classList.add('show');
			this.button.classList.add('btn_active');
			this.button.removeEventListener('click', this.menuShow);
			this.button.addEventListener('click', this.menuClose);
		}
	}

	menuClose() {
		this.menubarElement.classList.remove('show');
		this.menubarElement.classList.add('hide');
		this.button.removeEventListener('click', this.menuClose);
		this.button.addEventListener('click', this.menuShow);
		this.button.classList.remove('btn_active');
		setTimeout(() => {
			this.menubarElement.remove();
			this.menubarElement = null;
		}, 600);
	}
}

export default MenuBarWidget;
