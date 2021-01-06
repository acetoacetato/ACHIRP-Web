function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
            $('#imagen')
                .attr('src', e.target.result);
            $('#del-imagen')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(function () {
    $('.upload').on('change', function () {
        readURL(input);
    });
});

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementsByClassName( 'upload' );
var infoArea = document.getElementsByClassName( 'upload-label' );

for(var i=0 ; i< input.length ; i++){
    input[i].addEventListener( 'change', showFileName );
    function showFileName( event ) {
        var input = event.srcElement;
        var fileName = input.files.name;
        var infoArea = document.getElementsByClassName( 'upload-label' );
        for(el in infoArea){
            el.textContent =  'File name: ' + fileName;
        }
    }
}

