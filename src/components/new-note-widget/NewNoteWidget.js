import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';
import './new-note-widget.scss';

class NewNoteWidget {
	constructor(parentElement, funnybunny) {
		this.parentElement = parentElement;
		this.funnybunny = funnybunny;

		this.element = null;
		this.textarea = null;
		this.closeBtn = null;
		this.editModeIndicator = null;

		this.noteForEdit = null;

		this.markUp = this.markUp.bind(this);
		this.renderToDOM = this.renderToDOM.bind(this);
		this.slideOn = this.slideOn.bind(this);
		this.slideOff = this.slideOff.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	markUp() {
		return `
			<textarea class="new-note-form__textarea" name="newnote" rows="3"></textarea>
			<div class="new-note-form__btn-block">
				<div class="new-note-form__top-btn-block">
					<span class="new-note-form__edit-mode-on"></span>
					<span class="new-note-form__close"></span>
				</div>
				<button class="new-note-form__submit btn" type="submit">Сохранить</button>
			</div>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('form');
		this.element.classList.add('new-note-form', 'new-note-form_slide-off');
		this.element.innerHTML = this.markUp();

		this.parentElement.insertAdjacentElement('beforeend', this.element);

		this.textarea = this.element.querySelector('.new-note-form__textarea');
		this.editModeIndicator = this.element.querySelector('.new-note-form__edit-mode-on');
		this.closeBtn = this.element.querySelector('.new-note-form__close');
		this.closeBtn.addEventListener('click', this.slideOff);

		this.element.addEventListener('submit', this.onSubmit);
	}

	slideOn(selectedNote = null) {
		if (selectedNote) {
			this.noteForEdit = selectedNote;
			this.textarea.value = selectedNote.text;
			this.editModeIndicator.classList.add(
				'new-note-form__edit-mode-on_active',
				'animate__animated',
				'animate__pulse',
				'animate__infinite',
				'animate__fast'
			);
		}
		this.element.classList.remove('new-note-form_slide-off');
		this.element.classList.add('new-note-form_slide-on');
	}

	slideOff() {
		this.element.classList.remove('new-note-form_slide-on');
		this.element.classList.add('new-note-form_slide-off');
		this.textarea.value = '';
		this.noteForEdit = null;
		this.editModeIndicator.classList.remove(
			'new-note-form__edit-mode-on_active',
			'animate__animated',
			'animate__pulse',
			'animate__fast',
			'animate__infinite'
		);
	}

	onSubmit(e) {
		e.preventDefault();
		if (!this.textarea.value.trim()) return;

		let note = {};

		if (this.noteForEdit) {
			this.noteForEdit.text = this.textarea.value;
			note = this.noteForEdit;
			this.editModeIndicator.classList.remove(
				'new-note-form__edit-mode-on_active',
				'animate__animated',
				'animate__pulse',
				'animate__infinite',
				'animate__fast'
			);
		} else {
			note.id = uuidv4();
			note.date = Date.now();
			note.text = this.textarea.value;
			note.favorite = false;
			note.pined = false;
		}

		this.funnybunny.onSubmitNewNote(note);
		this.textarea.value = '';
	}
}

export default NewNoteWidget;
