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
  var keyCounter = 0;
  var isKeyComplete = false;
  var currentStudentInfo = {};
  var arrStudentDict = [];

  for (var i = 0; i < res.length; i++) {
    //Grabs the Student ID for first dictionary
    if (isKeyComplete == false && res[i].includes("\n")) {
      isKeyComplete = true;
      var temp = res[i].split("\n");
      if (!isNaN(temp[1])) {
        currentStudentInfo[keys[keyCounter]] = temp[1];
        keyCounter = keyCounter + 1;
      }
    }

    //Grabs the keys until all gotten
    else if (isKeyComplete == false) {
      keys.push(res[i]);
    } else {
      //CASE: Contains a new line
      if (res[i].includes("\n")) {
        var potentialID = isStudentId(res[i]);
        //CASE: Is a student id
        if (potentialID != "") {
          //RESET the currentStudentInfo
          arrStudentDict.push(currentStudentInfo);
          var temp = {};
          currentStudentInfo = temp;
          keyCounter = 0;

          currentStudentInfo[keys[keyCounter]] = potentialID;
          keyCounter = keyCounter + 1;
        }
      }

      //CASE: Not all keys have value
      else if (keyCounter <= keys.length) {
        currentStudentInfo[keys[keyCounter]] = res[i];
        keyCounter = keyCounter + 1;
        console.log(currentStudentInfo);
      }

      //CASE: Mutiple Comments
      else {
        var key = keys[keyCounter];
        currentStudentInfo[key] = currentStudentInfo[key].concat(res[i]);
      }
    }
  }

  console.log(res);

  console.log(keys);
}

//Checks if the item is a student Id
function isStudentId(item) {
  var potentialID = item.split("\n");
  if (isNaN(potentialID[1])) {
    return "";
  } else {
    return potentialID[1];
  }
}

function createDictionary(keysArray, value) {
  var ret = {};
  for (var i = 0; i < keysArray.length; i++) {
    ret.add(keysArray[i], value);
  }
}
