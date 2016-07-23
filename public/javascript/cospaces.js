/* global $ google alert geocoder */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(function () {
  $('#map').addClass('hide')
  // listen for the form login
  var newid
  let search
  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
    if (results) return results[1]
    return 0
  }
  var id = $.urlParam('id')
  if (id) {
    showDetails(id, window.localStorage['searchmodel'], window.localStorage['id'])
  } else {
    getData()
  }

  // Show individual item
  $(document).on('click', '#cospace .one-item', function (event) {
    newid = $(this).attr('id')
    showDetail(newid)
  })
  $(document).on('click', '.one-map-item', function (event) {
    newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  // $(document).on('click', '#cospace-show', function (event) {
  //   $('#cospace').show()
  //   $('#cospace-show').html('')
  // })
  $('#add-cospace-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    addCospace(formData)
  })
  $('#edit-cospace-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    editCospace(formData, newid)
  })
  $(document).on('click', '#delete', function (event) {
    event.preventDefault()
    deleteCospace(newid)
  })
  $(document).on('click', '#search-enter', function (event) {
    console.log(search)
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
})

$(document).on('click', '.map-btn', function (event) {
  console.log('map-btn clicked')
  $('#header').toggleClass('hide')
  $('#map').toggleClass('hide')
})

// Clicking on X brings the Add New Entry button back to screen
$(document).on('click', '.close-btn', function (event) {
  $('.add').show()
  console.log('close-btn clicked')
})

function showDetail (newid) {
  $.get(serverURL + 'co-working-spaces/' + newid)
    .done(function (data) {
      $('#header').hide()
      $('#cospace').hide()
      $('#map').hide()
      $('.map-btn').addClass('hide')
      // $('.add').addClass('hide')
      $('#cospace-show').html('')
      if ((data.cospace.logo === '') || (data.cospace.logo === undefined) || (data.cospace.logo === null)) {
        data.cospace.logo = 'img/default-logo.svg'
        console.log(data.cospace.logo)
      }
      if ((data.cospace.image === '') || (data.cospace.image === undefined) || (data.cospace.image === null)) {
        data.cospace.image = 'img/default-img.svg'
        console.log(data.cospace.image)
      }
      $('#cospace-show').append(
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
      $('#cospace-show').show()
      console.log(data.cospace.description)
      console.log(data.cospace.image)
    })
}

function getData () {
  console.log(serverURL)
  $.get(serverURL + 'co-working-spaces')
    .done(function (data) {
      data.forEach(function (datum) {
        if ((datum.logo === '') || (datum.logo === undefined) || (datum.logo === null)) {
          datum.logo = 'img/default-logo.svg'
          console.log(datum.logo)
        }
        $('#cospace').append(
          '<div id=' + datum._id + ' class="one-item">' +
          '<img class="logo-all img-circle full-avatar" src="' + datum.logo + '"/>' +
          '<div class="item-blurb norm">' +
          '<h6 class="name-all">' + datum.name + '</h6>' +
          '<p class="hyphenate"><a href="' + datum.website + '">' + datum.website + '</a></p>' +
          '<p class="address">' + datum.address + '</p>' +
          '<p class="truncate full grey">' + datum.description + '</p>' +
          '</div>'
        )
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}

function addCospace (formData) {
  $.ajax({
    type: 'POST',
    url: serverURL + 'co-working-spaces',
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'cospaces.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('add Cospace Failed')
    }
  })
}

function editCospace (formData, newid) {
  $.ajax({
    type: 'PUT',
    url: serverURL + 'co-working-spaces/' + newid,
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'cospaces.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('edit Cospace Failed')
    }
  })
}

function deleteCospace (newid) {
  $.ajax({
    type: 'DELETE',
    url: serverURL + 'co-working-spaces/' + newid,
    success: function (response) {
      // then redirect
      window.location.href = 'cospaces.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('delete Cospace Failed')
    }
  })
}

function createMarkers (map) {
  $.get(serverURL + 'co-working-spaces')
    .done(function (data) {
      data.forEach(function (datum) {
        geocoder = new google.maps.Geocoder()

        geocoder.geocode({'address': datum.address}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            // In this case it creates a marker, but you can get the lat and lng from the location.LatLng
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            // title: datum.name
            })
            var contentString = '<div id=' + datum._id + ' class="one-map-item">' +
              datum.name +
              '</div>'
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            })
            marker.addListener('click', function () {
              if (prevOpenWindow != null) {
                prevOpenWindow.close()
              }
              prevOpenWindow = infowindow
              infowindow.open(map, marker)
            })
          } else {
            alert('Geocode was not successful for the following reason: ' + status)
          }
        })
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}

var prevOpenWindow = null

function initMap () {
  var mapDiv = document.getElementById('map')
  var map = new google.maps.Map(mapDiv, {
    center: {lat: 1.3521, lng: 103.8198},
    zoom: 11
  })

  createMarkers(map)
}
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
    search = suggestion
    console.log(search)
    console.log(suggestion, dataset)
    var confirmsearch = search._id
    console.log(confirmsearch)
    console.log(search)
    showDetail(confirmsearch)
  })
// $input.keyup(function() {
//   index.search($input.val(), {
//     hitsPerPage: 10,
//     facets: '*'
//   }, searchCallback)
// }).focus()
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
function showDetails (newid, route, id) {
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
      console.log(id)
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
      console.log(data.cospace)
    })
}
