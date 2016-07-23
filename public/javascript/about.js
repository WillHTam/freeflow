/* globals $ */
function userAuthSuccess () {
  console.log('success')
  $('#login').hide()
  $('#signup').hide()
  $('#logout').show()
}

function userAuthFailed () {
  // if login fails then we want to redirect as this page is secret
  console.log('failed')
  $('#login').show()
  $('#signup').show()
  $('#logout').hide()
  // window.location.href = 'index.html'
}
