$(document).ready(function() {
  var fileResults = [];
  function submitFile() {
    document.getElementById("input").files;
    for (var i = 0; i < document.getElementById("input").files.length; i++) {
      onChange(
        document.getElementById("input").files[i],
        document.getElementById("input").files[i]["name"]
      );
    }
    crossReference(fileResults[0], fileResults[1]);
  }

  function onChange(event, filename) {
    var reader = new FileReader();
    reader.onload = function(event) {
      console.log(event.target.result);
      var temp = $.csv.toArrays(event.target.result);
      console.log(temp);
      if (filename.includes("grades")) {
        fileResults.push(parseGradeCSV(temp));
      } else if (filename.includes("info")) {
        fileResults.push(parseCSV(temp));
      }
      console.log(fileResults);
    };
    reader.readAsText(event);
  }

  document.getElementById("file-submit").addEventListener("click", submitFile);
});

function crossReference(result1, result2) {
  console.log(
    result1.map((a, i) => Object.assign({}, a, { myNewAttribute: result2[i] }))
  );
  // for (var i = 0; i < result1.length; i++) {
  //   for (var x = 0; x < result2.length; x++) {
  //     if (result1[i]["SBID"]  == result2[x]["SBID"]) {

  //     }
  //   }
  // }
}

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
          var temp = setupDictionary(splitArray, 0);
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

// function setupDictionary(splitArray) {
//   var currentStudentInfo = {};
//   for (var col = 0; col < splitArray[0].length; col++) {
//     if (currentStudentInfo[splitArray[0][col]] != "") {
//       currentStudentInfo[splitArray[0][col]] = "";
//     }
//   }
//   return currentStudentInfo;
// }

function setupDictionary(splitArray, indexStart, indexEnd) {
  var currentStudentInfo = {};
  if (indexEnd == null) {
    indexEnd = splitArray[0].length;
  }
  for (var col = indexStart; col < indexEnd; col++) {
    if (currentStudentInfo[splitArray[0][col]] != "") {
      currentStudentInfo[splitArray[0][col]] = "";
    }
  }
  return currentStudentInfo;
}

function parseGradeCSV(splitArray) {
  var currentStudentInfo = {};
  var currentCourseInfo = {};
  var studentDictArr = [];

  for (var row = 1; row < splitArray.length; row++) {
    for (var col = 0; col < splitArray[row].length; col++) {
      if (splitArray[row][col] != "") {
        //CASE: FIRST COLUMN OF ROW
        if (col == 0) {
          console.log(currentStudentInfo);
          var temp = setupDictionary(splitArray, 0, 5);
          temp["Courses"] = [];
          studentDictArr.push(currentStudentInfo);
          console.log(studentDictArr);
          currentStudentInfo = temp;
          currentStudentInfo[splitArray[0][col]] = splitArray[row][col];
        }
        //CASE: New Course info
        else if (col == 5) {
          console.log(currentCourseInfo);
          var temp = setupDictionary(splitArray, 5);
          currentStudentInfo["Courses"].push(currentCourseInfo);
          currentCourseInfo = temp;
          var tempValue = currentCourseInfo[splitArray[0][col]];
          var newValue = tempValue.concat(splitArray[row][col]);
          currentCourseInfo[splitArray[0][col]] = newValue;
        }
        //CASE: Course info Key/value
        else if (col > 5) {
          var tempValue = currentCourseInfo[splitArray[0][col]];
          var newValue = tempValue.concat(splitArray[row][col]);
          currentCourseInfo[splitArray[0][col]] = newValue;
        }
        //CASE: ALL OTHER KEY/VALUES
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
