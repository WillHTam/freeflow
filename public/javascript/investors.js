/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(function () {
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
  // listen for the form login
  var newid
  getData()
  // Show individual item
  $(document).on('click', '#investor .one-item', function (event) {
    newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '.one-map-item', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '#investor-show', function (event) {
    $('#investor').show()
    $('#investor-show').html('')
  })
  $('#add-investor-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    addInvestor(formData)
  })
  $('#edit-investor-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    editInvestor(formData, newid)
  })
  $(document).on('click', '#delete', function (event) {
    event.preventDefault()
    deleteInvestor(newid)
  })
})

$(document).on('click', '.map-btn', function (event) {
  console.log('map-btn clicked')
  $('#header').toggleClass('hide')
  $('#map').toggleClass('hide')
})

function showDetail (newid) {
  $.get(serverURL + 'investors/' + newid)
    .done(function (data) {
      $('#header').hide()
      $('#investor').hide()

      $('#investor-show').html('')
      if ((data.investor.logo === '') || (data.investor.logo === undefined) || (data.investor.logo === null)) {
        data.investor.logo = 'img/default-logo.svg'
        console.log(data.investor.logo)
      }
      if ((data.investor.image === '') || (data.investor.image === undefined) || (data.investor.image === null)) {
        data.investor.image = 'img/default-img.svg'
        console.log(data.investor.image)
      }
      $('#investor-show').append(
        '<h4>' + data.investor.name + '</h4>' +
        '<div id=' + data.investor._id + ' class="one-item">' +
        '<img class="logo-all img-circle" src="' + data.investor.logo + '"/>' +
        '<div class="item-blurb norm">' +
        '<p class="hyphenate"><a href="' + data.investor.website + '">' + data.investor.website + '</a></p>' +
        '<p class="grey 400">' + data.investor.address + '</p>' +
        '<p class=" full grey 400">' + data.investor.description + '</p></div></div>' +
        '<div class="image"><img src="' + data.investor.image + '"/>' +
        '</div>' + '<h3 class="btn btn-md formbutton" data-toggle="modal" data-target="#editModal"><a href="#"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span>EDIT</a></h3>' +
        '<h3 class="btn btn-md formbutton" type="submit" id="delete"><a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>DELETE</a></h3>'
      )
      console.log(data.investor.description)
      console.log(data.investor.image)
    })
}

function getData () {
  $.get(serverURL + 'investors')
    .done(function (data) {
      data.forEach(function (datum) {
        if ((datum.logo === '') || (datum.logo === undefined) || (datum.logo === null)) {
          datum.logo = 'img/default-logo.svg'
          console.log(datum.logo)
        }
        $('#investor').append(
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

function addInvestor (formData) {
  $.ajax({
    type: 'POST',
    url: serverURL + 'investors',
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'investors.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('add Investor Failed')
    }
  })
}

function editInvestor (formData, newid) {
  $.ajax({
    type: 'PUT',
    url: serverURL + 'investors/' + newid,
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'investors.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('edit Investor Failed')
    }
  })
}

function deleteInvestor (newid) {
  $.ajax({
    type: 'DELETE',
    url: serverURL + 'investors/' + newid,
    success: function (response) {
      // then redirect
      window.location.href = 'investors.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('delete Investor Failed')
    }
  })
}

// function createMarkers (map) {
//   $.get(serverURL + 'investors')
//     .done(function (data) {
//       data.forEach(function (datum) {
//         geocoder = new google.maps.Geocoder()
//         console.log(datum.address, datum.name)
//         geocoder.geocode({'address': datum.address}, function (results, status) {
//           if (status === google.maps.GeocoderStatus.OK) {
//             // In this case it creates a marker, but you can get the lat and lng from the location.LatLng
//             var marker = new google.maps.Marker({
//               map: map,
//               position: results[0].geometry.location
//             // title: datum.name
//             })
//             var contentString = '<div id=' + datum._id + ' class="one-map-item">' +
//               datum.name +
//               '</div>'
//             var infowindow = new google.maps.InfoWindow({
//               content: contentString
//             })
//             marker.addListener('click', function () {
//               if (prevOpenWindow != null) {
//                 prevOpenWindow.close()
//               }
//               prevOpenWindow = infowindow
//               infowindow.open(map, marker)
//             })
//           } else {
//             alert('Geocode was not successful for the following reason: ' + status)
//           }
//         })
//       })
//     // console.log(data)
//     }).fail(function (jqXHR, textStatus, errorThrown) {
//       console.log(errorThrown)
//     })
// }

// var prevOpenWindow = null

// function initMap () {
//   var mapDiv = document.getElementById('map')
//   var map = new google.maps.Map(mapDiv, {
//     center: {lat: 1.3521, lng: 103.8198},
//     zoom: 11
//   })

//   createMarkers(map)
// }

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
    var id
    var search = suggestion
    var confirmsearch = search._id
    var searchmodel = search.model
    if (searchmodel === 'co-working-spaces') {
      id = '#cospace'
      window.location.href = 'cospaces.html?id=' + confirmsearch
    }
    if (searchmodel === 'investors') {
      id = '#investor'
      window.location.href = 'investors.html?id=' + confirmsearch
    }
    if (searchmodel === 'incubator-accelerators') {
      id = '#incubator'
      window.location.href = 'incubators.html?id=' + confirmsearch
    }
    if (searchmodel === 'government-programs') {
      id = '#gov'
      window.location.href = 'govs.html?id=' + confirmsearch
    }
    console.log(search.model)
    showDetail(confirmsearch, searchmodel, id)
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
      if ((data.investor.logo === '') || (data.investor.logo === undefined) || (data.investor.logo === null)) {
        data.investor.logo = 'img/default-logo.svg'
        console.log(data.investor.logo)
      }
      if ((data.investor.image === '') || (data.investor.image === undefined) || (data.investor.image === null)) {
        data.investor.image = 'img/default-img.svg'
        console.log(data.investor.image)
      }
      $(id + '-show').append(
        '<div class="close-btn"><a href="investors.html"><img src="img/x-light.svg"></a></div>' +
        '<div class="center toppad">' +
        '<div id=' + data.investor._id + '>' +
        '<img class="logo-all img-circle" src="' + data.investor.logo + '"/>' +
        '<h4 class="toppad">' + data.investor.name + '</h4>' +
        '<div class="norm">' +
        '<p class="hyphenate"><a href="' + data.investor.website + '">' + data.investor.website + '</a></p>' +
        '<p class="toppad address">' + data.investor.address + '</p>' +
        '<p class="grey 400 details">' + data.investor.description + '</p>' +
        '<img class="h-image " src="' + data.investor.image + '"/>' +
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
      console.log(data.investor.description)
      console.log(data.investor.image)
    })
}
