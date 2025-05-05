const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlePoem = (e, onPoemAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#poemName').value;
    const poem = e.target.querySelector("#poemPoem").value;
    const privacy = e.target.querySelector('input[name = "privacy"]:checked').value;
    const anonymity = e.target.querySelector('input[name = "anonymity"]:checked').value;

    if(!name || !poem || !privacy || !anonymity) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, poem, privacy, anonymity}, onPoemAdded);
    return false;
};

const PoemForm = (props) => {
    return(
        <form id="poemForm"
        onSubmit={(e) => handlePoem(e,  props.triggerReload)}
        name="poemForm"
        action="/writer"
        method="POST"
        className="poemForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="poemName" type="text" name="name" placeholder="Name of poem" />
            <label htmlFor="poem">Poem: </label>
            <input id="poemPoem" type="text" name="poem" placeholder="Poem goes here" />
            <label htmlFor='privacy'>Privacy Status: </label>
            <label><input type="radio" name="privacy" value="true" />Private</label>
            <label><input type="radio" name="privacy" value="false" />Public</label>
            <label htmlFor='anonymity'>Anonymity Status: </label>
            <label><input type="radio" name="anonymity" value="true" />Anonymous</label>
            <label><input type="radio" name="anonymity" value="false" />Signed</label>
            <input className="writePoemSubmit" type="submit" value="Upload Poem" />
        </form>
    );
};

const PoemCount = (props) => {
    const [poemCount, setPoemCount] = useState(props.poemCount);

    useEffect(() => {
        const loadPoemCountFromServer = async () => {
            const response = await fetch('/getMyPoemCount');
            const data = await response.json();
            setPoemCount(data.poemCount);
        };
        loadPoemCountFromServer();
    }, [props.reloadPoemCount]);

    if (poemCount == 0) {
        return (
            <div key="poemCountId" id="poemCountContainer">
                <h3 id="poemCountHeader">Write your first poem!</h3>
                <h3 id="poemCount">You have no poems yet!</h3>
            </div>
        );
    } else if (poemCount == 1) {
        return (
            <div key="poemCountId" id="poemCountContainer">
                <h3 id="poemCountHeader">Write another poem!</h3>
                <h3 id="poemCount">Add to your {poemCount} poem!</h3>
            </div>
        );
    } else {
        return (
            <div key="poemCountId" id="poemCountContainer">
                <h3 id="poemCountHeader">Write another poem!</h3>
                <h3 id="poemCount">Add to your collection of {poemCount} poems!</h3>
            </div>
        );
    };
};

const App = () => {
    const [reloadPoemCount, setReloadPoemCount] = useState(false);

    return (
        <div>
            <div id="writePoemContainer">
                <PoemCount  poemCount={[]} reloadPoemCount={reloadPoemCount}/>
            </div>
            <div id="writePoem">
                <PoemForm triggerReload={() => setReloadPoemCount(!reloadPoemCount)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;