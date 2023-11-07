import LoadingSpinner from '../components/loading/LoadingSpinner';

const rootPath = 'http://localhost:5000';

async function getRequest(path = '/') {
	const loading = new LoadingSpinner(document.querySelector('.funny-bunny__view'));
	const url = rootPath + path;

	try {
		loading.renderToDOM();
		const result = await fetch(url);
		if (result.status === 200) {
			loading.removeElement();
			const data = await result.json();
			return { status: result.status, data };
		} else {
			loading.removeElement();
			return { status: result.status };
		}
	} catch (error) {
		loading.removeElement();
		return { status: error.message };
	}
}

async function postRequest(path, json, method = 'POST') {
	const loading = new LoadingSpinner(document.querySelector('.funny-bunny__view'));
	const url = rootPath + path;
	try {
		loading.renderToDOM();
		const result = await fetch(url, {
			method: method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: json,
		});

		if (result.status === 200) {
			loading.removeElement();
			const data = await result.json();
			return { status: result.status, data };
		} else {
			loading.removeElement();
			return { status: result.status };
		}
	} catch (error) {
		loading.removeElement();
		return { status: error.message };
	}
}

async function putRequest(path, json, method = 'PUT') {
	return await postRequest(path, json, method);
}

async function deleteRequest(path, id) {
	const loading = new LoadingSpinner(document.querySelector('.funny-bunny__view'));
	const url = rootPath + path + `/${id}`;
	try {
		loading.renderToDOM();
		const result = await fetch(url, { method: 'DELETE' });

		if (result.status === 200) {
			loading.removeElement();
			const data = await result.json();
			return { status: result.status, data };
		} else {
			loading.removeElement();
			return { status: result.status };
		}
	} catch (error) {
		loading.removeElement();
		return { status: error.message };
	}
}

export { getRequest, postRequest, putRequest, deleteRequest };
