$(function () {
  $('#projectCreateForm').on('click', function (e) {
    e.preventDefault();
    let title = $('#projectCreateTitle').val();
    let description = $('#projectCreateDescription').val();
    $.post(`${baseurl}/projects/`, {
      title,
      description
    }, function ({response, error}, status) {
      if (status === 'success') {
        $('#projectList')
          .append(`
        <li class="list-group-item border-none border-bottom" onclick="projectRead('${response._id}')">
            <h5>${response.title}</h5>
            <p>${response.description}</p>
        </li>`);
        $('#projectCreate').modal('hide');
      }
    });
    return false;
  });
});