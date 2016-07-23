/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(document).on('click', '#cospace-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'cospaces.html'
  console.log(newid)
})

$(document).on('click', '#inc-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'incubators.html'
  console.log(newid)
})

$(document).on('click', '#event-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'events.html'
  console.log(newid)
})

$(document).on('click', '#govt-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'govs.html'
  console.log(newid)
})

$(document).on('click', '#search-enter', function (event) {
// var confirmsearch = search._id
// console.log(confirmsearch)
// console.log(search)
// showDetail(confirmsearch)
})

$('#search-input').keypress(function (e) {
  if (e.which === 13) { // Enter key pressed
    $('#search-enter').click() // Trigger search button click event
    console.log('hit')
  }
})

// SEARCH FUNCTION ALGOLIA
$(document).ready(function () {
  var client = algoliasearch('MSZ2UYVAZJ', '78510e196a674bb800715809fb0ad104')
  var index = client.initIndex('startup_index')
  var $input = $('input')
  autocomplete('#search-input', {hint: false}, [
    {
      source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
      displayKey: 'name',
      templates: {
        suggestion: function (suggestion) {
          return suggestion._highlightResult.name.value
        }
      }
    }
  ]).on('autocomplete:selected', function (event, suggestion, dataset) {
    console.log(suggestion)
    window.localStorage.confirmsearch = suggestion._id
    window.localStorage.searchmodel = suggestion.model
    if (window.localStorage['searchmodel'] === 'co-working-spaces') {
      window.localStorage.id = '#cospace'
      window.location.href = 'cospaces.html?id=' + window.localStorage['confirmsearch']
    }
    if (window.localStorage['searchmodel'] === 'investors') {
      window.localStorage.id = '#investor'
      window.location.href = 'investors.html?id=' + window.localStorage['confirmsearch']
    }
    if (window.localStorage['searchmodel'] === 'incubator-accelerators') {
      window.localStorage.id = '#incubator'
      window.location.href = 'incubators.html?id=' + window.localStorage['confirmsearch']
    }
    if (window.localStorage['searchmodel'] === 'government-programs') {
      window.localStorage.id = '#gov'
      window.location.href = 'govs.html?id=' + window.localStorage['confirmsearch']
    }
    //console.log(search.model)
    // showDetail(confirmsearch, searchmodel, id)
  })
})

function searchCallback (err, content) {
  if (err) {
    console.error(err)
    return
  }
  var $users = $('#users')
  $users.empty()
  for (var i = 0; i < content.hits.length; i++) {
    $users.append('<li>' + content.hits[i].name + '</li>')
  }
}

function showDetail (newid, route, id) {
  $.get(serverURL + route + '/' + newid)
    .done(function (data) {
      console.log(route)
      $('#header').hide()
      $(id).hide()
      $('#map').hide()
      $('.map-btn').addClass('hide')
      $('.add').addClass('hide')
      $(id + '-show').html('')
      if ((data.cospace.logo === '') || (data.cospace.logo === undefined) || (data.cospace.logo === null)) {
        data.cospace.logo = 'img/default-logo.svg'
        console.log(data.cospace.logo)
      }
      if ((data.cospace.image === '') || (data.cospace.image === undefined) || (data.cospace.image === null)) {
        data.cospace.image = 'img/default-img.svg'
        console.log(data.cospace.image)
      }
      $(id + '-show').append(
        '<div class="close-btn"><a href="cospaces.html"><img src="img/x-light.svg"></a></div>' +
        '<div class="center toppad">' +
        '<div id=' + data.cospace._id + '>' +
        '<img class="logo-all img-circle" src="' + data.cospace.logo + '"/>' +
        '<h4 class="toppad">' + data.cospace.name + '</h4>' +
        '<div class="norm">' +
        '<p class="hyphenate"><a href="' + data.cospace.website + '">' + data.cospace.website + '</a></p>' +
        '<p class="toppad address">' + data.cospace.address + '</p>' +
        '<p class="grey 400 details">' + data.cospace.description + '</p>' +
        '<img class="h-image " src="' + data.cospace.image + '"/>' +
        '<div class="edit-del toppad">' +
        '<h5 class="btn-md" data-toggle="modal" data-target="#editModal">' +
        '<a href="#">' +
        '<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit</a>' +
        '</h5>' +
        '<h5 class="btn-md" type="submit" id="delete"><a href="#">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete</a>' +
        '</h5>' +
        '</div></div>'
      )
      $(id + '-show').show()
      console.log(data.cospace.description)
      console.log(data.cospace.image)
    })
}
