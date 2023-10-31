import MenuBarWidget from '../menu-bar-widget/MenuBarWidget';
import NoteMenuWidget from '../note-menu-widget/NoteMenuWidget';

import './fd-widget.scss';
import doggy from './doggy-girlfriend.png';

class FunnyDoggyWidget {
	constructor(parentElement) {
		this.parentElement = parentElement;
		this.element = null;
		this.viewElement = null;

		this.btnNote = null;

		this.noteMenuWidget = new NoteMenuWidget(this);
	}

	markUp() {
		return `
      <div class="fd-widget__top">
        <div class="fd-widget__top-header">
          <div class="fd-widget__top-header-pic-box">
            <img class="fd-widget__top-header-img" src=${doggy} alt="funny doggy">
          </div>
          <h1 class="fd-widget__top-header-title">funny doggy</h1>
        </div>
      </div>
      <div class="fd-widget__control">
        <button class="btn">Сервисы</button>
        <button class="btn">Добавить</button>
        <button class="btn">Загрузки</button>
        <button class="btn">Избранное</button>
        <button class="btn btn-note">Заметка</button>
      </div>
      <div class="fd-widget__view">
        <ul class="fd-widget__view-list"></ul>
      </div>
      <div class="fd-widget__bottom">
        <span class="fd-widget__bottom-switch"></span>
      </div>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('div');
		this.element.classList.add('fd-widget');
		this.element.innerHTML = this.markUp();
		this.parentElement.insertAdjacentElement('afterbegin', this.element);

		this.viewElement = this.element.querySelector('.fd-widget__view');

		this.btnNote = this.element.querySelector('.btn-note');
		this.btnNoteMenuBar = new MenuBarWidget(this.viewElement, this.btnNote, this.noteMenuWidget);
	}
}

export default FunnyDoggyWidget;
