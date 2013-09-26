jQuery(document).ready(function($) {
    var $titleTextTranslation = $('#titleTextTranslation');
    $titleTextTranslation.hide();

    if (domOpts.params.bundle) {
        $('#title').text('Translation: ' + domOpts.params.bundle);
    }

    if (domOpts.params.from) {
        $('#titleText').text('Text (' + domOpts.params.from + ')');
    }

    if (domOpts.params.to) {
        $('tfoot tr').append($('<td/>'));
        $('#titleTextTranslation').text('Text (' + domOpts.params.to + ')');
        $titleTextTranslation.show();
    }

    $('#frontend').show();
});