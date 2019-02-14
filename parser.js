$(document).ready(function() {
  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    console.log(event.target.result);
    parseInfoCSV(event.target.result);
  }

  $(".add-title-btn").click(function() {
    $(".key-container").append(
      '<div class="input-field col s6">' +
        '<input placeholder="Title 1" id="title-1" type="text" />' +
        "</div>"
    );
  });

  document.getElementById("input").addEventListener("change", onChange);
});

function parseInfoCSV(content) {
  var res = content.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).filter(function(x) {
    if (x != "") {
      return x;
    }
  });

  var keys = [];
  var isKeyComplete = false;

  for (var i = 0; i < res.length; i++) {
    //Grabs the Student ID
    if (res[i].includes("\n")) {
      isKeyComplete = true;
      var temp = res[i].split("\n");
      if (!isNaN(temp[1])) {
        console.log(temp[1]);
      }
    }

    //Grabs the keys
    if (isKeyComplete == false) {
      keys.push(res[i]);
    }
  }

  console.log(res);

  console.log(keys);
}

function createDictionary(keysArray, value) {
  var ret = {};
  for (var i = 0; i < keysArray.length; i++) {
    ret.add(keysArray[i], value);
  }
}
