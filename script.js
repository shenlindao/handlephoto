$(document).ready(function () {

  var ALLOWED_FORMATS = [
    "jpg", "gif", "bmp",
    "png", "jpeg", "webp",
  ]
  var MAX_SIZE = 2097152;
  var MAX_FILES = 11;

  var fd = new FormData($("#rew1")[0]);


  function deletePhoto(el) {
    var delbtn =$(el)
    var fdPhotos = fd.getAll("photos");
    var fileName = delbtn.attr('data-name');
    var fdiltered = fdPhotos.filter(f => f.name !== fileName);
    fd.delete("photos");
    for (var i = 0; i < fdiltered.length; i++) {
      fd.append("photos", fdiltered[i], fdiltered[i].name);
    };
    delbtn.parent().remove();
  }

  function handlePhotoInput(input) {
    var files = input.files;

    if (files.length + fd.getAll("photos").length > MAX_FILES) {
      alert(`Можно добавить не более ${MAX_FILES - 1} файлов!`)
      return
    }
    for (var i = 0; i < files.length; i++) {
      if (!ALLOWED_FORMATS.includes(files[i].type.split('/')[1])) {
        alert("Загрузить можно только изображения");
        return
      } else if (files[i].size > MAX_SIZE) {
        alert(`Каждое фото должно весить не более ${MAX_SIZE / 1024 ** 2} МБ`);
        return
      } else {
        fd.append("photos", files[i], files[i].name);
      }
    }

    var fileList = $("#filelist");
    for (var i = 0; i < files.length; i++) {
      var name = files[i].name;
      var fileInList = $("<div class='file-in-list'></div>");
      var p = $("<p></p>").text(name);
      var img = $("<img></img>");
      var photoContainer = $("<div class='photo_container'></div>");
      var x = $("<span class='x-photo'>x</span>");

      fileList.append(fileInList);
      fileInList.append(p);
      fileInList.append(photoContainer);
      fileInList.append(x);
      x.attr("data-name", files[i].name);
      photoContainer.append(img);
      img.attr("src", URL.createObjectURL(files[i]));
      img.attr("alt", name);
    };
    $(".x-photo").click(function() {
      deletePhoto(this)
    })
  }

  $("#rew1").submit(function (event) {
    event.preventDefault();
    console.log("Form on submit");
    for (var [key, value] of fd.entries()) {
      console.log(key, value);
    }
    console.log("Files", fd.getAll("photos").length);
  });
  


  $("#rew1").change(function (event) {
    var input = event.target;
    var inputName = event.target.getAttribute("name");

    if (inputName === "photos") {
      handlePhotoInput(input);
    } else {
      fd.set(inputName, input.value);
    }
  });
});