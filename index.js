(function($, Fingerprint, md5) {
  if (document.getElementById('meatfree-container') instanceof HTMLElement) {
    $('#meatfree-container').show()
    return;
  }

  $.get('/ip?t=' + new Date().getTime(), function(data) {
    var ip = data.ip;

    var fingerprint = new Fingerprint({canvas: true}).get();
    var userId = md5(fingerprint + ip);
    var channel = document.getElementById('channel');
    var message = document.getElementById('composer-message');
    var reader = new FileReader();
    var postBody = {channel: channel.dataset.channel, fingerprint: fingerprint, userid: userId};

    var container = document.createElement('div');
    container.id = 'meatfree-container';
    container.innerHTML = '<div id="meatfree-modal">' +
      '<div id="meatfree-drop"><p id="meatfree-help">Drop file here</p></div>' +
      '<input type="file" id="meatfree-picture">' +
      '<a id="meatfree-close">Close</a>' +
      '<a id="meatfree-submit">Submit</a>' +
      '</div>'
    document.body.appendChild(container);

    var picBtn = document.getElementById('meatfree-picture');
    var picDrop = document.getElementById('meatfree-drop');
    $(picBtn).hide();

    //Add menu items
    var menu = document.getElementById('menu-list');
    var menuItem = document.createElement('li');
    menuItem.innerHTML = '<a href="#">Choose Photo</a>';
    menuItem.addEventListener('click', function (e) {
      $(container).fadeToggle();
    });
    menu.appendChild(menuItem);

    var clickDelegate = function(e) {
      switch (e.target.id) {
        case 'meatfree-close':
          e.preventDefault();
          $(container).fadeOut();
          break;

        case 'meatfree-submit':
          e.preventDefault();
          var submission = $('#composer-form input').toArray()
          .reduce(function createSub(data, input) {
            return (data[input.name] = input.value, data);
          }, postBody);

          $.post('/c/' + postBody.channel + '/chat', submission)
          .error(function (data) {
            alert(data.responseJSON.error);
          })
          .success(function() {
            picDrop.style.backgroundColor = 'transparent';
          });
      }
    };


    // Create stylez.
    var css = '#meatfree-container {' +
        'position : fixed;' +
        'width: 225px;' +
        'top: ' + document.height / 2 + 'px;' +
        'background-color: rgba(0, 0, 0, 0.48);' +
        'color : #fff;' +
      '}' +
      '#meatfree-modal  {' +
        'margin: 20px;' +
      '}' +
      '#meatfree-help  {' +
        'margin: 23px;' +
        'margin-top: 30px;' +
      '}' +
      '#meatfree-container a {' +
        'padding: 9px;' +
        'cursor: pointer;' +
        'color: #287e8d;' +
        'line-height: 38px;' +
        'margin: 13px;' +
        'background-color: #31dfff;' +
      '}' +
      '#meatfree-container a:hover {' +
        'background-color: #fff;' +
        'color: #111;' +
      '}' +
      '#meatfree-drop {' +
        'height: 80px;' +
        'border: 5px white dashed;' +
        'margin: 16px;' +
      '}';

    var stylez = document.createElement('style');
    stylez.innerText = css;
    document.head.appendChild(stylez);

    var resize = function() {
      container.style.left = Math.floor(window.innerWidth / 2) - Math.floor(container.offsetWidth / 2) + 'px';
      container.style.top = Math.floor(window.innerHeight / 2) - Math.floor(container.offsetHeight / 2) + 'px';
    }
    resize();

    // Add events.
    message.addEventListener('blur', function messageChange(e) {
      postBody.message = e.target.value;
    })

    container.addEventListener('click', clickDelegate);

    reader.onload = function(e) {
      postBody.picture = reader.result;
    }

    var fileHandler = function(e) {
      e.stopPropagation();
      e.preventDefault();
      var files = e.target.files || e.dataTransfer.files;
      reader.readAsDataURL(files[0]);
      picDrop.style.backgroundColor = 'rgba(143, 253, 152, 0.458824)';
    }

    var fileDragHover = function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.type == 'dragover') {
        this.style.backgroundColor = 'rgba(49, 223, 255, 0.46)';
      }
      if (e.type == 'dragleave') {
        this.style.backgroundColor = 'transparent';
      }
    }

    window.addEventListener('resize', resize);
    picBtn.addEventListener('change', fileHandler);
    picDrop.addEventListener('drop', fileHandler);
    picDrop.addEventListener('dragover', fileDragHover);
    picDrop.addEventListener('dragleave', fileDragHover);
  });
})(jQuery, require('fingerprint'), require('md5'));
