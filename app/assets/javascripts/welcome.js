// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

$(function() {
  var myDropzone = new Dropzone("div#my-created-dropzone", { url: "/file/post"});

  // "myConfiguredDropzone" is the camelized version of the HTML element's ID
  Dropzone.options.myConfiguredDropzone = {
    url: "/file/post"
  };

  Dropzone.options.myPrettifiedDropzone = {
    url: "/file/post",
    addRemoveLinks: true,
    accept: function(file, done) {
      $("div#my-prettified-dropzone").css({"height": "auto"});
      done();
    }
  };

  Dropzone.options.filesField = {
    url: "/welcome/create",
    addRemoveLinks: true,
    autoProcessQueue: false,
    uploadMultiple: true,
    accept: function(file, done) {
      $("div#files-field").css({"height": "auto"});
      done();
    },
    init: function() {
      var myDropzone = this;

      var form = document.getElementById('dropzone-form-id');
      form.addEventListener('submit', function(event) {
        // stop the form's submit event
        if(myDropzone.getQueuedFiles().length > 0){
          event.preventDefault();
          event.stopPropagation();
          myDropzone.processQueue();
        }
      });

      myDropzone.on("sendingmultiple", function(file, xhr, formData) {
        formData.append("title", $('#myDropzoneForm_title').val());
        formData.append("text", $('#myDropzoneForm_text').val());
      });
    },
    successmultiple: function(data,response) {
      alert(response);
    }
  };
});
