const inputName = document.querySelector('#form-input-name');
const inputNumber = document.querySelector('#form-input-number');
const form = document.querySelector('#form');
const formBtn = document.querySelector('#form-btn')
const list = document.querySelector('#list')
const closeBtn = document.querySelector('#close-btn');
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  window.location.href ='../Home/home.html'; 
} 

let nameValidation = false;
let numberValidation = false;
// let contacts = [];
// funcion para validar inputs
const validateInput = (validation, input) => {
  
  const formInfo = input.parentElement.children[2];

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }

  if (input.value === '') {
    input.classList.remove('correct');
    input.classList.remove('invalid');
    formInfo.classList.remove('show');
  } else if (validation){
    input.classList.add('correct');
    input.classList.remove('invalid');
    formInfo.classList.remove('show');
  } else{
  input.classList.add('invalid');
  input.classList.remove('correct');
  formInfo.classList.add('show');
  
}};

//validaciones
inputName.addEventListener('input', e => {
  const NAME_REGEX = /^[A-Z][a-z ]*[A-Z][a-z]*$/;
  nameValidation = NAME_REGEX.test(inputName.value)
  validateInput(nameValidation, inputName)
});

inputNumber.addEventListener('input', e => {
  const NUMBER_REGEX = /^(0212|0412|0416|0414|0412|0424|0426)[0-9]{7}$/;
  numberValidation = NUMBER_REGEX.test(inputNumber.value)
  validateInput(numberValidation, inputNumber)
});

console.log(user);
//crea los contactos tanto en el sevidor como en la pagina
form.addEventListener('submit', async e =>{
    e.preventDefault();
    const responseJSON = await fetch('http://localhost:3000/contacts', {
			method: 'POST',
			headers:{
				'Content-Type':'application/json',
			},
			body:JSON.stringify({ name: inputName.value, phone: inputNumber.value, user: user.username }),

		});
    const response = await responseJSON.json();
    console.log(response);


        const listItem = document.createElement('li');
    listItem.classList.add('contacts');
    listItem.id = response.id;
    listItem.innerHTML = `
      <button class="delete-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 008 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 00-11.908 0zM12.75 7.75a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z" />
      </svg>
      </button>
    <div id="edit-container">
      <input type="text" class="edit-name" value="${response.name}" readonly>
      <input type="text" class="edit-number" value="${response.phone}" readonly>
    </div>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
          <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
      </svg>
      </button>`;


list.append(listItem);
 nameValidation = false;
  numberValidation = false;

  inputName.value = '';
  inputNumber.value = '';

  validateInput(nameValidation, inputName);
  validateInput(numberValidation, inputNumber);

});

// eventos de eliminar y editar contactos servidor/pagina
list.addEventListener('click', async e =>{
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (deleteBtn) {
    const id = deleteBtn.parentElement.id;

    await fetch(`http://localhost:3000/contacts/${id}`, {method: 'DELETE'});
    deleteBtn.parentElement.remove();
  }
  if (editBtn){
    const li = editBtn.parentElement;
    const editContainer = editBtn.parentElement.children[1];
    const inputEditName = editContainer.children[0];
    const inputEditNumber = editContainer.children[1];
    let nameEditValidation = true;
      let numberEditValidation = true;
      
   
   

    const validateEditInput = (validation, input) => {
      if (nameEditValidation && numberEditValidation) {
        editBtn.disabled = false;
      } else {
        editBtn.disabled = true;
      }
    
      if (input.value === '') {
        input.classList.remove('correct');
        input.classList.remove('invalid');
      } else if (validation) {
        input.classList.add('correct');
        input.classList.remove('invalid');
      } else {
        input.classList.add('invalid');
        input.classList.remove('correct');
      }
    }

    inputEditName.addEventListener('input', e => {
      const NAME_REGEX = /^[A-Z][a-z ]*[A-Z][a-z]*$/;
      nameEditValidation = NAME_REGEX.test(inputEditName.value);
      validateEditInput(nameEditValidation, inputEditName);
    });
    
    inputEditNumber.addEventListener('input', e => {
      const NUMBER_REGEX = /^(0212|0412|0416|0414|0412|0424|0426)[0-9]{7}$/;
      numberEditValidation = NUMBER_REGEX.test(inputEditNumber.value);
      validateEditInput(numberEditValidation, inputEditNumber);
    });

    if (editBtn.classList.contains('editando')){
      
      console.log('editado');
      const id = li.id;
      editBtn.classList.remove('editando')
      inputEditName.setAttribute('readonly', true);
      inputEditNumber.setAttribute('readonly', true);
      inputEditName.classList.remove('correct')
      inputEditNumber.classList.remove('correct')
      await fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'PATCH',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({ name: inputEditName.value, phone: inputEditNumber.value})});
        editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg> `;
  
    } else {
      console.log('editando')
      editBtn.classList.add('editando')
      inputEditName.removeAttribute('readonly');
      inputEditNumber.removeAttribute('readonly');
    
    
      editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"/>
      </svg>
      `;
    
      
      validateEditInput(nameEditValidation, inputEditName);
      validateEditInput(numberEditValidation, inputEditNumber);

    }
   

  };
 
});

//Cierro sesion 
closeBtn.addEventListener('click', async e => {
  localStorage.removeItem('user')
  window.location.href ='../Home/home.html'; 
});

//carga los contactos que esten en servidor a la pagina
const getContacts = async () => {
    const response = await fetch('http://localhost:3000/contacts', {method:'GET'});
    const contacts = await response.json();
    const userContacts = contacts.filter(contact => contact.user === user.username);
    console.log(contacts);
    
    
    userContacts.forEach(contact => {
      
        const listItem = document.createElement('li');
        listItem.classList.add('contacts');
        listItem.id = contact.id;
        listItem.innerHTML = `<button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 008 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 00-11.908 0zM12.75 7.75a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z" />
    </svg>
    </button>
    <div id="edit-container">
      <input type="text" class="edit-name" value="${contact.name}" readonly>
      <input type="text" class="edit-number" value="${contact.phone}" readonly>
      </div>
        <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
    </button>`;
    list.append(listItem);
    });
};
getContacts();

