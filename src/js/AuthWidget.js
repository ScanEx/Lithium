/** Виджет для визуализации информации о текущем статусе пользователя.
* Показывает кнопки Вход/Выход, имя пользователя. Позволяет отослать логин/пароль на сервер, сменить пароль.
 @memberOf nsGmx
 @class
 @name GeoMixerAuthWidget
*/
import nsGmx from './nsGmx.js';
import {
    _br,
    _div,
    _input,
    makeLinkButton,
    _span,
    _title,
    _,
} from './utilities.js';

(function($, _)
{
    var _dialogCanvas = null;

    function changePasswordDialog()
    {
        if ($('#changePasswordCanvas').length)
            return;

        var oldInput = _input(null, [['dir','className','inputStyle'],['css','width','160px'],['attr','type','password']]),
            newInput = _input(null, [['dir','className','inputStyle'],['css','width','160px'],['attr','type','password']]),
            confirmInput = _input(null, [['dir','className','inputStyle'],['css','width','160px'],['attr','type','password']]),
            changeButton = makeButton(_gtxt("Изменить")),
            canvas = _div([_div([_span([_t(_gtxt("Старый пароль"))]), _br(), oldInput, _br(),
                                _span([_t(_gtxt("Новый пароль"))]), _br(), newInput, _br(),
                                _span([_t(_gtxt("Подтвердите пароль"))]), _br(), confirmInput, _br()],[['css','textAlign','center']]),
                           _div([changeButton],[['css','textAlign','center'],['css','margin','5px']])],[['attr','id','changePasswordCanvas']]),
            checkPassw = function()
            {
                if (newInput.value != confirmInput.value)
                {
                    newInput.value = '';
                    confirmInput.value = '';

                    inputError([newInput, confirmInput], 2000);
                    newInput.focus();

                    return;
                }

                nsGmx.widgets.notifications.startAction('changePassword');
                nsGmx.AuthManager.changePassword(oldInput.value, newInput.value, function()
                {
                    jQuery(canvas.parentNode).dialog("destroy");
                    canvas.parentNode.removeNode(true);

                    nsGmx.widgets.notifications.stopAction('changePassword', 'success', _gtxt('Пароль изменён'));
                }, function( message )
                {
                    message && showErrorMessage(message, true);
                    nsGmx.widgets.notifications.stopAction('changePassword', 'failure');
                })

                oldInput.value = '';
                newInput.value = '';
                confirmInput.value = '';
            };

        showDialog(_gtxt("Изменение пароля"), canvas, 200, 200, false, false);
        canvas.parentNode.style.overflow = 'hidden';

        oldInput.focus();

        changeButton.onclick = function()
        {
            checkPassw();
        }

        $(confirmInput).on('keyup', function(e)
        {
            if (e.keyCode === 13)
            {
                checkPassw();

                return false;
            }

            return true;
        });
    }

    var loginDialogTemplate =
        '<div>' +
            '<div class = "loginMainDiv">' +
                '<form>' +
                    '<div>' +
                        '<span class="loginLabel">{{i "Логин"}}</span><br>' +
                        '<input name="login" class = "inputStyle inputLogin" placeholder = "{{i "адрес электронной почты"}}"><br>' +
                    '</div>' +
                    '<div>' +
                        '<span class="loginLabel">{{i "Пароль"}}</span><br>' +
                        '<input name="password" class = "inputStyle inputPass" type = "password" placeholder = "{{i "пароль"}}"><br>' +
                    '</div>' +
                    '<button class="loginButton">{{i "Вход"}}</button>' +
                '</form>' +
            '</div>' +
            '{{#isMapsSite}}' +
            '<div class="loginLinks">' +
                '<span class = "buttonLink registration">{{i "Регистрация"}}</span><br>' +
                '<span class = "buttonLink passRecovery">{{i "Восстановление пароля"}}</span>' +
            '</div>' +
            '{{/isMapsSite}}' +
        '</div>';

    nsGmx.GeoMixerAuthWidget = function( container, authManager, loginCallback, options )
    {
        var _container = container;
        var _authManager = authManager;
        var _this = this;

        _this.changePasswordDialog = changePasswordDialog;

        options = options || {};

        var _createLogin = function()
        {
            var span = makeLinkButton(_gtxt('Вход'));

            span.onclick = function()
            {
                _this.showLoginDialog( loginCallback );
            }
            _(_container, [_div([span], [['attr','id','log'],['dir','className','log']])]);
        }

        var _createLogout = function()
        {
            var logoutSpan = makeLinkButton(_gtxt('Выход'));

            logoutSpan.onclick = function()
            {
                _authManager.logout(function()
                {
                    if (nsGmx.GeomixerFramework)
                        _mapHelper.reloadMap();
                    else
                        window.location.replace(window.location.href.split("?")[0] + (defaultMapID == globalMapName ? "" : ("&" + globalMapName)));
                });
            }

            var userText = _authManager.getLogin();
            if (_authManager.getFullname() !== null && _authManager.getFullname() !== '')
                userText += ' (' + _authManager.getFullname() + ')';
            var userSpan = _span([_t(userText)], [['css','cursor','pointer']]);

            userSpan.onclick = function()
            {
                if ( _authManager.isAccounts() )
                {
                    if (window.gmxAuthServer)
                        window.open(  window.gmxAuthServer + "Account/ChangePassword", '_blank');
                }
                else
                    changePasswordDialog();
            }

            if ( _authManager.isAccounts() )
                $(userSpan).css('color', '#5555FF');

            _title(userSpan, _gtxt("Изменение пароля"))

            _(_container, [_table([_tr([
                _td([_div([userSpan], [['attr','id','user'],['dir','className','user']])]),
                _td([_div([logoutSpan], [['attr','id','log'],['dir','className','log']])])
            ])])]);
        }

        var _update = function()
        {
            if ( window.gmxViewerUI && window.gmxViewerUI.hideLogin )
                return;

            $(_container).empty();

            if (_authManager.isLogin())
            {
                _createLogout();
            }
            else
            {
                _createLogin();
            }
        }

        $(_authManager).change(_update);
        _update();

        //Показывает диалог с вводом логина/пароля, посылает запрос на сервер.
        this.showLoginDialog = function()
        {
            if (_dialogCanvas) {
                return;
            }

            var isMapsSite = !!window.mapsSite;
            var dialogHeight = isMapsSite ? 210 : 175;

            var canvas = $(Handlebars.compile(loginDialogTemplate)({isMapsSite: isMapsSite})),
                loginInput = canvas.find('.inputLogin')[0],
                passwordInput = canvas.find('.inputPass')[0],
                loginButton = canvas.find('.loginButton')[0];

            var checkLogin = function(){
                _authManager.login(loginInput.value, passwordInput.value, function()
                    { //всё хорошо
                        $(jQueryDialog).dialog("destroy")
                        jQueryDialog.removeNode(true);
                        _dialogCanvas = null;
                        loginCallback && loginCallback();
                    }, function(err)
                    { //ошибка
                        if (err.emailWarning)
                        {
                            var errorDiv = $("<div/>", {'class': 'EmailErrorMessage'}).text(err.message);
                            $(loginButton).after(errorDiv);
                            setTimeout(function(){
                                errorDiv.hide(500, function(){ errorDiv.remove(); });
                            }, 8000)
                        }
                        loginInput.value = '';
                        passwordInput.value = '';
                        inputError([loginInput, passwordInput], 2000);
                        loginInput.focus();
                    }
                );
            };

            _dialogCanvas = canvas;

            var jQueryDialog = showDialog(_gtxt("Пожалуйста, авторизуйтесь"), canvas[0], 248, dialogHeight, false, false, null, function()
            {
                _dialogCanvas = null;
            });

            loginInput.focus();

            loginButton.onclick = checkLogin;

            canvas.find('form').submit(function(e) {
                e.preventDefault();
            })

            canvas.find('.registration').click(options.registrationCallback || function(){
                window.open(window.gmxAuthServer + 'Account/Registration', '_blank');
            });

            canvas.find('.passRecovery').click(function(){
                window.open(window.gmxAuthServer + 'Account/Retrive', '_blank');
            });

            $(passwordInput).on('keyup', function(e)
            {
                if (e.keyCode === 13)
                {
                    checkLogin();

                    return false;
                }

                return true;
            });
        }

        this.getContainer = function()
        {
            return _container;
        }
    }

    // Обратная совместимость. Проверка нужна из-за возможного конфликта с одноимённым классом из общих компонент
    if (!nsGmx.AuthWidget) {
        nsGmx.AuthWidget = nsGmx.GeoMixerAuthWidget;
    }

})(jQuery, nsGmx.Utils._);
