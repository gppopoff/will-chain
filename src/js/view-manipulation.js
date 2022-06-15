function handleWillClick() {
  document.getElementById('death-certificates-container').style.display = 'none';

  document.getElementById('wills-container').style.display = 'block';

  document.getElementById('certificate-button-item').classList.remove('active');
  document.getElementById('will-button-item').classList.add('active');
}

function handleDeathCertificateClick() {
  document.getElementById('wills-container').style.display = 'none';
  document.getElementById('death-certificates-container').style.display = 'block';

  document.getElementById('will-button-item').classList.remove('active');
  document.getElementById('certificate-button-item').classList.add('active');
}

function handleAddClauseButtonClick() {
  const container = document.getElementById('add-clauses-container');

  const col1 = wrapInDiv(createInput('Enter destination address'), 'col-md-4');
  const col2 = wrapInDiv(createInput('Enter amount'), 'col-md-2');

  const deleteClauseButton = configureDeleteClauseButton();

  const row = document.createElement('div');
  row.classList.add('clause-row', 'row');

  row.appendChild(col1);
  row.appendChild(col2);
  row.append(deleteClauseButton)

  container.appendChild(row);
}

document.getElementById('will-button').addEventListener('click', handleWillClick);
document.getElementById('death-certificate-button').addEventListener('click', handleDeathCertificateClick);

document.getElementById('add-clause-button').addEventListener('click', handleAddClauseButtonClick)

function preloadClause() {
  const container = document.getElementById('add-clauses-container');
  if (!container.children.length) {
    const container = document.getElementById('add-clauses-container');

    const col1 = wrapInDiv(createInput('Enter destination address'), 'col-md-4');
    const col2 = wrapInDiv(createInput('Enter amount'), 'col-md-2');

    const row = document.createElement('div');
    row.classList.add('clause-row', 'row');

    row.appendChild(col1);
    row.appendChild(col2);

    container.appendChild(row);
  }
}

preloadClause()

// Helpers

function configureDeleteClauseButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'delete-clause-button'
  button.classList.add('btn');
  button.textContent = 'X';

  button.addEventListener('click', () => {
    button.parentNode.remove()
  });

  return button;
}

function wrapInDiv(element, divClass = undefined) {
  const div = document.createElement('div');
  if (divClass) {
    div.classList.add(divClass);
  }

  div.appendChild(element);

  return div;
}

function createInput(placeholder = '') {
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('form-control');
  input.placeholder = placeholder;

  return input;
}