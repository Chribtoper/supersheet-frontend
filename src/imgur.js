
// dropZone.addEventListener('mouseover', ()=> {
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Imgur = factory();
    }
}(this, function () {
    "use strict";
    var Imgur = function (options) {
        if (!this || !(this instanceof Imgur)) {
            return new Imgur(options);
        }

        if (!options) {
            options = {};
        }

        if (!options.clientid) {
            throw 'Provide a valid Client Id here: https://apidocs.imgur.com/';
        }

        this.clientid = options.clientid;
        this.endpoint = 'https://api.imgur.com/3/image';
        this.callback = options.callback || undefined;
        this.dropzone = document.querySelectorAll('.dropzone');

        this.run();
    };

    Imgur.prototype = {
        createEls: function (name, props, text) {
            var el = document.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            if (text) {
                el.appendChild(document.createTextNode(text));
            }
            return el;
        },
        insertAfter: function (referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        post: function (path, data, callback) {
            var xhttp = new XMLHttpRequest();

            xhttp.open('POST', path, true);
            xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 300) {
                        var response = '';
                        try {
                            response = JSON.parse(this.responseText);
                        } catch (err) {
                            response = this.responseText;
                        }
                        callback.call(window, response);
                    } else {
                        throw new Error(this.status + " - " + this.statusText);
                    }
                }
            };
            xhttp.send(data);
            xhttp = null;
        },
        createDragZone: function () {
            var p, input;

            p     = this.createEls('p', {}, 'Drag your files here or click in this area.');
            input = this.createEls('input', {type: 'file', multiple: 'multiple', accept: 'image/*'});

            Array.prototype.forEach.call(this.dropzone, function (zone) {
                zone.appendChild(p);
                zone.appendChild(input);
                this.status(zone);
                this.upload(zone);
            }.bind(this));
        },
        loading: function () {
            var div, img;

            div = this.createEls('div', {className: 'loading-modal'});
            img = this.createEls('img', {className: 'loading-image', src: './svg/loading-spin.svg'});

            div.appendChild(img);
            document.body.appendChild(div);
        },
        status: function (el) {
            var div = this.createEls('div', {className: 'status'});

            this.insertAfter(el, div);
        },
        matchFiles: function (file, zone) {
            var status = zone.nextSibling;

            if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
                document.body.classList.add('busy');
                status.classList.remove('bg-success', 'bg-danger');
                status.innerHTML = '';

                var fd = new FormData();
                fd.append('image', file);

                this.post(this.endpoint, fd, function (data) {
                    document.body.classList.remove('busy');
                    typeof this.callback === 'function' && this.callback.call(this, data);
                }.bind(this));
            } else {
                status.classList.remove('bg-success');
                status.classList.add('bg-danger');
                status.innerHTML = 'Invalid archive';
            }
        },
        upload: function (zone) {
            var events = ['dragenter', 'dragleave', 'dragover', 'drop'],
                file, target, i, len;

            zone.addEventListener('change', function (e) {
                if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                    target = e.target.files;

                    for (i = 0, len = target.length; i < len; i += 1) {
                        file = target[i];
                        this.matchFiles(file, zone);
                    }
                }
            }.bind(this), false);

            events.map(function (event) {
                zone.addEventListener(event, function (e) {
                    if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                        if (event === 'dragleave' || event === 'drop') {
                            e.target.parentNode.classList.remove('dropzone-dragging');
                        } else {
                            e.target.parentNode.classList.add('dropzone-dragging');
                        }
                    }
                }, false);
            });
        },
        run: function () {
            var loadingModal = document.querySelector('.loading-modal');

            if (!loadingModal) {
                this.loading();
            }
            this.createDragZone();
        }
    };

    return Imgur;
}));
// });
// do not touch above

let dropZone = document.querySelector('.dropzone')
let textBox = document.querySelector('#input-text')
let myInput = ""
//
let createSheet = document.querySelector('#create-sheet')
let newCsv = document.querySelector('#new-csv')
let sheetInput = ""
let productDropdown = document.querySelector("#pageSubmenu");
let selectSheet = document.querySelector("#select-sheet");
let hiddenNum = document.getElementById('hidden-num')
let postSheetId = "1"
let deleteButton = document.querySelector("#delete-button");
let csvTable = document.querySelector(".csv-table");
let tableBody = document.querySelector(".table-body");

let helpLink = document.querySelector("#help");
let helpSection = document.querySelector(".helpSection")
let sidebar = document.querySelector('#sidebar')


selectSheet.onchange = () => {postSheetId = event.target.value};
selectSheet.onclick = () => {postSheetId = event.target.value};

deleteButton.addEventListener('click', () => {
  let x = window.confirm("Are you sure you want to delete this?")
if (x){
  selectSheet.removeChild(document.getElementById(`selector-${postSheetId}`))
  productDropdown.removeChild(document.getElementById(`dropdown-${postSheetId}`))
  fetch(`http://localhost:3000/api/v1/product_sheets/${postSheetId}`, {
  method: 'DELETE'
})
} else {
  window.alert("Cancelled")
}

});

newCsv.addEventListener('click', () => {
  if (createSheet.value!=""){
    createSheet.value = ""
    fetch('http://localhost:3000/api/v1/product_sheets', {
    method: 'POST',
    headers: {
      "Content-Type" : "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      name: sheetInput
    })
  })
  .then( () => {
    fetch('http://localhost:3000/api/v1/product_sheets')
    .then( response => response.json())
    .then( json => {
      let jsonArr = json.map( (product) => product)
      let productId = jsonArr[jsonArr.length-1].id
      let productName = jsonArr[jsonArr.length-1].name
      selectSheet.innerHTML += `<option id="selector-${productId}" value="${productId}">${productName}</option>`
      productDropdown.innerHTML += `
      <li id="dropdown-${productId}" class="listy">
        <a href="#sheetSubmenu-${productId}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">${productName}</a>
        <ul class="collapse list-unstyled" id="sheetSubmenu-${productId}">
        <div class="flex">
          <a class="btn btn-info" href="http://localhost:3000/api/v1/product_sheets/download/${productId}">Download CSV</a>
          <a class="btn btn-warning" id="show-button-${productId}" data-id="${productId}">Display</a>
        </div>
        </ul>
      </li>
      `
    })
    .then( () => sheetInput = "")
    .then( () => {
      $('.listy').click( function(e) {
          $('.listy > .collapse').collapse('hide');
      });
    })
  })
} else {
  alert("Please enter a name!")
}

})

createSheet.addEventListener('keyup', () => {
  sheetInput = event.target.value
})

textBox.addEventListener('keyup', () => {
  myInput = event.target.value
});

helpLink.addEventListener('click', () => {
  if (helpLink.dataset.state === 'inactive') {
    // Render Help Guide
    helpLink.dataset.state = 'active'
    document.querySelectorAll('.btn.btn-warning').forEach( button => button.innerText = "Display")
    textBox.style.display = 'none'
    dropZone.style.display = 'none'
    csvTable.style.display = 'none'
    helpSection.style.display = 'block'
  } else if (helpLink.dataset.state === 'active') {
    helpLink.dataset.state = 'inactive'
    document.querySelectorAll('.btn.btn-warning').forEach( button => button.innerText = "Display")
    textBox.style.display = 'inline-block'
    dropZone.style.display = 'block'

    helpSection.style.display = 'none'
  }
})

sidebar.addEventListener('click', () => {
  if (event.target.id !== 'help') {
    helpLink.dataset.state = 'inactive'
    helpSection.style.display = 'none'
  }
})

productDropdown.addEventListener('click', () => {
  if (event.target.classList.value === "btn btn-warning") {
    let sheetId = event.target.dataset.id
    if (event.target.innerText === "Display") {
      // Hide Dropzone
      tableBody.innerHTML = ""

      dropZone.style.display = 'none'
      textBox.style.display = 'none'

      // Show Table
      csvTable.style.display = 'block'

      // Fetch data to fill in csvTable
      fetch(`http://localhost:3000/api/v1/product_sheets/${sheetId}`)
      .then(response => response.json())
      .then(productSheet => {
        productSheet.products.forEach(product => {
          let id = product.id
          let name = product.name
          let tags = product.tags
          let price = product.price
          let url = product.url
          tableBody.innerHTML += `
          <tr>
            <th scope="row">${id}</th>
            <td style="font-size:14px">${name}</td>
            <td style="font-size:14px">${tags}</td>
            <td style="font-size:14px">${price}</td>
            <td><a href="${url}"><div class="img" style="background-image:url(${url});"></div></a></td>
          </tr>
          `
        })
      })
      document.querySelectorAll('.btn.btn-warning').forEach( (button) => {
        if (button.dataset.id != sheetId){
          button.innerText = "Display"
        }
      })

      // End Fetch request


      event.target.innerText = "Go Back"
    } else if(event.target.innerText === "Go Back") {
      document.querySelectorAll('.btn.btn-warning').forEach( button => button.innerText = "Display")
      // Show Dropzone
      dropZone.style.display = 'block'
      // Hide Table
      tableBody.innerHTML = ""
      csvTable.style.display = 'none'
      textBox.style.display = 'inline-block'
      event.target.innerText = "Display"
    }
  }
})

  var callback = function (res) {
     if (res.success === true) {
         textBox.value = ""
         console.log(res.data.link);
         fetch('http://localhost:3000/api/v1/products', {
         method: 'POST',
         headers: {
           "Content-Type" : "application/json; charset=utf-8"
         },
         body: JSON.stringify({
           url: res.data.link,
           price: myInput,
           product_sheet_id: postSheetId
         })
       }).then(response => myInput = "")
     }
 };
 new Imgur({
     clientid: '8aa7ff5bb8fbd89',
     callback: callback
 });
