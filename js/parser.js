var fileResults = {};

$(document).ready(function() {
  function submitFile() {
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
        //CASE: is status.txt
        if (filename.includes("txt")) {
          temp = temp.split(/[:\n]/);
          console.log(temp);
          //fileResults.push(parseStatus(temp));
          fileResults["status"] = parseStatus(temp);
          //fileResults = crossReference(fileResults[0], fileResults[1]);
        }
        //CASE: Is grades csv
        else if (filename.includes("grades")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          //fileResults.push(parseGradeCSV(temp));
          fileResults["grades"] = parseGradeCSV(temp);
          //fileResults = crossReference(fileResults[0], fileResults[1]);
        }
        //CASE: Is student info csv
        else if (filename.includes("info")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          //fileResults.push(parseCSV(temp));
          fileResults["student"] = parseCSV(temp);
          // fileResults = crossReference(fileResults[0], fileResults[1]);
        } else if (filename.includes("Faculty")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          fileResults["faculty"] = parseFaculty(temp);
        }
        //CASE: Is student netID xml
        else if (filename.includes("xml")) {
          console.log(temp);
          fileResults["netid"] = parseXML(temp);
          //fileResults.push(parseXML(temp));
        } else if (filename.includes("Grad")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          fileResults["grad"] = parseFaculty(temp);
        } else if (filename.includes("TA-Allocation")) {
          temp = $.csv.toArrays(temp);
          console.log(temp);
          fileResults["ta-allocation"] = parseTaAllocation(temp);
        }
        if (!--count) {
          console.log(fileResults);
          appendCard(
            "Student Grade Import",
            "genStudentGradeImport()",
            "grades"
          );
          appendCard(
            "Student Status Import",
            "genStudentStatusImport()",
            "status"
          );
          appendCard(
            "Student Adder Import",
            "genStudentAdderImport()",
            "student"
          );
          appendCard("Student User Import", "genStudentUserImport()", "status");
          appendCard(
            "Student Comm. Import",
            "genStudentCommentsImport()",
            "comments"
          );
          appendCard("Student TA Eval. (WIP)", "genEvalImport()", "eval");
          appendCard("Advisor Input", "genAdvisorInput()", "advisor");
          //genStudentGradeImport(fileResults[0]);
          //genStudentComment(fileResults[1]);
        }
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

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm, "");
}

function parseTaAllocation(splitArray) {
  var taAllocationArr = {};

  for (var i = 1; i < splitArray.length; i++) {
    var student = {};
    for (var x = 0; x < splitArray[x].length; x++) {
      student[splitArray[0][x]] = splitArray[i][x];
    }
    if (taAllocationArr[student["Last Name"] + student["ID"]] != null) {
      var course = {
        "Assigned Course": student["Assigned Course"],
        Fraction: student["Fraction"],
        "Assigned Course Name": student["Assigned Course Name"],
        "Instructor Full Name": student["Instructor Full Name"]
      };
      taAllocationArr[student["Last Name"] + student["ID"]]["Courses"][
        student["Assigned Course"]
      ] = course;
    } else {
      var assignedCourse = student["Assigned Course"];
      var finalDict = {
        ID: student["ID"],
        "Last Name": student["Last Name"],
        "First Name": student["First Name"],
        Courses: {
          [assignedCourse]: {
            "Assigned Course": student["Assigned Course"],
            Fraction: student["Fraction"],
            "Assigned Course Name": student["Assigned Course Name"],
            "Instructor Full Name": student["Instructor Full Name"]
          }
        }
      };
      taAllocationArr[student["ID"]] = finalDict;
    }
  }
  return taAllocationArr;
}

/**
 * Parses the graduate XML file passed in gotten from CS SBU Drupal
 * @param {*} xmlTxt - xml file passed in
 * @returns - dictionary about the graduate
 */
function parseXML(xmlTxt) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlTxt, "text/xml");
  var lastnameArr = xmlDoc.getElementsByTagName("lastname");
  var firstnameArr = xmlDoc.getElementsByTagName("firstname");
  var urlArr = xmlDoc.getElementsByTagName("url");
  console.log(urlArr);
  var students = [];
  for (var i = 0; i < lastnameArr.length; i++) {
    var temp = {
      lastname: myTrim(lastnameArr[i].childNodes[0].nodeValue),
      firstname: myTrim(firstnameArr[i].childNodes[0].nodeValue)
    };
    if (urlArr[i].childNodes.length != 0) {
      temp["netid"] = myTrim(urlArr[i].childNodes[0].nodeValue.split("~")[1]);
    } else {
      temp["netid"] = "";
    }
    students.push(temp);
  }
  return students;
}

function updateDictionary(dictionary, key, value) {
  var tempValue = dictionary[key];
  var newValue = tempValue.concat(value);
  dictionary[key] = newValue;
}

/**
 * Parses an array of faculty into a dictionary with faculty information
 * @param {*} splitArray - array of faculty members
 * @returns - dictionary of faculty informaiton
 */
function parseFaculty(splitArray) {
  var facultyDict = {};

  for (var i = 1; i < splitArray.length; i++) {
    var currentFaculty = splitArray[i];
    var currentFacultyInfo = {};
    for (var x = 0; x < currentFaculty.length; x++) {
      currentFacultyInfo[splitArray[0][x]] = currentFaculty[x];
    }
    facultyDict[currentFacultyInfo["Name"]] = currentFacultyInfo;
  }
  return facultyDict;
}

/**
 * Parses arraay of Student Info that was previously gotten form the a csv.
 * @param {*} splitArray - Array of students information perviously parsed by csvtoarry library
 * @returns - dictionary of student information
 */
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
  currentStudentInfo[splitArray[0][9]] = currentTA;
  currentStudentInfo[splitArray[0][10]] = currentAdvisor;
  currentStudentInfo[splitArray[0][11]] = currentComments;
  studentDictArr.push(currentStudentInfo);
  return studentDictArr;
}

/**
 *
 * @param {*} splitArray
 * @param {*} indexStart
 * @param {*} indexEnd
 */
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

/**
 * Goes through the array and formats the information into a dictionary
 * @param {*} splitArray - csv that is converted to an array
 * @returns - dictionary of the student information
 */
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
          if (currentStudentInfo["Courses"] != undefined) {
            currentStudentInfo["Courses"].push(currentCourseInfo);
          }
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

  //Updates the dictionary with the last student info
  if (currentStudentInfo["Courses"] != undefined) {
    currentStudentInfo["Courses"].push(currentCourseInfo);
  }
  studentDictArr.push(currentStudentInfo);
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
      //currentStudentInfo["Status"] = splitArray[i].replace(/\r?\n|\r/g, "");
      currentStudentInfo["Status"] = myTrim(splitArray[i]);
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

function genStudentsImport(studentInfoArr) {}
