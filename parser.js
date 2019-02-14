$(document).ready(function() {
  var fileResults = [];
  function submitFile() {
    var file = document.getElementById("input").files;
    onChange(file);
    for (var i = 0; i < file; i++) {}
  }

  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event);
  }

  function onReaderLoad(event) {
    console.log(event.target.result);
    var temp = $.csv.toArrays(event.target.result);
    console.log(temp);
    fileResults.push(parseCSV(temp));
  }

  $(".add-title-btn").click(function() {
    $(".key-container").append(
      '<div class="input-field col s6">' +
        '<input placeholder="Title 1" id="title-1" type="text" />' +
        "</div>"
    );
  });

  // document.getElementById("input").addEventListener("change", onChange);
  // document.getElementById("input2").addEventListener("change", onChange);
  // document.getElementById("input3").addEventListener("change", onChange);
  document.getElementById("file-submit").addEventListener("click", submitFile);
});

function parseCSV(splitArray) {
  var currentStudentInfo = setupDictionary(splitArray);
  var studentDictArr = [];
  var row;
  var col;
  for (row = 1; row < splitArray.length; row++) {
    for (col = 0; col < splitArray[row].length; col++) {
      //CASE: Not empty line
      if (splitArray[row][col] != "") {
        //CASE: Is SBID
        if (!isNaN(splitArray[row][col])) {
          //RESET: Current Student Info
          console.log(currentStudentInfo);
          var temp = setupDictionary(splitArray);
          studentDictArr.push(currentStudentInfo);
          console.log(studentDictArr);
          currentStudentInfo = temp;
          currentStudentInfo[splitArray[0][col]] = splitArray[row][col];
        }
        //CASE: All other key/values
        else {
          var tempValue = currentStudentInfo[splitArray[0][col]];
          var newValue = tempValue.concat(splitArray[row][col]);
          currentStudentInfo[splitArray[0][col]] = newValue;
        }
      }
    }
  }
  return studentDictArr;
}

function setupDictionary(splitArray) {
  var currentStudentInfo = {};
  for (var col = 0; col < splitArray[0].length; col++) {
    if (currentStudentInfo[splitArray[0][col]] != "") {
      currentStudentInfo[splitArray[0][col]] = "";
    }
  }
  return currentStudentInfo;
}
