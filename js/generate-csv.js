//Download Button Handler
function downloadHandler(csvArr, filename) {
  var a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvArr);
  a.target = "_blank";
  a.download = filename;

  document.body.appendChild(a);
  a.click();
}

function setupDownload() {
  var cardArr = $(".card-content");
  for (var i = 0; i < cardArr.length; i++) {
    cardArr.eq(i).addClass;
  }
}

//Generates Student Grades CSV
function genStudentGradeImport() {
  studentInfoArr = fileResults[0];
  //Adds a space in the unique ID
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

//Generates Student Status CSV
function genStudentComment(studentInfoArr) {
  studentInfoArr = fileResults[1];
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

//
