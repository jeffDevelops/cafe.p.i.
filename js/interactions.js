$(document).ready(function() {

  $landingContainer = $('.landing_container');
  $sidebar = $('.sidebar');
  $textInputs = $(':text');
  $checkboxes = $('.checked');

  // Hide landing div
  $('#mapbox_trigger').on('click', function() {
    $landingContainer.animate({opacity: 0}, function() {
      $(this).css('display', 'none');
      $sidebar.css('transform', 'translate(0)');
    });
  });

  $textInputs.each(function() {
    $(this).on('focus', function() {
      $(this).next().css('transform', 'scaleY(2)');
      $(this).next().css('background-image', 'linear-gradient(to right, rgba(255, 188, 103, 1), rgba(218, 114, 126, 1))');
    });
    $(this).on('blur', function() {
      $(this).next().css('transform', 'scaleY(1)');
      $(this).next().css('background-image', 'linear-gradient(to right, rgba(185, 185, 185, 1), rgba(210, 210, 210, 1))');
    });
  });

  $checkboxes.each(function() {
    $(this).data('checked', false);
    $(this).on('click', function() {
      if (!$(this).data().checked) {
        $(this).data().checked = true;
        $(this).parent().css('background-image', 'linear-gradient(to right, rgba(255, 188, 103, 1), rgba(218, 114, 126, 1))');
        $(this).prepend('<i class="material-icons checkmark">check</i>')
      } else {
        $(this).data().checked = false;
        $(this).parent().css('background-image', 'linear-gradient(to right, rgba(185, 185, 185, 1), rgba(185, 185, 185, 1))');
        $(this).children().remove();
      }
    });
  });

});