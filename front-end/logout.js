'use strict';

$(function () {
  $(".dialog").dialog({
    autoOpen: false,
    dialogClass: "no-close",
    modal: true,
    position: {
      my: "top",
      at: "top"
    },
    buttons: {
      "Logout": function () {
        window.location.href = '/logout';
      },
      Cancel: function () {
        $(this).dialog("close");
      }
    }
  });
  $(".opener").click(function () {
    $(".dialog").dialog("open");
  });
});
