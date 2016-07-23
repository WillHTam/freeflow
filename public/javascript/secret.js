/* globals $ currentUser */
function userAuthSuccess () {
  console.log('here')
  $('body').show()
  $('#title').text('Secret content for ' + currentUser.name)
}

function userAuthFailed () {
  // if login fails then we want to redirect as this page is secret
  window.location.href = 'login.html'
}
