var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');
var $userId = $('#user-selector');
var $deleteBtn;

$chirpButton.click(postChirp);

//chirp button disable logic 
 $chirpField.on('input', function(){
    var isEmpty = $chirpField.val().length === 0;
        $chirpButton.prop('disabled', isEmpty);
 });

//box options populated from a GET request to get the users
// $userId.on......


//delete btn logic-will add functionality in AngularJS
//  $($deleteBtn).on('click', function(){
//     $chirpDiv.remove();
//     getChirps();
//  });
 
function postChirp(){
    var chirp = {
        userId: $userId.val(),
        user: '',
        message: $chirpField.val(),
        timestamp: '',
    };
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success){
        $chirpField.val('');
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err){
        console.log(err);
    });
}

function getChirps(){
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function(chirps){
        //clears out old list of chirps and rewrites with the new
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++){
            var $chirpDiv = $('<div class="chirp"></div>');
            var $user = $('<h4></h4>');            
            var $message = $('<p></p>');
            var $timestamp = $('<h5></h5>');
            var $deleteBtn = $('<button class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> DELETE</button>');

            $user.text(chirps[i].user);
            $message.text(chirps[i].message);
            $timestamp.text(new Date(chirps[i].timestamp).toLocaleString());

            $user.appendTo($chirpDiv);
            $message.appendTo($chirpDiv);
            $timestamp.appendTo($chirpDiv);
            $deleteBtn.appendTo($chirpDiv);

            $chirpDiv.appendTo($chirpList);
        }
    }, function(err){
        console.log(err);
    });
}
getChirps();
