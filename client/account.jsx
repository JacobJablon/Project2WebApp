const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlePoem = (id, onPoemDeleted) => {
    helper.hideError();
    helper.sendDelete(id, onPoemDeleted);
};

const PoemList = (props) => {
    const [poems, setPoems] = useState([]);

    useEffect(() => {
        const loadPoemsFromServer = async () => {
            const response = await fetch('/getMyPoems');
            const data = await response.json();
            setPoems(data.poems);
        };
        loadPoemsFromServer();
    }, [props.reloadPoems]);

    if(poems.length === 0) {
        return (
            <div className="poemList">
                <h3 className="emptyPoem">No Poems Yet!</h3>
            </div>
        );
    }

    const poemNodes = poems.map(poem => {
        return (
            <div key={poem._id} className="poem">
                <h3 className="poemName">Name: {poem.name}</h3>
                <h3 className="poemPoem">Poem: {poem.poem}</h3>
                <h3 className="poemLikes">Likes: {poem.likes}</h3>
                <h3 className="poemCreatedDate">
                    Posted on: {new Date(poem.createdDate).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                </h3>
                <button className="poemDeleteBtn" onClick={() => handlePoem(poem._id, props.triggerReload)}>Delete</button>
            </div>
        );
    });

    return (
        <div className="poemList">
            {poemNodes}
        </div>
    );
};

const App = () => {
    const [reloadPoems, setReloadPoems] = useState(false);
    
    const triggerReload = () => setReloadPoems(!reloadPoems);

    return (
        <div>
            <div id="poems">
                <PoemList reloadPoems={reloadPoems} triggerReload={triggerReload} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;