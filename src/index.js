document.addEventListener('DOMContentLoaded', () => {
  $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });

  });
    let productDropdown = document.querySelector("#pageSubmenu");
    let selectSheet = document.querySelector("#select-sheet");

  fetch('http://localhost:3000/api/v1/product_sheets')
  .then( response => response.json())
  .then( json => {
    let allSheets = json.map( (sheet) => {
      selectSheet.innerHTML += `<option value="${sheet.id}">${sheet.name}</option>`
      return `
      <li>
        <a href="#sheetSubmenu-${sheet.id}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">${sheet.name}</a>
        <ul class="collapse list-unstyled" id="sheetSubmenu-${sheet.id}">
        <a class="btn btn-info" href="http://localhost:3000/api/v1/product_sheets/download/${sheet.id}">Download CSV</a>
        </ul>
      </li>
      `
    }).join('')
    productDropdown.innerHTML = allSheets //try returning this
  })

}); // End DOMContentLoaded
