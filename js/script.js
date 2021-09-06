document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('form');

  const pass = form.querySelector('.pass')
  const passConf = form.querySelector('.pass-confirm')

  const nextButtons = document.querySelectorAll(".next");
  const slidePage = document.querySelector('.slide-page')
  const pages = document.querySelectorAll('.page');
  const inputs = document.querySelectorAll('.get-value');
  const stepsNumber = pages.length;


  const regExpEmail = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;
  const regExpName = /^[a-zA-Z]{3,16}$/;
  const regExpPass = /^(?=.*[A-Z])(?=.*[!@#$%^&*~])(?=.*[0-9])(?=.*[a-z]).{8}$/;


  document.documentElement.style.setProperty("--stepNumber", stepsNumber);
  let isValidate = false;

  const validateElem = (elem) => {

    if (elem.name === 'first_name' || elem.name === 'last_name') {
      if (!regExpName.test(elem.value) && elem.value !== '') {
        elem.nextElementSibling.textContent = 'Name is invalid'
        isValidate = false
      } else {
        elem.nextElementSibling.textContent = ''
        isValidate = true
      }
    }
    if (elem.name === 'login') {
      if (elem.value !== '') {
        elem.nextElementSibling.textContent = ''
        isValidate = false
      }
    }
    if (elem.name === 'email') {
      if (!regExpEmail.test(elem.value) && elem.value !== '') {
        elem.nextElementSibling.textContent = 'Email is invalid'
        isValidate = false
      } else {
        elem.nextElementSibling.textContent = ''
        isValidate = true
      }
    }

    if (elem.name === 'password') {
      if (!regExpPass.test(elem.value) && elem.value !== '') {
        elem.nextElementSibling.textContent = 'Required at least one number(0-9), uppercase and lowercase letters(a-Z) and at least one special character(!@#$%^&*~)'
        isValidate = false
      } else {
        elem.nextElementSibling.textContent = ''
        isValidate = true
      }
    }
    if (elem.name === 'password') {
      if (pass.value !== passConf.value && passConf.value !== '') {
        pass.nextElementSibling.textContent = 'Must be equal to password'
        passConf.nextElementSibling.textContent = 'Must be equal to password'
        isValidate = false
      } else {
        pass.nextElementSibling.textContent = ''
        passConf.nextElementSibling.textContent = ''
        isValidate = true
      }
      if (!regExpPass.test(elem.value) && elem.value !== '') {
        elem.nextElementSibling.textContent = 'Required at least one number(0-9), uppercase and lowercase letters(a-Z) and at least one special character(!@#$%^&*~)'
        isValidate = false
      } else {
        elem.nextElementSibling.textContent = ''
        isValidate = true
      }
    }
    if (elem.name === 'password_confirm') {
      if (pass.value !== passConf.value && passConf.value !== '') {
        pass.nextElementSibling.textContent = 'Must be equal to password'
        passConf.nextElementSibling.textContent = 'Must be equal to password'
        isValidate = false
      } else {
        pass.nextElementSibling.textContent = ''
        passConf.nextElementSibling.textContent = ''
        isValidate = true
      }
    }

  }






  for (let elem of form.elements) {
    if (elem.classList.contains('check-input') && elem.tagName !== 'BUTTON') {
      elem.addEventListener('blur', () => {
        validateElem(elem)
      })
    }
  }


  let current = 1;
  let user = {}


  for (let i = 0; i < nextButtons.length; i++) {
    nextButtons[i].addEventListener("click", function (event) {
      event.preventDefault();

      for (let elem of form.elements) {
        if (elem.classList.contains('check-input') && elem.tagName !== 'BUTTON') {

          if (elem.value === '') {
            elem.nextElementSibling.textContent = 'This field is required'
            isValidate = false
          } else {
            elem.nextElementSibling.textContent = ''
            isValidate = true
          }
        }
      }



      if (isValidate) {
        slidePage.style.marginLeft = `-${(100 / stepsNumber) * current
          }%`;
        document.querySelector('.departments').classList.add('check-input')
        document.querySelector('.vacancy').classList.add('check-input')
        current += 1;
        document.querySelector('.toresult').addEventListener('click', () => {
          inputValues = inputs.value




          inputs.forEach(function (e) {
            if (e.tagName !== 'SELECT') {
              user[e.name] = e.value

            } else {
              valueSelect = e.options[e.selectedIndex].text
              user[e.name] = valueSelect
            }

          })

          document.querySelector('.name-result').innerText = user.first_name + ' ' + user.last_name
          document.querySelector('.login-result').innerText = user.login
          document.querySelector('.email-result').innerText = user.email
          document.querySelector('.company-result').innerText = user.company
          document.querySelector('.department-result').innerText = user.departments
          document.querySelector('.vacancy-result').innerText = user.vacancy
        })
      }



    });

  }

  document.querySelector('.edit').addEventListener('click', (event) => {
    event.preventDefault();
    slidePage.style.marginLeft = `-${(100 / stepsNumber) * (current - 3)
      }%`;
    current = 1;
  })



  document.querySelector('.send').addEventListener('click', (event) => {


    event.preventDefault();
    document.querySelector('input').value = ''
    document.querySelector('select').value = ''

    saveUser = JSON.stringify(user)
    nameUser = user.first_name + ' ' + user.last_name

    localStorage.setItem(nameUser, saveUser)



  })

  function sendRequest(method, url, body = null) {
    return fetch(url).then(response => {
      if (response.ok) {
        return response.json()
      }
      return response.json().then(error => {
        const e = new Error('Something went wrong')
        e.data = error
        throw e
      })
    })
  }

  sendRequest('GET', 'specialization.json')
    .then(function (data) {

      let departments = Object.keys(data.departments);
      optionDepartment = ''
      for (el in departments) {
        optionDepartment += "<option value=" + el + ">" + departments[el] + "</option>"
      }
      document.querySelector('.departments').insertAdjacentHTML('beforeend', optionDepartment)






      let depObjs = Object.values(data.departments);


      document.querySelector('select.departments').addEventListener("change", function () {

        if (this.value !== '') {
          document.querySelector('select.vacancy').removeAttribute('disabled')

          depObjs.forEach((depObject, idx) => {
            if (this.value == idx) {
              optionVacancy = ''
              for (el in depObject) {
                optionVacancy += "<option value=" + el + ">" + depObject[el] + "</option>"
              }
              document.querySelector('.vacancy').innerHTML = optionVacancy
            }
          })
        }

        isValidate = true
      })
    })
    .catch(err => console.log(err))




})