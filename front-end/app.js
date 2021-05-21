// Sign up
$("#signup").on("submit", function (e) {
  e.preventDefault();

  const username = $("#username").val().toLowerCase();
  const password = $("#password").val();
  const role = $('input[name="role"]:checked').val();

  const userObj = {
    username: username,
    password: password,
    role: role
  }

  $.ajax({
    url: "/signup",
    type: "POST",
    data: userObj,
  }).done(function (response) {
    if (response.status === "success") {
      window.location.href = "/signin"
    } else if (response.error.includes('duplicate')) {
      alert('This username is already exists')
    } else {
      alert('Something went wrong')
    }
  })
})


// Sign in
$("#signin").on("submit", function (e) {
  e.preventDefault();

  const username = $("#username").val();
  const password = $("#password").val();

  const encoded = btoa(`${username}:${password}`);

  $.ajax({
    type: "POST",
    url: "/signin",
    xhrFields: { withCredentials: true },
    headers: {
      authorization: `Basic ${encoded}`
    },
  }).done(function () {
    window.location.href = "/dashboard"
  })
    .fail(function () {
      alert('Error!')
    });

});

