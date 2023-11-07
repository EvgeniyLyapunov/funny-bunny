import { fromEvent, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import './search.scss';

class Search {
	constructor(parentElement, funnybunny) {
		this.parentElement = parentElement;
		this.funnybunny = funnybunny;

		this.element = null;
		this.input = null;
		this.closeBtn = null;
		this.preInfo = null;

		this.preInfoStream$ = null;
		this.subscribe = null;
		this.searchResult = null;

		this.markUp = this.markUp.bind(this);
		this.renderToDOM = this.renderToDOM.bind(this);
		this.slideOn = this.slideOn.bind(this);
		this.slideOff = this.slideOff.bind(this);
		this.onInputPreSearch = this.onInputPreSearch.bind(this);
		this.preSearchResultShow = this.preSearchResultShow.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	markUp() {
		return `
      <div class="search-form__input-block">
        <input class="search-form__input" type="text" name="search" placeholder="найти...">
        <span class="search-form__preinfo"></span>
      </div>
      <span class="search-form__bunny-pic"></span>
      <div class="search-form__btn-block">
        <span class="search-form__close"></span>
        <button class="search-form__submit btn" type="submit">Показать</button>
      </div>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('form');
		this.element.classList.add('search-form', 'search-form_slide-off');
		this.element.innerHTML = this.markUp();

		this.parentElement.insertAdjacentElement('beforeend', this.element);

		this.input = this.element.querySelector('.search-form__input');
		this.closeBtn = this.element.querySelector('.search-form__close');
		this.closeBtn.addEventListener('click', this.slideOff);
		this.preInfo = this.element.querySelector('.search-form__preinfo');
		this.element.addEventListener('submit', this.onSubmit);
		this.onInputPreSearch();
	}

	slideOn() {
		this.element.classList.remove('search-form_slide-off');
		this.element.classList.add('search-form_slide-on');
		this.subscribe = this.preInfoStream$.subscribe(this.preSearchResultShow);
	}

	slideOff() {
		this.element.classList.remove('search-form_slide-on');
		this.element.classList.add('search-form_slide-off');
		this.preInfo.classList.remove('search-form__preinfo_active');
		this.preInfo.textContent = '';
		this.input.value = '';
		if (this.subscribe) {
			this.subscribe.unsubscribe();
		}
	}

	onInputPreSearch() {
		this.preInfoStream$ = fromEvent(this.input, 'input').pipe(
			debounceTime(400),
			map((event) => event.target.value.trim()),
			distinctUntilChanged(),
			map((value) => {
				if (value === '') return [];
				return this.funnybunny.state.notes.filter((n) => {
					const regex = new RegExp('^' + value, 'i');
					const arr = n.text.split(' ');
					return arr.some((w) => regex.test(w));
				});
			})
		);
	}

	preSearchResultShow(value) {
		this.searchResult = value;
		const count = value.length;
		if (count > 0) {
			this.preInfo.classList.add('search-form__preinfo_active');
			this.preInfo.textContent = `Найдено совпадений: ${count}`;
		} else {
			this.preInfo.classList.remove('search-form__preinfo_active');
			this.preInfo.textContent = '';
		}
	}

	onSubmit(e) {
		e.preventDefault();
		if (!this.searchResult || this.searchResult.length === 0) return;

		if (this.funnybunny.activeElementInView.length > 0) {
			this.funnybunny.activeElementInView[0].removeElement();
		}
		this.funnybunny.btnNote.click();
		setTimeout(() => {
			this.funnybunny.notesList.reRenderToDOM(this.searchResult, true);
			this.funnybunny.activeElementInView.push(this.funnybunny.notesList);
		}, 600);
	}
}

export default Search;
