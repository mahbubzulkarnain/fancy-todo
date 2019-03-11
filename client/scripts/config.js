const baseurl = 'http://localhost:3000';
var isLogin = false;
var page = sessionStorage.getItem('page') || 'home';
var projectID = '', todoID = '', itemID = '';
var body = '';

$.ajaxSetup({
  beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('accessToken') || '')
  }
});