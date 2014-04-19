(function($) {
  var MeatFree = function() {
    this.substub = {}
    // this.buildCredsModal()
    this.buildModal()
    this.addStyles()
    this.addEvents()
    this.render()
  }

  // MeatFree.prototype.buildCredsModal = function() {
  //   this.credsModal = document.createElement('div')
  //   this.status = document.createElement('div')
  //   this.credSubmit =  document.createElement('button')
  //   this.userid =  document.createElement('input')
  //   this.fingerprint =  document.createElement('input')
  // }

  MeatFree.prototype.buildModal = function() {
    this.modal = document.createElement('div')
    this.status = document.createElement('div')
    this.submit =  document.createElement('button')
    this.picBtn = document.createElement('input')
    this.userid =  document.createElement('input')
    this.fingerprint =  document.createElement('input')
    this.closeBtn =  document.createElement('button')
    this.reader = new FileReader()
  }

  MeatFree.prototype.render = function() {
    this.modal.appendChild(this.status)
    this.modal.appendChild(this.picBtn)
    this.modal.appendChild(this.userid)
    this.modal.appendChild(this.fingerprint)
    this.modal.appendChild(this.closeBtn)
    this.modal.appendChild(this.submit)
    document.body.appendChild(this.modal)
  }

  MeatFree.prototype.fileHandler = function(e) {
    var img = e.target.files[0]
    this.reader.onload = function(file) {
      picture = 'data:image/jpeg;base64,' + btoa(file.result)
      console.log(picture)
      channel = $('#channel').data('channel')
      this.substub = { picture: picture, userid: this.userid.innerText, fingerprint: this.fingerprint.innerText, channel: channel}
      console.log(this.substub)
    }
    reader.readAsBinaryString(img)
  }

  MeatFree.prototype.addEvents = function() {
    this.modal.addEventListener('keydown', function(e) {
      e.stopPropagation()
    })


    this.closeBtn.addEventListener('click', function(e){
      // $(this.modal).hide();
    })

    this.submit.addEventListener('click', function(e){
      console.log($('#composer-form input')
      var submission = $('#composer-form input')
      .toArray()
      .reduce(function(data, input) {
        return (data[input.name] = input.value, data);
      }, this.substub)

      $.post('/c/' + channel + '/chat', submission)
      .error(function (data) {
        alert(data.responseJSON.error);
      })
      .success(function() {
        $(this.modal).hide()
      })
    })

    this.reader.addEventListener('progress', function(e){
      status.innerText = 'Uploading'
    })

  }

  MeatFree.prototype.addStyles = function() {
    console.log(this)
    this.modal.style.position = 'fixed';
    this.modal.id = 'modal'
    this.modal.style.left = window.innerWidth / 2 - ( this.modal.offsetWidth / 2  ) + 'px'
    this.modal.style.top = window.innerHeight / 2 - ( this.modal.offsetHeight / 2  ) + 'px'
    this.modal.style.backgroundColor = '#31dfff'

    this.status.id = 'status'

    this.submit.innerText = 'Submit'

    this.picBtn.type = 'file'

    this.userid.type = 'text'
    this.userid.id = 'user-id'
    this.userid.placeolder = 'Yo'

    this.fingerprint.type = 'text'
    this.fingerprint.id = 'fingerprint'
    this.fingerprint.value = 'Fingerprint'

    this.closeBtn.innerText = 'X'
  }

  var meatfree = new MeatFree()
})(jQuery)

