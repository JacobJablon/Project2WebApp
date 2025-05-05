const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlePoem = (id, onPoemLikeChange) => {
    helper.hideError();
    helper.sendPatch(id, onPoemLikeChange);
};

const PoemList = (props) => {
    const [poems, setPoems] = useState(props.poems);

    useEffect(() => {
        const loadPoemsFromServer = async () => {
            const response = await fetch('/getAllPublicPoems');
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
            <div key={poem.id} className="poem">
                <h3 className="poemName">{poem.name}</h3>
                <h3 className="poemPoem">{poem.poem}</h3>
                <h3 className="poemWriter">{poem.writer.username}</h3>
                <div className="lastLine">
                    <button className="poemLikeOrUnlikeBtn" onClick={() => handlePoem(poem._id, props.triggerReload)}>Like</button>
                    <h3 className="poemLikes">{poem.likes}</h3>
                    <h3 className="poemCreatedDate">
                        {new Date(poem.createdDate).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                    </h3>
                </div>
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
                <PoemList poems={[]} reloadPoems={reloadPoems} triggerReload={triggerReload} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;