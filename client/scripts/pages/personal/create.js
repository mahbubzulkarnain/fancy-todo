$(function () {
  $('#personalCreateForm').on('click', function (e) {
    e.preventDefault();
    let title = $('#personalCreateTitle').val();
    let description = $('#personalCreateDescription').val();
    $.post(`${baseurl}/todos/`, {
      title,
      description
    }, function ({response, error}, status) {
      if (status === 'success') {
        $('#personalList')
          .append(`
        <li class="list-group-item border-none border-bottom" onclick="personalRead('${response._id}')">
            <h5>${response.title}</h5>
            <p>${response.description}</p>
        </li>`);
        $('#personalCreate').modal('hide');
      }
    });
    return false;
  });
});