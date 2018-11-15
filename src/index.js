document.addEventListener('DOMContentLoaded', () => {
  $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });

  });
    let productDropdown = document.querySelector("#pageSubmenu");
    let selectSheet = document.querySelector("#select-sheet");
    let hiddenNum = document.getElementById('hidden-num')
  fetch('http://localhost:3000/api/v1/product_sheets')
  .then( response => response.json())
  .then( json => {
    let allSheets = json.map( (sheet) => {
      selectSheet.innerHTML += `<option id="selector-${sheet.id}" value="${sheet.id}">${sheet.name}</option>`
      return `
      <li id="dropdown-${sheet.id}" class="listy">
        <a href="#sheetSubmenu-${sheet.id}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">${sheet.name}</a>
        <ul class="collapse list-unstyled" id="sheetSubmenu-${sheet.id}">
        <div class="flex">
          <a class="btn btn-info" href="http://localhost:3000/api/v1/product_sheets/download/${sheet.id}">Download CSV</a>
                    <a class="btn btn-warning" id="show-button-${sheet.id}" data-id="${sheet.id}">Display</a>
        </div>
        </ul>
      </li>
      `
    }).join('')
    productDropdown.innerHTML = allSheets //try returning this
  }).then(() => {
    $('.listy').click( function(e) {
        if ((event.target.classList.value === "btn btn-warning") ||
            (event.target.classList.value === "btn btn-info")) {
            // You're good, don't do anything.
        } else {
          $('.listy > .collapse').collapse('hide');
        }
    });
  })

}); // End DOMContentLoaded
