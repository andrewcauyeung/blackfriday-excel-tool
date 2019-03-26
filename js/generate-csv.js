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
  studentInfoArr = fileResults["grades"];
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
function genStudentStatusImport() {
  studentInfoArr = fileResults["status"];
  var csvArr = ["", "ID", "Status", "Semester", "Validator\n"];
  for (var i = 1; i < studentInfoArr.length; i++) {
    var studentID = studentInfoArr[i]["SBID"];
    var status = studentInfoArr[i]["Status"];
    if (status[0] != '"' && status[status.length - 1] != '"') {
      status = '"' + studentInfoArr[i]["Status"] + '"';
    }
    var semester = "Fall 2018";
    var validator = studentID + "-" + semester;
    var row = [studentID, status, semester, validator + "\n"];
    csvArr.push(row);
  }

  downloadHandler(csvArr, "status.csv");
}

//Geneartes Student Adder CSV
function genStudentAdderImport() {
  var studentInfoArr = fileResults["student"];
  var csvArr = [
    "",
    "Student ID",
    "Last Name",
    "First Name",
    "Gender",
    "Country of Origin",
    "Date Entered",
    "Email",
    "NetID",
    "RPE Passed\n"
  ];

  for (var i = 1; i < studentInfoArr.length; i++) {
    var sbid = studentInfoArr[i]["SBID"];
    var lastname = studentInfoArr[i]["LAST NAME"];
    var firstname = studentInfoArr[i]["FIRST NAME"];
    var gender = studentInfoArr[i]["GENDER"];
    var rpe = studentInfoArr[i]["RPE PASSED"];
    var origin = studentInfoArr[i]["COUNTRY OF ORGIN"];
    var entered = studentInfoArr[i]["DATE ENTERED PROGRAM"];
    var email = studentInfoArr[i]["EMAIL"];

    var netidArr = fileResults["grad"];

    var netid = "";
    for (var x = 0; x < netidArr.length; x++) {
      if (
        lastname == netidArr[x]["Surname"] &&
        firstname == netidArr[x]["GivenName"]
      ) {
        netid = netidArr[x]["SamAccountName"];
      }
    }

    var row = [
      sbid,
      lastname,
      firstname,
      gender,
      origin,
      entered,
      email,
      netid,
      rpe + "\n"
    ];
    csvArr.push(row);
  }
  downloadHandler(csvArr, "NewStudentAdder.csv");
}

//Generates Student User CSV
function genStudentUserImport() {
  var studentInfoArr = fileResults["student"];
  var netidArr = fileResults["grad"];
  var csvArr = ["", "NetID", "Email\n"];

  for (var i = 0; i < studentInfoArr.length; i++) {
    var hasNetID = false;
    for (var x = 0; x < netidArr.length; x++) {
      var email = studentInfoArr[i]["EMAIL"];
      if (
        studentInfoArr[i]["FIRST NAME"] == netidArr[x]["GivenName"] &&
        studentInfoArr[i]["LAST NAME"] == netidArr[x]["Surname"]
      ) {
        var netid = netidArr[x]["SamAccountName"];
        var row = [netid, email + "\n"];
        csvArr.push(row);
        hasNetID = true;
      }
    }
    if (hasNetID == false) {
      var email = studentInfoArr[i]["EMAIL"];
      var netid = "";
      var row = [netid, email + "\n"];
      csvArr.push(row);
    }
  }
  downloadHandler(csvArr, "NewStudentUser.csv");
}

//Generates TA Eval CSV
function genEvalImport() {
  var studentInfoArr = fileResults["student"];
  var taAllocationDict = fileResults["ta-allocation"];
  var facultyDict = fileResults["faculty"];
  var csvArr = [
    "",
    "Student ID",
    "Full Name",
    "TA Fraction",
    "Assigned Course",
    "TA Evaluation",
    "Advisor Username",
    "Date",
    "Semester",
    "TA Eval Unique Validator\n"
  ];

  for (var i = 1; i < studentInfoArr.length; i++) {
    //Needed to get additonal information
    var advisor = studentInfoArr[i]["ADVISOR"];

    //CSV information
    var sbid = studentInfoArr[i]["SBID"];
    var fullName =
      studentInfoArr[i]["FIRST NAME"] + " " + studentInfoArr[i]["LAST NAME"];
    var fraction = 1;
    var course = "";
    if (taAllocationDict[sbid] != undefined) {
      fraction = taAllocationDict[sbid]["Fraction"];
      course = taAllocationDict[sbid]["Assigned Course"];
    }

    var date = "12/1/2018";
    var semester = "Fall 2018";
    var validator = advisorUsername + "-" + semester + "-" + sbid;

    for (var x = 0; x < studentInfoArr[i]["TA EVALS"].length; x++) {
      //TA Evaluation
      var evalArr = studentInfoArr[i]["TA EVALS"][x];
      if (evalArr[0] != '"' && evalArr[evalArr.length - 1] != '"') {
        evalArr = '"' + studentInfoArr[i]["TA EVALS"][x] + '"';
      }
      evalArr = evalArr.replace(/\r?\n|\r/g, "");
    }

    var advisorUsername = "";
    if (facultyDict[advisor] != undefined) {
      var advisorUsername = facultyDict[advisor]["samaccountname"];
    }
    var row = [
      sbid,
      fullName,
      fraction,
      course,
      evalArr,
      advisorUsername,
      date,
      semester,
      validator + "\n"
    ];
    csvArr.push(row);
  }
  downloadHandler(csvArr, "NewTaEval.csv");
}

//Generate Student Comments CSV
function genStudentCommentsImport() {
  studentInfoArr = fileResults["student"];
  var commentsArr = ["", "Student ID", "Comment", "Date", "Validator\n"];
  for (var i = 1; i < studentInfoArr.length; i++) {
    var comments = studentInfoArr[i]["COMMENTS"];
    //student id
    var sbid = studentInfoArr[i]["SBID"];
    for (var x = 0; x < comments.length; x++) {
      var dateArr = comments[x].split("-")[0].split("/");
      var comment = '"' + comments[x].replace(/\r?\n|\r/g, "") + '"';
      //date
      var date = dateArr[0] + "/1/" + dateArr[1];
      var validator = '"' + sbid + "-" + comments[x] + '"';
      validator = validator.replace(/\r?\n|\r/g, "");
      var row = [sbid, comment, date, validator + "\n"];
      commentsArr.push(row);
    }
  }
  downloadHandler(commentsArr, "NewStudentComments.csv");
}

//Generate Course CSV
function genCourseImport() {
  studentInfoArr = fileResults[0];
  var coursesArr = ["", "Course Number", "Course Name", "Track"];
  for (var i = 0; i < studentInfoArr.length; i++) {
    var courses = studentInfoArr[i][Courses];
    for (var x = 0; x < courses.length; x++) {
      var courseName = courses[x]["Course"] + courses[x]["Number"];
      var courseTitle = courses[x]["Title"];
    }
  }
}
