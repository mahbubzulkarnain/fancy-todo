$(function () {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      client_id: '577955257208-bnmka8aiqq9ho0qivjuadqm529ege0aj.apps.googleusercontent.com',
    });
    attachSignin(document.getElementById('customBtn'))
  });

  if (localStorage.getItem('accessToken')) {
    checkLogin(localStorage.getItem('accessToken'))
  } else {
    isNotLogin()
  }

  $('#formLogin').on('click', function (e) {
    e.preventDefault();
    let email = $('#emailLogin').val();
    let password = $('#passwordLogin').val();
    $.post(`${baseurl}/auth/login`, {
      email,
      password
    }, function ({response, error}, status) {
      if (status === 'success') {
        localStorage.setItem('accessToken', response.token);
        isLogin = true;
        triggerLogin();
        if (response.picture) {
          $('#navbarDropdown')
            .html(`<img src="${response.picture}" alt="${response.name}" style="width: 30px;height: 30px;border-radius: 50%;"><span class="pl-2 pr-2">${response.name.split(' ')[0]}</span>`);
        }
      }
    });
    return false;
  });
});

function signIn(googleUser) {
  const {id_token} = googleUser.getAuthResponse();
  checkLogin(id_token)
}

function checkLogin(id_token) {
  $.post(`${baseurl}/auth/verify`, {
    id_token: id_token
  }, function (data, status) {
    if (status === 'success') {
      localStorage.setItem('accessToken', data.token);
      isLogin = true;
      triggerLogin();
      let html = ``;
      if (data.picture) {
        html += `<img src="${data.picture}" alt="${data.name}" style="width: 30px;height: 30px;border-radius: 50%;">`;
      }
      $('#navbarDropdown')
        .html(`${html}<span class="pl-2 pr-2">${data.name.split(' ')[0]}</span>`);
    }
  })
    .fail((err) => {
      console.log(errParser(err));
      isNotLogin()
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
    .then(function () {
      localStorage.clear();
      isNotLogin()
    })
}

function isNotLogin() {
  isLogin = false;
  triggerLogin();
}

function attachSignin(element) {
  auth2.attachClickHandler(element, {},
    signIn, function (error) {
      console.log(errParser(error))
    })
}
