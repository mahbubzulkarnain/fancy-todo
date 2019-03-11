$('#homePage')
  .html(`
<div class="row">
    <div class="col-6 offset-3">
    <ul class="nav nav-tabs nav-justified" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="project-tab" data-toggle="tab" href="#project" role="tab" aria-controls="project" aria-selected="true">Project</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="personal-tab" data-toggle="tab" href="#personal" role="tab" aria-controls="personal" aria-selected="false">Personal</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="project" role="tabpanel" aria-labelledby="project-tab">
        <ul id="projectList" class="list-group"></ul>
      </div>
      <div class="tab-pane fade" id="personal" role="tabpanel" aria-labelledby="personal-tab">
        <ul id="personalList" class="list-group"></ul>
      </div>
    </div>
  </div>
</div>    
    `);

$.get(`${baseurl}/projects/`, function ({response, error}, status) {
  let html = `
    <li class="list-group-item border-none border-bottom" data-toggle="modal" data-target="#projectCreate">
        <button class="btn btn-success btn-sm" style="width: 100%;">Add Project</button>
    </li>`;
  if (status === 'success') {
    for (let i = 0; i < response.length; i++) {
      let item = response[i];
      html += `
        <li class="list-group-item border-none border-bottom" onclick="projectRead('${item._id}')">
            <h5>${item.title}</h5>
            <p>${item.description}</p>
        </li>
        `
    }
  }
  $('#projectList').html(html)
});

$.get(`${baseurl}/todos/`, function ({response, error}, status) {
  let html = `
    <li class="list-group-item border-none border-bottom" data-toggle="modal" data-target="#personalCreate">
        <button class="btn btn-success btn-sm" style="width: 100%;">Add Todo</button>
    </li>`;
  if (status === 'success') {
    for (let i = 0; i < response.length; i++) {
      let item = response[i];
      html += `
        <li class="list-group-item border-none border-bottom" id="personalItem${item._id}" onclick="personalRead('${item._id}')">
            <h5>${item.title}</h5>
            <p>${item.description}</p>
        </li>
        `
    }
  }
  $('#personalList').html(html)
});

function dismissReadDetail() {
  $('#projectReadPage').empty();
  $('#personalReadPage').empty();
  $('#homePage').show();
}