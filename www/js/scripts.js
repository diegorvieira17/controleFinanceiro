//fix parameters before aplication start
$(document).ready(function () {
	//set user theme (get with db)
	//$('.pageTheme').attr('data-theme', 'a');
	hideElements('txtIdSnUp');

	//set buttons events
	//################### SIGN IN #########################
    $('#btnSignInSnIn').on("tap",function() {
        var email = $('#txtEmailSnIn').val();
        var passwd = $('#txtPasswdSnIn').val();

        signIn(email, passwd);
    });

    $('#btnExitSnIn').on("tap",function() {
        navigator.app.exitApp();
        //navigator.notification.confirm('Deseja realmente sair?', exitFromApp, 'msg cabeçalho', 'Cancelar,OK')
    });

    // $('#btnExitSnIn').on("tap", exit());

    $('#btnSignUpSnIn').on("tap",function() {
        $.mobile.changePage('#pgSignUp');
    });

    //################### SIGN UP #########################
    $('#btnRegister').on("tap",function() {
        var email = $('#txtEmailSnUp').val();
        var passwd = $('#txtPasswddSnUp').val();
        var name = $('#txtNameSnUp').val();
        var cel = $('#txtCelSnUp').val();

        signUp(email, passwd, name, cel);
    });
});

//update user theme
function updateTheme (theme) {
	$('.pageTheme').attr('data-theme', theme);
	location.reload();
};

//hide elements
function hideElements (elem) {
	$('#' + elem).css({'display':'none'});
};

// function exit () {
// 	navigator.app.exitApp();
// };