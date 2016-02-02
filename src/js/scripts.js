jQuery(document).ready(function($){

	/**
	 * Date pickers
	 */
	var $dob = $('.dob').pikaday({
		firstDay: 1,
		defaultDate: new Date('1988-01-01'),
		minDate: new Date('1940-01-01'),
		maxDate: new Date('2999-12-31'),
		yearRange: [2000,2020],
		format: 'YYYY-MM-DD'
	});

	var $availability = $('.availability').pikaday({
		firstDay: 1,
		minDate: new Date(),
		maxDate: new Date('2014-12-31'),
		yearRange: [2000,2020],
		format: 'YYYY-MM-DD'
	});

	/**
	 * Add another file button
	 */
	$('.add-file-field').click(function(){
		// Find parent field wrapper
		var parent = $(this).parent('.field');
		// Get first hidden file input
		var nextHidden = parent.find('.file.hidden').first();
		// Show it
		nextHidden.removeClass('hidden');
		// Remove add button if there are no hidden items left
		var filesLeftToAdd = parent.find('.file.hidden');
		if( filesLeftToAdd.length == 0 ) { $(this).addClass('hidden'); }
	});

	/**
	 * Disable submit button after submit
	 */
	$('form').submit(function(){
		//$("input[type=sumit]", this).prop('disabled', true);
		//return false;
	});

	/**
	 * Autocomplete country field
	 */
	$('.country-selector').selectToAutocomplete();
	if ( !!( 'placeholder' in document.createElement('input') ) ) {
    $( '.country-selector-hint' ).remove();
  }

  /**
   * Autocomplete university field (UK unis only)
   */
  $('.university').autocomplete({
  	source: universities,
  	delay: 0
  });

});
