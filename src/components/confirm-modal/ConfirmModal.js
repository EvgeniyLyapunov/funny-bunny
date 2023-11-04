import './confirm-modal.scss';

class ConfirmModal {
	constructor(parentElement, funnybunny, id) {
		this.parentElement = parentElement;
		this.funnybunny = funnybunny;
		this.confirmForId = id;

		this.element = null;
		this.btnNo = null;
		this.btnYes = null;
	}

	markUp() {
		return `
      <div class="confirm-modal">
        <div class="confirm-modal__info-block">
          <span class="confirm-modal__msg">Удалить заметку?</span>
          <div class="confirm-modal__btn-block">
            <span class="confirm-modal__btn-no"></span>
            <cpan class="confirm-modal__btn-yes"></cpan>
          </div>
        </div>
      </div>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('div');
		this.element.classList.add('confirm');
		this.element.innerHTML = this.markUp();

		this.btnNo = this.element.querySelector('.confirm-modal__btn-no');
		this.btnNo.addEventListener('click', () => {
			this.removeElement();
		});
		this.btnYes = this.element.querySelector('.confirm-modal__btn-yes');
		this.btnYes.addEventListener('click', () => {
			this.funnybunny.onDeleteNote(this.confirmForId);
			this.removeElement();
		});

		this.parentElement.insertAdjacentElement('afterbegin', this.element);
		this.element.classList.add('animate__animated', 'animate__zoomIn');
	}

	removeElement() {
		this.element.classList.remove('animate__animated', 'animate__zoomIn');
		this.element.classList.add('animate__animated', 'animate__zoomOut', 'animate__slow');
		setTimeout(() => {
			this.element.remove();
			this.element = null;
		}, 1000);
	}
}

export default ConfirmModal;
