function errParser(err) {
  const error = JSON.parse(err.responseText);
  return error.message || ''
}

function triggerLogin() {
  if (!isLogin) {
    $('.is-login').hide();
    $('.is-not-login').show()
  } else {
    $('.is-login').show();
    $('.is-not-login').hide();
  }
}

function switchPage() {
  sessionStorage.setItem('page', page);
  $('#appBody')
    .empty()
    .html(body);
}