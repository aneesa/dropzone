# [Dropzone.js](http://www.dropzonejs.com/) & [dropzonejs-rails](https://github.com/ncuesta/dropzonejs-rails)

Examples of how to use Dropzone.js in rails. Download the ppt presentation [here](https://github.com/aneesa/dropzone/raw/master/Dropzone.pptx).

## Installation
1. `$bundle install`
2. `$rails s`
3. Open [http://localhost:3000/](http://localhost:3000/) in your browser

## What is Dropzone.js?
From its [website](http://www.dropzonejs.com/)
* open source library that provides drag’n’drop file uploads with image previews
* lightweight
* doesn’t depend on any other library like jQuery
* highly customizable

## How to use Dropzone.js in Rails?
Install [dropzonejs-rails](https://github.com/ncuesta/dropzonejs-rails)
* in _Gemfile_, add:
  * `gem 'dropzonejs-rails'`
* in _application.js_, add:
  * `//= require dropzone`
* in _application.css_ (optional), add:
  * `*= require dropzone/basic`
  * `*= require dropzone/dropzone`

## The most basic
```html
<form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone">
</form>
```

## Fallback (for browsers not supporting Dropzone.js)
```html
<form action="/file-upload" class="dropzone">
  <div class="fallback">
    <input name="file" type="file" multiple />
  </div>
</form>
```

## Programmatically
```javascript
// .js file
// javascript
$(function() {
  var myDropzone = new Dropzone("div#my-created-dropzone", { url: "/file/post"});
});

// or use jQuery
$("div#my-created-dropzone").dropzone({ url: "/file/post" });
```

```html
<div id="my-created-dropzone"
     style="height: 100px; width: 100%; border: 2px solid rgba(0, 0, 0, 0.3)">
</div>
```

## Configuration
```javascript
// .js file
// "myConfiguredDropzone" is the camelized version of the HTML element's ID
Dropzone.options.myConfiguredDropzone = {
  url: "/file/post",
};
```

```html
<div id="my-configured-dropzone" class="dropzone">
</div>
```

## Useful Configurations
Options
* maxFiles - limit max number of files
* maxFilesize - limit size of an individual file
* clickable - set an (array of) HTML element(s) or CSS selector(s) to trigger upload when clicked
* addRemoveLinks - add option to remove uploaded file
* dictDefaultMessage - set the default message
* previewTemplate - update Dropzone's CSS

Functions
* init - set up event listeners, etc
* accept - process a file as soon as it's dropped

## Disable auto discovery
```javascript
// Prevent Dropzone from auto discovering this element:
Dropzone.options.myAwesomeDropzone = false;

// This is useful when you want to create the
// Dropzone programmatically later

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;
```

## Default Dropzone Template
```html
<div class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-filename"><span data-dz-name></span></div>
    <div class="dz-size" data-dz-size></div>
    <img data-dz-thumbnail />
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-success-mark"><span>✔</span></div>
  <div class="dz-error-mark"><span>✘</span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
</div>
```
* to overwrite the default template, use the __previewTemplate__ config option
* use elements with the data-dz-* attributes - by default, Dropzone will look for these elements and update the content

## Prettified
```javascript
// .js file
Dropzone.options.myPrettifiedDropzone = {
  url: "/file/post",
  addRemoveLinks: true,
  accept: function(file, done) {
    $("div#my-prettified-dropzone").css({"height": "auto"});
    done();
  }
};
```

```html
<div id="my-prettified-dropzone"
         class="dropzone"
         style="border: 2px dashed rgba(0, 0, 0, 0.3);
                min-height: 100px !important;">
  <div class="dz-message"
       style="margin: 20px">
    Drag your cats' pics here! Or
    <button>
      select files
    </button>
  </div>
</div>
```

## Add Dropzone.js to an Existing RoR Form
* Can DZ be dropped directly in the form?
* Issues?
  * DZ itself is a form (& we cannot have nested forms)
    * Can we use main form’s post call?
  * Dropped files are not binded to the main form
* Workaround
  * Use DZ’s post call instead of the main form’s
    * Remove POST url from main form
    ```html
    <%= form_for :myDropzoneForm, html: {id: "dropzone-form-id"} do |f| %>
    ```
    * Doesn’t matter really, since it’s not going to be called
    * Add POST url to DZ
    ```
    ...
    url: "/welcome/create",
    ...
    ```
  * Put files in a queue when dropped (delay processing)
  ```
  // .js file
  ...
  autoProcessQueue: false,

  // upload multiple files
  uploadMultiple: true,
  ...
  ```
  * Submit main form
    * Stop main form from calling its post call & process/upload the files in queue
    ```
    // .js file
    ...
    init: function() {
      var myDropzone = this;

      var form = document.getElementById('dropzone-form-id');
      form.addEventListener('submit', function(event) {
        ...
        if(myDropzone.getQueuedFiles().length > 0){
          event.preventDefault();
          event.stopPropagation();
          myDropzone.processQueue();
        }
        ...
      })
      ...
    },
    ...
    ```
    * Assign the main form’s data to DZ’s form
    ```
    // .js file
    ...
    init: function() {
      var myDropzone = this;
      …
      // if uploadMultiple is false, use “sending” event instead
      myDropzone.on("sendingmultiple", function(file, xhr, formData) {
        formData.append("title", $('#myDropzoneForm_title').val());
        formData.append("text", $('#myDropzoneForm_text').val());
      });
      ...
    },
    ...
    ```
    * Access Form Data in Controller (via POST call)
    ```
    // controller.rb file
    ...
      def create
        # params will contain the form’s data
        # do what you want with the data here
        render plain: params.inspect
      end
    ...
    ```
    * Redirect in DZ after successful
    ```
    // .js file
    ...
    init: function() {
      ...
    },

    // if uploadMultiple is false, use “success” instead
    successmultiple: function(data,response) {
      alert(response);
      // redirect here
    }
    ...
    ```
    
### Full Code Example
```javascript
// .js file
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
```

```html
<%= form_for :myDropzoneForm, html: {id: "dropzone-form-id"} do |f| %>
  <p>
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </p>

  <p>
    <%= f.label :text %><br>
    <%= f.text_area :text %>
  </p>

  <div id="files-field"
       class="dropzone"
       style="border: 2px dashed rgba(0, 0, 0, 0.3);
              min-height: 100px !important;">
    <div class="dz-message"
         style="margin: 20px">
      Drag your cats' pics here! Or
      <button>
        select files
      </button>
    </div>
  </div>

  <p>
    <%= f.submit %>
  </p>
<% end %>
```
  
