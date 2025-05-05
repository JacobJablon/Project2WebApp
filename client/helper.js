const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('poemMessage').classList.remove('hidden');
};

const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('poemMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
};

const sendDelete = async (id, handler) => {
    const response = await fetch(`/deletePoem/${id}`, {
        method: 'DELETE',
    });

    console.log("response", response);

    if (response.ok) {
        handler();
    } else {
        handleError(response.statusText);
    }
}

const sendPatch = async (id, handler) => {
    const response = await fetch(`/likeOrUnlikePoem/${id}`, {
        method: 'PATCH',
    });

    if (response.ok) {
        handler();
    } else {
        handleError(response.statusText);
    }
}

const hideError = () => {
    document.getElementById('poemMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError,
    sendDelete,
    sendPatch,
};