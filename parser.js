$(document).ready(function() {
  function submitFile() {
    var fileResults = [];
    document.getElementById("input").files;
    var count = document.getElementById("input").files.length;
    for (var i = 0; i < document.getElementById("input").files.length; i++) {
      readFile(
        document.getElementById("input").files[i],
        document.getElementById("input").files[i]["name"]
      );
    }
    function readFile(event, filename) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var temp = event.target.result;
        console.log(event.target.result);
        if (filename.includes("txt")) {
          temp = temp.split(/[:\n]/);
          console.log(temp);
          fileResults.push(parseStatus(temp));
          //fileResults = crossReference(fileResults[0], fileResults[1]);
        } else if (filename.includes("grades")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          fileResults.push(parseGradeCSV(temp));
          //fileResults = crossReference(fileResults[0], fileResults[1]);
        } else if (filename.includes("info")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          fileResults.push(parseCSV(temp));
          // fileResults = crossReference(fileResults[0], fileResults[1]);
        }
        if (!--count) {
          console.log(fileResults);
          genStudentGradeImport(fileResults[0]);
          genStudentComment(fileResults[1]);
        }
        //console.log(fileResults);
      };
      reader.readAsText(event);
    }
  }

  document.getElementById("file-submit").addEventListener("click", submitFile);
});

function crossReference(result1, result2) {
  var retArr = [];
  if (result2 == null) {
    retArr.push(result1);
  } else {
    for (var index1 in result1) {
      var sbid = result1[index1]["SBID"];
      for (var index2 in result2) {
        //CASE:SBID match
        if (result2[index2]["SBID"] == sbid) {
          var remIndex = result2.indexOf(result2[index2]);
          var newDict = Object.assign({}, result1[index1], result2[index2]);
          console.log(newDict);
          retArr.push(newDict);
          result2.splice(remIndex, 1);
          sbid = "";
          break;
        }
      }
      //CASE:Dictionary has been added
      if (sbid != "") {
        retArr.push(result1[index1]);
      }
    }
    //CASE: Leftover dictionaries
    if (result2.length != 0) {
      for (var index in result2) {
        retArr.push(result2[index]);
      }
    }
    console.log(retArr);
  }
  return retArr;
}

function updateDictionary(dictionary, key, value) {
  var tempValue = dictionary[key];
  var newValue = tempValue.concat(value);
  dictionary[key] = newValue;
}

function parseCSV(splitArray) {
  var currentStudentInfo = setupDictionary(splitArray);
  var studentDictArr = [];
  var currentTA = [];
  var currentAdvisor = [];
  var currentComments = [];
  var row;
  var col;
  for (row = 1; row < splitArray.length; row++) {
    for (col = 0; col < splitArray[row].length; col++) {
      //CASE: Not empty line
      if (splitArray[row][col] != "") {
        //CASE: Is SBID
        if (col == 0) {
          //RESET: Current Student Info
          console.log(currentStudentInfo);
          var temp = setupDictionary(splitArray, 0, 9);
          currentStudentInfo[splitArray[0][9]] = currentTA;
          currentStudentInfo[splitArray[0][10]] = currentAdvisor;
          currentStudentInfo[splitArray[0][11]] = currentComments;
          studentDictArr.push(currentStudentInfo);
          console.log(studentDictArr);
          currentStudentInfo = temp;
          currentTA = [];
          currentAdvisor = [];
          currentComments = [];
          currentStudentInfo[splitArray[0][col]] = splitArray[row][col];
        }
        //CASE: TA Evals
        else if (col == 9) {
          currentTA.push(splitArray[row][col]);

          console.log(currentTA);
        }
        //CASE: Advisor
        else if (col == 10) {
          currentAdvisor.push(splitArray[row][col]);
          console.log(currentAdvisor);
        }
        //CASE: Comments
        else if (col == 11) {
          currentComments.push(splitArray[row][col]);
          console.log(currentAdvisor);
        }
        //CASE: All other key/values
        else {
          var tempValue = currentStudentInfo[splitArray[0][col]];
          console.log(col);
          var newValue = tempValue.concat(splitArray[row][col]);
          currentStudentInfo[splitArray[0][col]] = newValue;
        }
      }
    }
  }
  return studentDictArr;
}

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
        //CASE: Course info
        else if (col >= 5) {
          //CASE: New course info
          if (col == 5) {
            console.log(currentCourseInfo);
            var temp = setupDictionary(splitArray, 5);
            currentStudentInfo["Courses"].push(currentCourseInfo);
            currentCourseInfo = temp;
          }
          updateDictionary(
            currentCourseInfo,
            splitArray[0][col],
            splitArray[row][col]
          );
        }
        //CASE: ALL OTHER KEY/VALUES
        else {
          updateDictionary(
            currentStudentInfo,
            splitArray[0][col],
            splitArray[row][col]
          );
        }
      }
    }
  }
  return studentDictArr;
}

function parseStatus(splitArray) {
  var currentStudentInfo = {};
  var studentDictArr = [];

  for (var i = 0; i < splitArray.length; i++) {
    if (i % 3 == 0 || i == 0) {
      studentDictArr.push(currentStudentInfo);
      var temp = {};
      currentStudentInfo = temp;
      currentStudentInfo["SBID"] = splitArray[i];
    } else if (i % 3 == 1) {
      currentStudentInfo["NAME"] = splitArray[i];
    } else if (i % 3 == 2) {
      currentStudentInfo["Status"] = splitArray[i].replace(/\r?\n|\r/g, "");
    }
  }
  return studentDictArr;
}

function fixSemester(semester) {
  var temp = semester.split("");
  var season = "";
  var year = "";
  for (var i = 0; i < temp.length; i++) {
    if (temp[i] != " " && isNaN(temp[i])) {
      season = season + temp[i];
    } else if (temp[i] != " " && isNaN(temp[i]) == false) {
      year = year + temp[i];
    }
  }
  return season + " " + year;
}

function filterUndergrad(courseNumber) {
  if (courseNumber < 500) {
    return false;
  }
  return true;
}

function downloadHandler(csvArr, filename) {
  var a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvArr);
  a.target = "_blank";
  a.download = filename;

  document.body.appendChild(a);
  a.click();
}

//Student Status CSV
function genStudentGradeImport(studentInfoArr) {
  var csvArr = [
    [
      "",
      "Student ID",
      "Semester",
      "Credits",
      "Grade",
      "Standing",
      "Course Number",
      "Course Name",
      "uniqueFields\n"
    ]
  ];

  for (var i = 1; i < studentInfoArr.length; i++) {
    var studentID = studentInfoArr[i]["SBID"];
    var standing = studentInfoArr[i]["Level"];
    for (var x = 1; x < studentInfoArr[i]["Courses"].length; x++) {
      var semester = studentInfoArr[i]["Courses"][x]["Semester"];
      semester = fixSemester(semester);
      var credits = studentInfoArr[i]["Courses"][x]["Credits"];
      var grade = studentInfoArr[i]["Courses"][x]["Grade"];
      if (grade == " ") {
        grade = "";
      }

      //Fitler undergraduate course out
      if (parseInt(studentInfoArr[i]["Courses"][x]["Number"], 10) > 500) {
        var courseNumber = parseInt(
          studentInfoArr[i]["Courses"][x]["Number"],
          10
        ).toString();
        var course = studentInfoArr[i]["Courses"][x]["Course"] + courseNumber;
      } else {
        continue;
      }

      var courseName = studentInfoArr[i]["Courses"][x]["Title"];
      var uniqueField = studentID + semester + course;
      var row = [
        studentID,
        semester,
        credits,
        grade,
        standing,
        course,
        courseName,
        uniqueField + "\n"
      ];
      csvArr.push(row);
    }
  }

  downloadHandler(csvArr, "grades.csv");
}

function genStudentComment(studentInfoArr) {
  var csvArr = ["", "ID", "Status", "Semester", "Validator\n"];
  for (var i = 1; i < studentInfoArr.length; i++) {
    var studentID = studentInfoArr[i]["SBID"];
    var status = studentInfoArr[i]["Status"];
    var semester = "Spring 2019";
    var validator = studentID + "-" + semester;
    var row = [studentID, status, semester, validator + "\n"];
    csvArr.push(row);
  }

  downloadHandler(csvArr, "status.csv");
}

function genStudentsImport(studentInfoArr) {}

function genCourseImport(studentInfoArr) {
  var coursesArr = ["", "Course Number", "Course Name", "Track"];
  for (var i = 0; i < studentInfoArr.length; i++) {
    var courses = studentInfoArr[i][Courses];
    for (var x = 0; x < courses.length; x++) {
      var courseName = courses[x]["Course"] + courses[x]["Number"];
      var courseTitle = courses[x]["Title"];
    }
  }
}

function createTable(studentDictArr) {
  function genTableHeader() {}
  for (var i = 0; i < studentDictArr.length; i++) {}
}
