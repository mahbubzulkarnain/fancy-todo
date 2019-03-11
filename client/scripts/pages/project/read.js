function projectRead(id) {
  $.get(`${baseurl}/projects/${id}`, function ({response, error}, status) {
    if (status === 'success') {
      $('#homePage').hide();
      $('#projectReadPage')
        .html(`
<div class="row">
  <div class="col-6 offset-3">
    <button type="button" class="close" onclick="dismissReadDetail()">&times;</button>
    <div id="projectReadDetail"></div>
    <ul class="list-group" id="projectReadList"></ul>  
  </div>      
</div>      
        `);
      let project = response;
      $('#projectReadDetail')
        .html(`
        <h5>${project.title}</h5>
        <p>${project.description}</p>
        `);

      let html = '';
      for (let i = 0; i < project.todos.length; i++) {
        let item = project.todos[i];
        html += `
        
        `
      }
      $('#projectReadList').html(html)
    }else{
      $('#homePage').show();
    }
  })

}