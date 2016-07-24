$(document).ready(function () {
  $('li').click(function () {
    $('.btn').empty()
    $('.btn').append($(this).text() + '<span class="caret"></span>')
  })
})
