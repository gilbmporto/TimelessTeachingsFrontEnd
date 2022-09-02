//Declare the functions of the utils.js file
import { createSelectElement, createLabelElement, createOptionsForSelectElement, createNewButton } from './utils.js';

//Declare the HTML elements we'll be using to render the child elements dinamically
const firstDiv = document.getElementById('row-1');
const secondDiv = document.getElementById('row-2');
const divToDisplayResults = document.getElementById('contentDisplayer');

//Now, let's render the label and list of options for the user
function renderListOptions() {
    //first, we use fetch to get the list of all the authors we have inside our database
    fetch('/api/get-all-authors', 
    {
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            console.log(response);
            createLabelElement('labelForSelectElement', 'AuthorsNamesList', 'Find a quote by Author Name: ', firstDiv);
            createSelectElement('AuthorsNamesList', 'authorName', firstDiv);
            return response.json();
        }
    })
    .then(jsonResponse => {
        console.log(jsonResponse);

        //Now we can declare the dinamically created HTML elements
        const labelForSelectElement = document.getElementById('labelForSelectElement'); 
        const selectAuthorsElem = document.getElementById('AuthorsNamesList');

        //Now, we dinamically create the options for the select element
        jsonResponse.forEach(obj => {
            let newOptionElem = document.createElement('option');
            newOptionElem.value = obj['authorName'];
            newOptionElem.innerHTML = obj['authorName'];
            selectAuthorsElem.appendChild(newOptionElem);
        });

        createNewButton('SearchByAuthorBtn', 'standardButton', 'Get Quote By Name', secondDiv);
        createNewButton('getRandomQuoteBtn', 'standardButton', 'Get Random Quote', secondDiv);
        return jsonResponse;
    })
    .then(jsonResponse => {
        console.log(jsonResponse);

        //Now we can declare the recently created buttons
        const searchByAuthorBtn = document.getElementById('SearchByAuthorBtn');
        const getRandomQuoteBtn = document.getElementById('getRandomQuoteBtn');

        //Now, we'll add to each declared button its respective function
        searchByAuthorBtn.addEventListener('click', () => {
            //First and always, we reset the DisplayerDiv
            divToDisplayResults.innerHTML = '';
            const selectAuthorsElem = document.getElementById('AuthorsNamesList');

            let selectedAuthorName = selectAuthorsElem.value;
            fetch(`/api/get-specific-author/quote?authorName=${selectedAuthorName}`, {
                method: 'GET',
            })
            .then(response => {
                if (response.ok) {
                    /*
                    const thirdRowDiv = document.createElement('div');
                    thirdRowDiv.className = 'column';
                    thirdRowDiv.id = 'contentOne';
                    divToDisplayResults.appendChild(thirdRowDiv);
                    */
                    return response.json();
                };
                throw new Error('Request failed somehow!');
            })
            .then(jsonResponse => {

                //const thirdRowDiv = document.getElementById('contentOne');

                const authorNameElement = document.createElement('h2');
                authorNameElement.className = 'Author';
                authorNameElement.innerHTML = `<h3><b>Author Name</b>: ${jsonResponse.authorName}</h3>`;
                divToDisplayResults.appendChild(authorNameElement);

                jsonResponse['quotes'].forEach(obj => {
                    let newQuoteElement = document.createElement('p');
                    newQuoteElement.className = 'Quote';
                    newQuoteElement.innerHTML = `<p><b>Quote ${obj.id}</b>: ${obj.content}</p>
                                                <p><b>Frase ${obj.id}</b>: ${obj.ptBRContent}</p>`;
                    divToDisplayResults.appendChild(newQuoteElement);
                });
            })
            .catch(err => console.log(err.message));
        });

        getRandomQuoteBtn.addEventListener('click', () => {
            divToDisplayResults.innerHTML = '';

            fetch('/api/random-quote', 
            {
                method: 'GET'
            })
            .then(response => {
                if (response.ok) {
                    /*
                    const thirdRowDiv = document.createElement('div');
                    thirdRowDiv.className = 'column';
                    thirdRowDiv.id = 'randomContent';
                    divToDisplayResults.appendChild(thirdRowDiv);
                    */
                    return response.json();
                }
                throw new Error('Request failed: ' + response.status);
            })
            .then(jsonResponse => {

                //const thirdRowDiv = document.getElementById('randomContent');

                const authorNameElement = document.createElement('h2');
                authorNameElement.className = 'Author';
                authorNameElement.innerHTML = `<h3><b>Author Name</b>: ${jsonResponse.authorName}</h3>`;
                divToDisplayResults.appendChild(authorNameElement);

                let randomPhrase = jsonResponse['quotes'][Math.floor(Math.random() * jsonResponse['quotes'].length)];
                let newQuoteElement = document.createElement('p');
                    newQuoteElement.className = 'Quote';
                    newQuoteElement.innerHTML = `<p><b>Quote ${randomPhrase.id}</b>: ${randomPhrase.content}</p>
                                                <p><b>Frase ${randomPhrase.id}</b>: ${randomPhrase.ptBRContent}</p>`;
                    divToDisplayResults.appendChild(newQuoteElement);
            })
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));
};

renderListOptions();