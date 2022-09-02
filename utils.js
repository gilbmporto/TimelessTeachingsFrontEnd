//Here we'll maintain functions which will be called to render dynamic content at the front-end of the page.

export const createSelectElement = (id, nameOfElement, parentNode) => {
    const newSelectElement = document.createElement('select');
    newSelectElement.id = id;
    newSelectElement.name = nameOfElement;
    parentNode.appendChild(newSelectElement);
    return newSelectElement;
};

export const createLabelElement = (id, idOfLabeledElement, innerHTML, parentNode) => {
    const newLabelElement = document.createElement('label');
    newLabelElement.id = id;
    newLabelElement.innerHTML = innerHTML;
    newLabelElement.setAttribute('for', idOfLabeledElement);
    parentNode.appendChild(newLabelElement);
};

export const createOptionsForSelectElement = (arr, selectElement, value, theInnerHTML) => {
    arr.forEach(obj => {
        let newOption = document.createElement('option');
        newOption.setAttribute('value', value);
        newOption.innerHTML = theInnerHTML;
        selectElement.appendChild(newOption);
    });
};

export const createNewButton = (id, className, textOfBtn, parentNode ) => {
    const newButtonElement = document.createElement('button');
    newButtonElement.setAttribute('id', id);
    newButtonElement.setAttribute('class', className);
    newButtonElement.innerHTML = textOfBtn;
    parentNode.appendChild(newButtonElement);
};