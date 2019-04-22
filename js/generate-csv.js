//Download Button Handler
function downloadHandler(csvArr, filename, tableSwitch) {
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

      //Trim undergraduate course
      var courseNumber = studentInfoArr[i]["Courses"][x]["Number"].trim();
      if (parseInt(studentInfoArr[i]["Courses"][x]["Number"], 10) > 99) {
        courseNumber = parseInt(
          studentInfoArr[i]["Courses"][x]["Number"],
          10
        ).toString();
      }
      var course = studentInfoArr[i]["Courses"][x]["Course"] + courseNumber;
      var courseName = '"' + studentInfoArr[i]["Courses"][x]["Title"] + '"';
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

function getSemester(date) {
  var month = parseInt(date.split("/")[0]);
  var year = parseInt(date.split("/")[1]);

  //Fall
  if (month == 1 || month == 12) {
    if (month == 1) {
      return "Fall " + (year - 1);
    } else {
      return "Fall " + year;
    }
  }
  //Spring
  else if (month == 6 || month == 5) {
    return "Spring " + year;
  }
  //Summer
  else if (month == 8) {
    return "Summer " + year;
  }
  //None
  else {
    return "NOT AVAILABLE";
  }
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
    "",
    "Advisor Username",
    "Date",
    "Semester",
    "TA Eval Unique Validator\n"
  ];

  for (var i = 1; i < studentInfoArr.length; i++) {
    //CSV information
    var sbid = studentInfoArr[i]["SBID"];
    var fullName =
      studentInfoArr[i]["FIRST NAME"] + " " + studentInfoArr[i]["LAST NAME"];
    var fraction = 1;

    for (var x = 0; x < studentInfoArr[i]["TA EVALS"].length; x++) {
      //TA Evaluation
      var evalArr = studentInfoArr[i]["TA EVALS"][x];
      evalArr = evalArr.replace(/\r?\n|\r/g, "");
      if (evalArr[0] != '"' && evalArr[evalArr.length - 1] != '"') {
        evalArr = evalArr.replace(/"/g, '""');
        evalArr = '"' + evalArr + '"';
      }

      //Grab the date and semester
      var date = evalArr.substring(1, 8).trim();
      var semester = getSemester(date);

      //Grabs the professor/advisor for the class
      var tempAdv = evalArr.substring(evalArr.indexOf("-") + 2, evalArr.length);
      var advisor = tempAdv
        .substring(0, tempAdv.indexOf(" ", tempAdv.indexOf(" ") + 1))
        .trim();
      advisor = advisor.replace(",", "");

      //Advisor/Professor username
      var advisorUsername = "";
      if (facultyDict[advisor] != undefined) {
        var advisorUsername = facultyDict[advisor]["samaccountname"];
      }

      //Grab the Course from Eval
      var courses = evalArr.match(/((CSE|ISE|cse|ise)\s?[0-9\.]+)/);
      var course = "";
      if (courses != null && courses != undefined) {
        course = courses[0].replace(" ", "").toUpperCase();
        course = course.substring(0, 6);
        try {
          for (key in taAllocationDict[sbid]["Courses"]) {
            if (key.includes(course)) {
              course = key;
              fraction = taAllocationDict[sbid]["Courses"][key]["Fraction"];
            }
          }
        } catch {
          console.log("No student found");
        }
      }
      var validator = advisorUsername + "-" + semester + "-" + sbid;

      var row = [
        sbid,
        fullName,
        fraction,
        course,
        evalArr,
        advisor,
        advisorUsername,
        date,
        semester,
        validator + "\n"
      ];
      csvArr.push(row);
    }
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
  studentInfoArr = fileResults["grades"];
  var csvArr = ["", "Course Number", "Course Name", "Track\n"];
  var tempArr = {};
  for (var i = 1; i < studentInfoArr.length; i++) {
    var courses = studentInfoArr[i]["Courses"];
    for (var x = 1; x < courses.length; x++) {
      //if (parseInt(courses[x]["Number"], 10) > 0) {
      var course = courses[x]["Course"];
      if (isNaN(course[course.length - 1])) {
        course = course.substring(0, course.length);
      }
      var number = courses[x]["Number"].trim();
      if (parseInt(courses[x]["Number"], 10) > 99) {
        number = number.replace(/\D/g, "").trim();
      }
      var courseNumber = course + number;
      var courseTitle = '"' + courses[x]["Title"] + '"';
      var track = "";
      if (!(courseNumber in tempArr)) {
        tempArr[courseNumber] = {
          "Course Number": courseNumber,
          "Course Title": courseTitle,
          Track: track
        };
        var row = [courseNumber, courseTitle, track + "\n"];
        csvArr.push(row);
      }
      //}
    }
  }
  downloadHandler(csvArr, "courses.csv");
}

//Generate Advisor Input CSV
function genAdvisorInput() {
  //Creates the rows in the CSV file
  function genRow(advisor, advisorInput, csvArr) {
    var date = "";

    //Remove the Acad=
    console.log(advisor);
    console.log(advisorInput);
    if (advisor.includes("=")) {
      advisor = advisor.split("=")[1].trim();
    }

    //CASE: Advisor Input is not empty
    if (advisorInput != "" && advisorInput != undefined) {
      advisorInput = advisorInput.replace(/"/g, '""');
      advisorInput = '"' + advisorInput + '"';
      date = advisorInput.substring(1, 8).trim();
      //Grab the advisor from the input
      var advisorArr = advisorInput.split("-");
      if (!advisorArr[1].includes("Result")) {
        advisor = advisorArr[1].replace(" ", "").trim();
      }
    }
    //CASE: Advisor Input is empty
    else {
      date = "01/2019";
      advisorInput = "";
    }

    //Advisor/Professor username
    var advisorUsername = "";
    if (facultyDict[advisor] != undefined) {
      advisorUsername = facultyDict[advisor]["samaccountname"];
    }

    //Get Semester
    var semester = getSemester(date);

    //Create Validator
    var validator = advisorUsername + "-" + semester + "-" + sbid;

    var row = [
      sbid,
      advisorInput,
      advisor,
      advisorUsername,
      date,
      semester,
      validator + "\n"
    ];
    csvArr.push(row);

    return semester;
    ``;
  }
  studentInfoArr = fileResults["student"];
  var facultyDict = fileResults["faculty"];

  var csvArr = [
    "",
    "Student ID",
    "Advisor Input",
    "Advisor",
    "Advisor Username",
    "Date",
    "Semester",
    "Adv Eval Unique Validator\n"
  ];

  for (var i = 1; i < studentInfoArr.length; i++) {
    var sbid = studentInfoArr[i]["SBID"];
    var advisor = studentInfoArr[i]["ADVISOR"];
    var hasCurrentSemInput = false;

    if (studentInfoArr[i]["Advisor Input"].length == 0) {
      var semester = genRow(
        advisor,
        studentInfoArr[i]["Advisor Input"][0],
        csvArr
      );
      if (semester == "Fall 2018") {
        hasCurrentSemInput = true;
      }
    } else {
      for (var x = 0; x < studentInfoArr[i]["Advisor Input"].length; x++) {
        //Gets the advisor input
        var advisorInput = studentInfoArr[i]["Advisor Input"][x];
        advisorInput = advisorInput.replace(/\r?\n|\r/g, "");
        var semester = genRow(advisor, advisorInput, csvArr);
        if (semester == "Fall 2018") {
          hasCurrentSemInput = true;
        }
      }
    }
    if (hasCurrentSemInput == false) {
      genRow(advisor, "", csvArr);
    }
  }
  downloadHandler(csvArr, "NewAdvInput.csv");
}
