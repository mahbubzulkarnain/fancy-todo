function personalRead(id) {
  $.get(`${baseurl}/todos/${id}`, function ({response, error}, status) {
    if (status === 'success') {
      $('#homePage').hide();
      $('#personalReadPage')
        .html(`
<div class="row">
  <div class="col-6 offset-3">
    <button type="button" class="close" onclick="dismissReadDetail()">&times;</button>
    <div id="personalReadDetail"></div>
    <ul class="list-group" id="personalReadList"></ul>  
  </div>      
</div>      
        `);
      let personal = response;
      $('#personalReadDetail')
        .html(`
        <h5>${personal.title}</h5>
        <p>${personal.description}</p>
        <button class="btn btn-danger" style="width: 100%" onclick="personalDelete('${personal._id}')">Delete</button>
        <hr>
        `);

      let html = '';
      for (let i = 0; i < personal.items.length; i++) {
        let item = personal.items[i];
        html += `
        <li class="list-group-item border-none border-bottom" style="padding-left: 0;padding-right: 0;">
            <h6>${item.title}</h6>
            <select onchange="onchangePersonalStatusTodo('${personal._id}','${item._id}', this)" class="input-group">
                <option value="backlog" ${item.status === 'backlog' ? 'selected' : ''}>Backlog</option>
                <option value="ongoing" ${item.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                <option value="hold" ${item.status === 'hold' ? 'selected' : ''}>Hold</option>
                <option value="review" ${item.status === 'review' ? 'selected' : ''}>Review</option>
                <option value="done" ${item.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
        </li>
        `
      }
      $('#personalReadList').html(html)
    } else {
      $('#homePage').show();
    }
  })
}

function personalDelete(todo) {
  $.ajax({
    url: `${baseurl}/todos/${todo}`,
    type: 'DELETE',
    success: function ({response}) {
      dismissReadDetail();
      $(`#personalItem${response._id}`).remove()
    },
    error: function (err) {
      console.log(err)
    }
  });
}

function onchangePersonalStatusTodo(todo, item, e) {
  $.post(`${baseurl}/todos/${todo}/items/${item}/status`, {status: e.value}, function ({response}, status) {
    if (status === 'success') {
      console.log(response)
    }
  });
}