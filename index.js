(function($, Fingerprint, md5) {

  $.get("/ip?t=" new Date().getTime(), function(data) {
  
  var fingerprint = new Fingerprint({canvas: true}).get(),
      ip = data.ip,
      userId = md5(fingerprint + ip);
  
  var MeatFree = function() {
    this.fadeMenu(2)
    if (document.getElementById('meatfree-container') instanceof HTMLElement) {
      return
    }
    var channel = document.getElementById('channel')
    this.reader = new FileReader()
    this.postBody = {channel: channel.dataset.channel}
    this.buildCredsModal()
    this.buildModal()
    this.addMenuItems()
    this.addStyles()
    this.addEvents()
    this.render()
  }

  MeatFree.prototype.fadeMenu = function(num) {
    var self = this
    if (num === 0) {
      return
    }

    $('#menu-button').fadeOut(300, function() {
      $(this).fadeIn(300)
      self.fadeMenu(num - 1)
    })
  }


  MeatFree.prototype.buildCredsModal = function() {
    this.credsModal = document.createElement('div')
    this.meatMenu =  document.createElement('a')
    this.useridLabel =  document.createElement('label')
    this.userid =  document.createElement('input')
    this.fingerprintLabel =  document.createElement('label')
    this.fingerprint =  document.createElement('input')
  }

  MeatFree.prototype.buildModal = function() {
    this.container = document.createElement('div')
    this.modal = document.createElement('div')
    this.submit =  document.createElement('a')
    this.picBtn = document.createElement('input')
    this.picDrop = document.createElement('div')
    this.closeBtn =  document.createElement('a')
    this.message = document.getElementById('composer-message')
  }

  MeatFree.prototype.addMenuItems = function() {
    var self = this
    var menu = document.getElementById('menu-list')

    var menuItem = document.createElement('li')
    menuItem.addEventListener('click', function (e) {
      $(self.container).fadeToggle()
    })
    menuItem.innerHTML = '<a href="#">Choose Photo</a>'
    menu.appendChild(menuItem)

    var clearBtn = document.createElement('li')
    clearBtn.addEventListener('click', function (e) {
      window.localStorage.removeItem('meatfree-userid')
      window.localStorage.removeItem('meatfree-fingerprint')
      self.fingerprint.value = ''
      self.userid.value = ''
      self.postBody.fingerprint  = ''
      self.postBody.userid = ''
    })
    clearBtn.innerHTML = '<a href="#">Clear Fingerprint</a>'
    menu.appendChild(clearBtn)
  }

  MeatFree.prototype.render = function() {
    this.modal.appendChild(this.picDrop)
    this.modal.appendChild(this.picBtn)
    this.modal.appendChild(this.closeBtn)
    this.modal.appendChild(this.submit)
    this.modal.appendChild(this.meatMenu)

    this.credsModal.appendChild(this.useridLabel)
    this.credsModal.appendChild(this.userid)
    this.credsModal.appendChild(this.fingerprintLabel)
    this.credsModal.appendChild(this.fingerprint)

    this.container.appendChild(this.modal)
    this.container.appendChild(this.credsModal)

    $(this.container).hide()
    document.body.appendChild(this.container)
  }

  MeatFree.prototype.addEvents = function() {
    var self = this

    this.reader.onload = function(e) {
      self.postBody.picture = self.reader.result
    }

    var fileHandler = function(e) {
      e.stopPropagation()
      e.preventDefault()
      var files = e.target.files || e.dataTransfer.files;
      self.reader.readAsDataURL(files[0])
      self.picDrop.style.backgroundColor = 'rgba(143, 253, 152, 0.458824)'
    }

    var fileDragHover = function(e) {
      e.stopPropagation()
      e.preventDefault()
      if (e.type == 'dragover') {
        this.style.backgroundColor = 'rgba(49, 223, 255, 0.46)'
      }
      if (e.type == 'dragleave') {
        this.style.backgroundColor = 'transparent'
      }
    }

    this.picBtn.addEventListener('change', fileHandler)
    this.picDrop.addEventListener('drop', fileHandler)
    this.picDrop.addEventListener('dragover', fileDragHover)
    this.picDrop.addEventListener('dragleave', fileDragHover)

    this.container.addEventListener('keydown', function(e) {
      e.stopPropagation()
    })

    this.message.addEventListener('blur', function messageChange(e) {
      self.postBody.message = e.target.value
    })

    this.userid.addEventListener('blur', function useridChange(e) {
      self.postBody.userid = e.target.value
      window.localStorage.setItem('meatfree-userid', self.postBody.userid)
    })

    this.fingerprint.addEventListener('blur', function fingerprintChange(e) {
      self.postBody.fingerprint = e.target.value
      window.localStorage.setItem('meatfree-fingerprint', self.postBody.fingerprint)
    })

    this.closeBtn.addEventListener('click', function(e){
      e.preventDefault()
      $(self.container).fadeOut();
    })

    this.meatMenu.addEventListener('click', function(e) {
      e.preventDefault()
      $(self.credsModal).slideToggle()
    })

    this.submit.addEventListener('mouseover', function(e){
      this.style.color = '#31dfff'
    })
    this.submit.addEventListener('mouseout', function(e){
      this.style.color = '#fff'
    })
    this.closeBtn.addEventListener('mouseover', function(e){
      this.style.color = '#31dfff'
    })
    this.closeBtn.addEventListener('mouseout', function(e){
      this.style.color = '#fff'
    })
    this.meatMenu.addEventListener('mouseover', function(e){
      this.style.color = '#31dfff'
    })
    this.meatMenu.addEventListener('mouseout', function(e){
      this.style.color = '#fff'
    })
    this.submit.addEventListener('click', function(e){
      e.preventDefault()
      var submission = $('#composer-form input').toArray()
      .reduce(function createSub(data, input) {
        return (data[input.name] = input.value, data);
      }, self.postBody)

      $.post('/c/' + self.postBody.channel + '/chat', submission)
      .error(function (data) {
        alert(data.responseJSON.error);
      })
      .success(function() {
        $(self.container).hide()
      })
    })


  }

  MeatFree.prototype.addStyles = function() {
    var userid = ''
    var fingerprint = ''

    if (typeof window.localStorage.getItem('meatfree-userid') === 'string') {
      userid = window.localStorage.getItem('meatfree-userid')
    }
    if (typeof window.localStorage.getItem('meatfree-fingerprint') === 'string') {
      fingerprint = window.localStorage.getItem('meatfree-fingerprint')
    }

    if (userid !== '' && fingerprint !== '') {
      $(this.credsModal).hide()
    }

    this.container.style.position = 'fixed';
    this.container.id = 'meatfree-container'
    this.container.style.left = (window.innerWidth / 2) - ( this.container.offsetWidth / 2  ) + 'px'
    this.container.style.width = '225px'
    this.container.style.top = '100px'
    this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.48)'
    this.container.style.color = '#fff'

    this.credsModal.id = 'meatfree-creds'
    this.credsModal.style.padding = '20px'
    this.credsModal.style.backgroundColor = 'rgba(106, 107, 104, 0.2)'

    this.modal.style.padding = '20px'

    this.submit.innerText = 'Submit'
    this.submit.style.cursor = 'pointer'
    this.submit.style.padding = '10px'

    this.picDrop.id = 'pic-drop'
    this.picDrop.style.height = '80px'
    this.picDrop.style.border = '5px white dashed'
    this.picDrop.style.margin = '10px'

    this.picBtn.type = 'file'
    this.picBtn.id = 'picture'
    $(this.picBtn).hide()

    this.useridLabel.innerText = 'User ID:'
    this.useridLabel.htmlFor = 'meatfree-userid'
    this.userid.type = 'text'
    this.userid.id = 'meatfree-userid'
    this.userid.value = userid
    this.postBody.userid = userid
    this.userid.size = 32
    this.userid.style.backgroundColor = 'rgba(0,0,0,0.1)'
    this.userid.style.padding = '10px'
    this.userid.style.margin = '10px'
    this.userid.style.width = '75%'
    this.userid.style.border = 'none'
    this.userid.style.color = '#fff'

    this.fingerprintLabel.innerText = 'Fingerprint:'
    this.fingerprintLabel.htmlFor = 'meatfree-fingerprint'
    this.fingerprint.type = 'text'
    this.fingerprint.id = 'meatfree-fingerprint'
    this.fingerprint.value = fingerprint
    this.postBody.fingerprint = fingerprint
    this.fingerprint.style.backgroundColor = 'rgba(0,0,0,0.1)'
    this.fingerprint.style.padding = '10px'
    this.fingerprint.style.margin = '10px'
    this.fingerprint.style.width = '75%'
    this.fingerprint.style.border = 'none'
    this.fingerprint.style.color = '#fff'

    this.closeBtn.innerText = 'Close'
    this.closeBtn.style.padding = '10px'
    this.closeBtn.style.cursor = 'pointer'

    this.meatMenu.innerText = '≡'
    this.meatMenu.style.fontSize = '33px'
    this.meatMenu.style.padding = '10px'
    this.meatMenu.style.cursor = 'pointer'
  }

  var meatfree = new MeatFree()
  
  });
  
})(jQuery, require("fingerprint"), require("md5"))
