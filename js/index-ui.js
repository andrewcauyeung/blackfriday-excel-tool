function appendCard(description, downloadLink) {
  var downloadStr = "";
  var descriptionStr = "";

  var cardHtml =
    '<div class="col s4">' +
    '<div class="card horizontal">' +
    '<div class="card-stacked">' +
    '<div class="card-content">';

  var cardHtml2 = "</div>" + '<div class="card-action">';

  var cardHtml3 =
    '<a href="#">View Table</a>' + "</div>" + "</div>" + "</div>" + "</div>";

  descriptionStr = descriptionStr.concat(
    '<span class="card-title activator grey-text text-darken-4">' +
      description +
      "</span>"
  );

  downloadStr = downloadStr.concat(
    "<p><a onclick=" + downloadLink + " >Download CSV</a></p>"
  );

  cardHtml = cardHtml + descriptionStr + cardHtml2 + downloadStr + cardHtml3;
  console.log(cardHtml);

  $(".card-container").append(cardHtml);
}
