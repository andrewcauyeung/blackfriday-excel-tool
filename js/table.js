function generateTable(importType) {
  $(".table-info").empty();
  if (importType == "status") {
    var csvArr = ["ID", "Status", "Semester", "Validator"];
    var tableStr =
      '<table class="responsive-table striped ' +
      importType +
      '">' +
      generateTableHead(csvArr);
    studentInfoArr = fileResults["status"];

    for (var i = 1; i < studentInfoArr.length; i++) {
      tableStr = tableStr + "<tr>";
      tableStr = tableStr + "<td>" + studentInfoArr[i]["SBID"] + "</td>";

      tableStr = tableStr + "<td>" + studentInfoArr[i]["Status"] + "</td>";
      tableStr = tableStr + "<td>" + "Spring 2019" + "</td>";
      tableStr =
        tableStr +
        "<td>" +
        studentInfoArr[i]["SBID"] +
        "-" +
        "Spring 2019" +
        "</td>";
      tableStr = tableStr + "</tr>";
    }
    tableStr = tableStr + "</tbody></table>";
    $(".table-info").append(tableStr);
  } else if (importType == "grades") {
    csvArr = [
      "Student ID",
      "Semester",
      "Credits",
      "Grade",
      "Standing",
      "Course Number",
      "Course Name",
      "uniqueFields"
    ];
    var tableStr =
      '<table class="responsive-table striped ' +
      importType +
      '">' +
      generateTableHead(csvArr);
    studentInfoArr = fileResults["grades"];

    for (var i = 1; i < studentInfoArr.length; i++) {
      for (var x = 1; x < studentInfoArr[i]["Courses"].length; x++) {
        //Fitler undergraduate course out
        if (parseInt(studentInfoArr[i]["Courses"][x]["Number"], 10) > 500) {
          var courseNumber = parseInt(
            studentInfoArr[i]["Courses"][x]["Number"],
            10
          ).toString();
          tableStr = tableStr + "<tr>";
          tableStr = tableStr + "<td>" + studentInfoArr[i]["SBID"] + "</td>";
          tableStr =
            tableStr +
            "<td>" +
            studentInfoArr[i]["Courses"][x]["Semester"] +
            "</td>";
          tableStr =
            "<td>" + studentInfoArr[i]["Courses"][x]["Credits"] + "</td>";
          tableStr =
            tableStr +
            "<td>" +
            studentInfoArr[i]["Courses"][x]["Grade"] +
            "</td>";
          tableStr = tableStr + "<td>" + studentInfoArr[i]["Level"] + "</td>";
          tableStr =
            tableStr +
            "<td>" +
            studentInfoArr[i]["Courses"][x]["Course"] +
            courseNumber +
            "</td>";
          tableStr =
            tableStr +
            "<td>" +
            studentInfoArr[i]["Courses"][x]["Title"] +
            "</td>";
          tableStr =
            tableStr +
            "<td>" +
            studentInfoArr[i]["SBID"] +
            studentInfoArr[i]["Courses"][x]["Semester"] +
            studentInfoArr[i]["Courses"][x]["Course"] +
            courseNumber;
        } else {
          continue;
        }
      }
    }
    $(".table-info").append(tableStr);
  } else if (importType == "student-adder") {
  }
}

function generateTableHead(headArr) {
  var retArr = "<thead><tr>";
  for (var i = 0; i < headArr.length; i++) {
    var temp = "<th>" + headArr[i] + "</th>";
    retArr = retArr + temp;
  }
  return (retArr = retArr + "</tr></thead> <tbody>");
}
