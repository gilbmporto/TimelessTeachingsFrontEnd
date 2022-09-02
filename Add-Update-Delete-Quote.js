//Declare the HTML Elements already provided
const usernameInput = document.getElementById('loginUsername');
const passwordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('accessButton');
const firstDivRow = document.getElementById('row-1');
const secondDivRow = document.getElementById('row-2');
const thirdDivRow = document.getElementById('row-3');
const fourthDivRow = document.getElementById('row-4');
const fifthDivRow = document.getElementById('row-5');
const sixthDivRow = document.getElementById('row-6');
const displayerDiv = document.getElementById('contentDisplayerAUD');

//Now, the rest of the page will be rendered dinamically by the JS code and 
//it will only be rendered once the username and password inputs are correctly entered

//A function for us to call to dinamically mount the web application
const renderElements = (time, func) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(func());
        }, time);
    });
};

//First of all, an async function to render the restricted area that will be called when the access button is clicked:


loginBtn.addEventListener('click', () => {
    //First of all, we must reset all the divs everytime the access button is clicked:
    firstDivRow.innerHTML = '';
    secondDivRow.innerHTML = '';
    thirdDivRow.innerHTML = '';
    fourthDivRow.innerHTML = '';
    displayerDiv.innerHTML = '';
    displayerDiv.style.visibility = 'hidden';


    //Now, the following HTML elements will be rendered only if the user provides the correct username and password:
    fetch(`/api/restricted-area/login?username=${usernameInput.value}&password=${passwordInput.value}`, 
    { 
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            const newLabelElementToSelectMethod = document.createElement('label');
            newLabelElementToSelectMethod.setAttribute('for', 'SelectElementToChooseMethod');
            newLabelElementToSelectMethod.innerHTML = 'Select the method you want to use ';
            firstDivRow.appendChild(newLabelElementToSelectMethod);

            const SelectElementToChooseMethod = document.createElement('select');
            SelectElementToChooseMethod.setAttribute('id', 'SelectElementToChooseMethod');
            SelectElementToChooseMethod.setAttribute('name', 'selectElemToChooseMethod');
            firstDivRow.appendChild(SelectElementToChooseMethod);

            const newBtnForChoosingMethod = document.createElement('button');
            newBtnForChoosingMethod.setAttribute('class', 'standardButton');
            newBtnForChoosingMethod.setAttribute('id', 'theNewBtnForChoosingMethod');
            newBtnForChoosingMethod.innerHTML = 'Proceed';
            secondDivRow.appendChild(newBtnForChoosingMethod);

            return response.json();
        };
        throw new Error('Request failed somehow');
    })
    .then(jsonResponse => {
        //Now we can define the newly created elements
        const selectElemListingMethodOptions = document.getElementById('SelectElementToChooseMethod');
        const proceedBtn = document.getElementById('theNewBtnForChoosingMethod');
        
        const DB = jsonResponse.data;
        
        jsonResponse['method'].forEach(method => {
            const newOptionMethod = document.createElement('option');
            newOptionMethod.setAttribute('value', method);
            newOptionMethod.innerHTML = method;
            selectElemListingMethodOptions.appendChild(newOptionMethod);
        });
        
        proceedBtn.addEventListener('click', () => {
            thirdDivRow.innerHTML = '';
            fourthDivRow.innerHTML = '';
            displayerDiv.innerHTML = '';
            displayerDiv.style.visibility = 'hidden';

            if (selectElemListingMethodOptions.value == 'POST') {

                fetch(`/api/use-post-method`, 
                { 
                    method: 'GET' 
                })
                .then(response => {
                    if (response.ok) {
                        //These HTML elements will be rendered at the case of a POST request:
                        const newLabelElementForSelectAuthorToPostNewQuote = document.createElement('label');
                        newLabelElementForSelectAuthorToPostNewQuote.setAttribute('for', 'theSelectInputAuthorToPostNewQuote');
                        newLabelElementForSelectAuthorToPostNewQuote.innerHTML = 'Select Author To Post New Quote';
                        thirdDivRow.appendChild(newLabelElementForSelectAuthorToPostNewQuote);

                        const newSelectElementForChoosingAuthorToPostNewQuote = document.createElement('select');
                        newSelectElementForChoosingAuthorToPostNewQuote.setAttribute('id', 'theSelectInputAuthorToPostNewQuote');
                        newSelectElementForChoosingAuthorToPostNewQuote.setAttribute('name', 'selectInputAuthorToPostNewQuote');
                        thirdDivRow.appendChild(newSelectElementForChoosingAuthorToPostNewQuote);

                        const newTextInputForPostingQuote = document.createElement('input');
                        newTextInputForPostingQuote.setAttribute('type', 'text');
                        newTextInputForPostingQuote.setAttribute('name', 'newQuoteInput');
                        newTextInputForPostingQuote.setAttribute('id', 'theNewQuoteInput');
                        fourthDivRow.appendChild(newTextInputForPostingQuote);

                        const newBtnForPostingQuote = document.createElement('button');
                        newBtnForPostingQuote.setAttribute('class', 'standardButton');
                        newBtnForPostingQuote.setAttribute('id', 'theNewBtnForPostingAQuote');
                        newBtnForPostingQuote.innerHTML = 'Post Now';
                        fourthDivRow.appendChild(newBtnForPostingQuote);

                        return response.json();

                    }
                })
                .then(jsonResponse => {

                    const SelectAuthorHTMLElement = document.getElementById('theSelectInputAuthorToPostNewQuote');
                    const PostNewContentInput = document.getElementById('theNewQuoteInput');
                    const ButtonForPostingNewQuote = document.getElementById('theNewBtnForPostingAQuote');

                    jsonResponse['data'].forEach(obj => {
                        const newOptionAuthorName = document.createElement('option');
                        newOptionAuthorName.value = obj.authorName;
                        newOptionAuthorName.innerHTML = obj.authorName;
                        SelectAuthorHTMLElement.appendChild(newOptionAuthorName);
                    })

                    //Now, one more event listener so we can finally post a new quote:
                    ButtonForPostingNewQuote.addEventListener('click', () => {

                        fetch(`/api/post-new-quote/quote?selectInputAuthorToPostNewQuote=${SelectAuthorHTMLElement.value}&newQuoteInput=${PostNewContentInput.value}`, 
                        {
                            method: 'POST'
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            };
                            throw new Error('Request failed in line 133!');
                        })
                        .then(jsonResponse => {
                            console.log(jsonResponse);
                            const textForDisplayerDivPOSTMethod = document.createElement('div');
                            textForDisplayerDivPOSTMethod.setAttribute('class', 'message');
                            textForDisplayerDivPOSTMethod.innerHTML = `<h3>The quote was successfully posted!</h3>
                                                                        <h3><b>Author Name</b>: ${jsonResponse['data']['authorName']}</h3>
                                                                        <p><b>Quote posted</b>: ${jsonResponse['data']['quotes'][(Number(jsonResponse['data']['quotes'].length) - 1)]['content']}</p>`

                            displayerDiv.removeAttribute('hidden');
                            displayerDiv.style.visibility = 'visible';
                            displayerDiv.appendChild(textForDisplayerDivPOSTMethod);
                        })
                        .catch(err => console.log(err));
                    });
                })
                .catch(error => console.log(error));

            } else if (selectElemListingMethodOptions.value == 'PUT') {

                fetch(`/api/use-put-method`, 
                { 
                    method: 'GET'
                })
                .then(response => {
                    if (response.ok) {
                        //These HTML elements will be rendered at the case of a PUT request:
                        const newLabelElementForSelectAuthorToUpdateQuote = document.createElement('label');
                        newLabelElementForSelectAuthorToUpdateQuote.setAttribute('for', 'theSelectInputAuthorToUpdateQuote');
                        newLabelElementForSelectAuthorToUpdateQuote.innerHTML = 'Select Author To Post New Quote: ';
                        thirdDivRow.appendChild(newLabelElementForSelectAuthorToUpdateQuote);

                        const newSelectElementForChoosingAuthorToUpdateQuote = document.createElement('select');
                        newSelectElementForChoosingAuthorToUpdateQuote.setAttribute('id', 'theSelectInputAuthorToUpdateQuote');
                        newSelectElementForChoosingAuthorToUpdateQuote.setAttribute('name', 'selectInputAuthorToUpdateQuote');
                        thirdDivRow.appendChild(newSelectElementForChoosingAuthorToUpdateQuote);

                        const newBtnForChoosingAuthor = document.createElement('button');
                        newBtnForChoosingAuthor.setAttribute('class', 'standardButton');
                        newBtnForChoosingAuthor.setAttribute('id', 'theNewBtnForChoosingAuthor');
                        newBtnForChoosingAuthor.innerHTML = 'Select This Author';
                        fourthDivRow.appendChild(newBtnForChoosingAuthor);

                        return response.json();

                    }
                })
                .then(jsonResponse => {

                    const SelectAuthorHTMLElementToUpdate = document.getElementById('theSelectInputAuthorToUpdateQuote');
                    const newBtnAuthorChoice = document.getElementById('theNewBtnForChoosingAuthor');

                    jsonResponse['data'].forEach(obj => {
                        const newOptionAuthorName = document.createElement('option');
                        newOptionAuthorName.value = obj.authorName;
                        newOptionAuthorName.innerHTML = obj.authorName;
                        SelectAuthorHTMLElementToUpdate.appendChild(newOptionAuthorName);
                    });
                    
                    //One more event listener so we can populate the ID selector:
                    newBtnAuthorChoice.addEventListener('click', () => {
                        fifthDivRow.innerHTML = '';
                        sixthDivRow.innerHTML = '';
                        displayerDiv.innerHTML = '';
                        displayerDiv.style.visibility = 'hidden';

                        fetch(`/api/get-put-method-ids/author?selectInputAuthorToUpdateQuote=${SelectAuthorHTMLElementToUpdate.value}`, 
                        {
                            method: 'GET'
                        })
                        .then(response => {

                            if (response.ok) {

                                const newLabelElementForSelectingQuoteIdToUpdate = document.createElement('label');
                                newLabelElementForSelectingQuoteIdToUpdate.setAttribute('for', 'theNewSelectElementForChoosingQuoteIDToUpdate');
                                newLabelElementForSelectingQuoteIdToUpdate.innerHTML = 'Select the quote you want to update: ';
                                fifthDivRow.appendChild(newLabelElementForSelectingQuoteIdToUpdate);

                                const newSelectElementForChoosingQuoteIDToUpdate = document.createElement('select');
                                newSelectElementForChoosingQuoteIDToUpdate.setAttribute('id', 'theNewSelectElementForChoosingQuoteIDToUpdate');
                                newSelectElementForChoosingQuoteIDToUpdate.setAttribute('name', 'selectInputQuoteIdToUpdate');
                                fifthDivRow.appendChild(newSelectElementForChoosingQuoteIDToUpdate);

                                const newInputTextElemForUpdateQuote = document.createElement('input');
                                newInputTextElemForUpdateQuote.setAttribute('name', 'InputTextElemForUpdateQuote');
                                newInputTextElemForUpdateQuote.setAttribute('id', 'theInputTextElemForUpdateQuote');
                                sixthDivRow.appendChild(newInputTextElemForUpdateQuote);

                                const newBtnToFinallyUpdateQuote = document.createElement('button');
                                newBtnToFinallyUpdateQuote.setAttribute('class', 'standardButton');
                                newBtnToFinallyUpdateQuote.setAttribute('id', 'theBtnToFinallyUpdateQuote');
                                newBtnToFinallyUpdateQuote.innerHTML = 'Update Quote';
                                sixthDivRow.appendChild(newBtnToFinallyUpdateQuote);

                                return response.json();
                            };
                            throw new Error('Request failed in line 254!');
                        })
                        .then(jsonResponse => {

                            const selectElemIdQuote = document.getElementById('theNewSelectElementForChoosingQuoteIDToUpdate');
                            const inputTextElemForUpdatingQuote = document.getElementById('theInputTextElemForUpdateQuote');
                            const buttonUpdateQuote = document.getElementById('theBtnToFinallyUpdateQuote');

                            jsonResponse['data']['quotes'].forEach(obj => {
                                const newOptionIdContent = document.createElement('option');
                                newOptionIdContent.value = obj.id;
                                newOptionIdContent.innerHTML = obj.id;
                                selectElemIdQuote.appendChild(newOptionIdContent);
                            });

                            console.log(jsonResponse);
                            
                            buttonUpdateQuote.addEventListener('click', () => {

                                fetch(`/api/update-quote/quote?InputTextElemForUpdateQuote=${inputTextElemForUpdatingQuote.value}&selectInputAuthorToUpdateQuote=${SelectAuthorHTMLElementToUpdate.value}&selectInputQuoteIdToUpdate=${selectElemIdQuote.value}`, 
                                {
                                    method: 'PUT'
                                })
                                .then(response => {
                                    if (response.ok) {
                                        console.log(response);
                                        return response.json();
                                    };
                                    throw new Error(response);
                                })
                                .then(jsonResponse => {
                                    console.log(jsonResponse);
                                    const textForDisplayerDivPUTMethod = document.createElement('div');
                                    textForDisplayerDivPUTMethod.setAttribute('class', 'message');
                                    textForDisplayerDivPUTMethod.innerHTML = `<h3>The quote was successfully updated!</h3>
                                                                            <h3><b>Quote ID</b>: ${jsonResponse['data']['id']}</h3>
                                                                            <p><b>Quote updated</b>: ${jsonResponse['data']['content']}</p>`
                                    displayerDiv.removeAttribute('hidden');
                                    displayerDiv.style.visibility = 'visible';
                                    displayerDiv.appendChild(textForDisplayerDivPUTMethod);
                                })
                                .catch(err => console.log(err));
                            })
                        })
                        .catch(err => console.log(err));
                    });
                })
                .catch(error => console.log(error));

            } else if (selectElemListingMethodOptions.value == 'DELETE') {
                //Pay attention at each things that was pasted here just after line 293
                fetch(`/api/use-delete-method`, 
                { 
                    method: 'GET'
                })
                .then(response => {
                    if (response.ok) {
                        //These HTML elements will be rendered at the case of a PUT request:
                        const newLabelElementForSelectAuthorToDeleteQuote = document.createElement('label');
                        newLabelElementForSelectAuthorToDeleteQuote.setAttribute('for', 'theSelectInputAuthorToDeleteQuote');
                        newLabelElementForSelectAuthorToDeleteQuote.innerHTML = 'Select the author whose quote you want to delete: ';
                        thirdDivRow.appendChild(newLabelElementForSelectAuthorToDeleteQuote);

                        const newSelectElementForChoosingAuthorToDeleteQuote = document.createElement('select');
                        newSelectElementForChoosingAuthorToDeleteQuote.setAttribute('id', 'theSelectInputAuthorToDeleteQuote');
                        newSelectElementForChoosingAuthorToDeleteQuote.setAttribute('name', 'selectInputAuthorToDeleteQuote');
                        thirdDivRow.appendChild(newSelectElementForChoosingAuthorToDeleteQuote);

                        const newBtnForChoosingAuthor = document.createElement('button');
                        newBtnForChoosingAuthor.setAttribute('class', 'standardButton');
                        newBtnForChoosingAuthor.setAttribute('id', 'theNewBtnForChoosingAuthor');
                        newBtnForChoosingAuthor.innerHTML = 'Select This Author';
                        fourthDivRow.appendChild(newBtnForChoosingAuthor);

                        return response.json();

                    }
                })
                .then(jsonResponse => {

                    const SelectAuthorHTMLElementToDelete = document.getElementById('theSelectInputAuthorToDeleteQuote');
                    const newBtnAuthorChoice = document.getElementById('theNewBtnForChoosingAuthor');

                    jsonResponse['data'].forEach(obj => {
                        const newOptionAuthorName = document.createElement('option');
                        newOptionAuthorName.value = obj.authorName;
                        newOptionAuthorName.innerHTML = obj.authorName;
                        SelectAuthorHTMLElementToDelete.appendChild(newOptionAuthorName);
                    });
                    
                    //One more event listener so we can populate the ID selector:
                    newBtnAuthorChoice.addEventListener('click', () => {
                        fifthDivRow.innerHTML = '';
                        sixthDivRow.innerHTML = '';
                        displayerDiv.innerHTML = '';
                        displayerDiv.style.visibility = 'hidden';

                        fetch(`/api/get-del-method-ids/author?selectInputAuthorToDeleteQuote=${SelectAuthorHTMLElementToDelete.value}`, 
                        {
                            method: 'GET'
                        })
                        .then(response => {

                            if (response.ok) {

                                const newLabelElementForSelectingQuoteIdToDelete = document.createElement('label');
                                newLabelElementForSelectingQuoteIdToDelete.setAttribute('for', 'theNewSelectElementForChoosingQuoteIDToDelete');
                                newLabelElementForSelectingQuoteIdToDelete.innerHTML = 'Select the quote you want to update: ';
                                fifthDivRow.appendChild(newLabelElementForSelectingQuoteIdToDelete);

                                const newSelectElementForChoosingQuoteIDToDelete = document.createElement('select');
                                newSelectElementForChoosingQuoteIDToDelete.setAttribute('id', 'theNewSelectElementForChoosingQuoteIDToDelete');
                                newSelectElementForChoosingQuoteIDToDelete.setAttribute('name', 'selectInputQuoteIdToDelete');
                                fifthDivRow.appendChild(newSelectElementForChoosingQuoteIDToDelete);

                                const newBtnToFinallyDeleteQuote = document.createElement('button');
                                newBtnToFinallyDeleteQuote.setAttribute('class', 'standardButton');
                                newBtnToFinallyDeleteQuote.setAttribute('id', 'theBtnToFinallyDeleteQuote');
                                newBtnToFinallyDeleteQuote.innerHTML = 'Delete Quote';
                                sixthDivRow.appendChild(newBtnToFinallyDeleteQuote);

                                return response.json();
                            };
                            throw new Error('Request failed in line 370!');
                        })
                        .then(jsonResponse => {

                            const selectElemIdQuoteToBeDeleted = document.getElementById('theNewSelectElementForChoosingQuoteIDToDelete');
                            const buttonDeleteQuote = document.getElementById('theBtnToFinallyDeleteQuote');

                            jsonResponse['data']['quotes'].forEach(obj => {
                                const newOptionIdContent = document.createElement('option');
                                newOptionIdContent.value = obj.id;
                                newOptionIdContent.innerHTML = obj.id;
                                selectElemIdQuoteToBeDeleted.appendChild(newOptionIdContent);
                            });

                            console.log(jsonResponse);
                            
                            buttonDeleteQuote.addEventListener('click', () => {

                                fetch(`/api/delete-quote/quote?selectInputAuthorToDeleteQuote=${SelectAuthorHTMLElementToDelete.value}&selectInputQuoteIdToDelete=${selectElemIdQuoteToBeDeleted.value}`, 
                                {
                                    method: 'DELETE'
                                })
                                .then(response => {
                                    if (response.ok) {
                                        console.log(response);
                                        return response.json();
                                    };
                                    throw new Error(response.message);
                                })
                                .then(jsonResponse => {
                                    console.log(jsonResponse);
                                    const textForDisplayerDivDELETEMethod = document.createElement('div');
                                    textForDisplayerDivDELETEMethod.setAttribute('class', 'message');
                                    textForDisplayerDivDELETEMethod.innerHTML = `<h3>The quote was successfully deleted!</h3>
                                                                                <p>Author whose quote was deleted: <b>${jsonResponse['data']['authorName']}</b></p>`;
                                    displayerDiv.removeAttribute('hidden');
                                    displayerDiv.style.visibility = 'visible';
                                    displayerDiv.appendChild(textForDisplayerDivDELETEMethod);
                                })
                                .catch(err => console.log(err));
                            })
                        })
                        .catch(err => console.log(err));
                    });
                })
                .catch(error => console.log(error));
            }
        });
    })
    .catch(error => console.log(error));
});