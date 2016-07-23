/* global $ userAuthFailed userAuthSuccess */
var serverURL = 'http://startups-sg.herokuapp.com/'
var currentUser = null

// load the user from the server. This ensures we have a logged in user
function loadUser () {
  $.ajax({
    type: 'GET',
    url: serverURL + 'users/' + window.localStorage['id'],
    beforeSend: function (xhr) {
      xhr.setRequestHeader('User-Email', window.localStorage['email'])
      xhr.setRequestHeader('Auth-Token', window.localStorage['auth_token'])
    },
    success: function (response) {
      // asign the current user
      currentUser = response
      // tell the current page we are ready
      if (typeof (userAuthSuccess) === 'function') userAuthSuccess()
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else error, clear the local storage
      window.localStorage.removeItem('email')
      window.localStorage.removeItem('auth_token')
      // call the userAuthFailed so the page can redirect if it wants
      if (typeof (userAuthFailed) === 'function') userAuthFailed()
    }
  })
}

// when the page is ready, we can add logout/login click handlers
$(function () {
  // If local storage then load user, else call userAuthFailed
  if (window.localStorage['email'] && window.localStorage['auth_token']) {
    userAuthSuccess()
    loadUser()
  } else if (typeof (userAuthFailed) === 'function') {
    userAuthFailed()
  }
  $('#logout').click(function (event) {
    event.preventDefault()

    // to logout we just clear the localstorage and redirect
    window.localStorage.removeItem('email')
    window.localStorage.removeItem('auth_token')
    window.location.href = 'index.html'
  })
})
