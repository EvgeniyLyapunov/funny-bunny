import { Observable, debounce, debounceTime, switchMap } from 'rxjs';

const titleMsgStream = (title, message) => {
	const titleText = 'funny bunny';
	function hideTitle() {
		title.classList.remove('animate__animated', 'animate__flipInX');
		title.classList.add('animate__animated', 'animate__flipOutX');
	}

	function showMessage() {
		title.classList.add('title-message');
		title.textContent = message;
		title.classList.remove('animate__animated', 'animate__flipOutX');
		title.classList.add('animate__animated', 'animate__flipInX');
	}

	function hideMessage() {
		title.classList.remove('animate__animated', 'animate__flipInX');
		title.classList.add('animate__animated', 'animate__flipOutX');
	}

	function showTitle() {
		title.classList.remove('title-message');
		title.textContent = titleText;
		title.classList.remove('animate__animated', 'animate__flipOutX');
		title.classList.add('animate__animated', 'animate__flipInX');
	}

	const stream$ = new Observable((observer) => {
		observer.next(hideTitle);
		setTimeout(() => {
			observer.next(showMessage);
		}, 700);
		setTimeout(() => {
			observer.next(hideMessage);
		}, 2500);
		setTimeout(() => {
			observer.next(showTitle);
			observer.unsubscribe();
		}, 3200);
	});

	return stream$;
};

const titleMsgObserver = (func) => {
	func();
};

export { titleMsgStream, titleMsgObserver };
