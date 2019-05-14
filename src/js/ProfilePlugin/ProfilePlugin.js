﻿import nsGmx from '../nsGmx.js';
import gmxCore from '../gmxcore.js';
import {
    parseResponse,
    removeDialog,
    sendCrossDomainJSONRequest,
    sendCrossDomainPostRequest,    
} from '../utilities.js';

(function ($) {
    var mykosmosnimki = location.protocol + "//my.kosmosnimki.ru"; //"http://localhost:56319"; //

    var initTranslations = function () {


        _translationsHash.addtext("rus", { ProfilePlugin: {

            profile: "Профиль",
            billing: "Биллинг",
            developer: "Разработчикам",

            firstName: "Фамилия",
            lastName: "Имя",
            email: "Электронная почта",
            login: "Псевдоним",
            fullName: "Полное имя",
            phone: "Телефон",
            company: "Название организации",
            companyProfile: "Вид деятельности организации",
            companyPosition: "Должность",
            isCompany: "Я выступаю от имени организации",
            subscribe: "Я согласен получать сообщения по почте",
            saveChanges: "Сохранить",

            used: "используется",
            remain: "осталось",
            fileStorage: "Файлы",
            fileStorageUsed: "Хранилище файлов используется",
            fileStorageRemain: "Хранилище файлов осталось",
            vectorLayerStorage: "Векторные данные",
            vectorLayerStorageUsed: "Хранилище векторных слоев используется",
            vectorLayerStorageRemain: "Хранилище векторных слоев осталось",
            subscription: "Подписки (Live Alerts)",
            subscriptionUsed: "Подписок (Live Alerts) имеется",
            subscriptionRemain: "Подписок (Live Alerts) осталось",
            smsAvailable: "Sms (Live Alerts) доступны",

            apiKeys: "API-ключи",
            apiKeyInvite: "Для получения ключей воспользуйтесь соответсвующими ссылками",
            apiKeyDomain: "API-ключ на домен (вставка окна карты на сайт)",//"API-ключ для сайтов (вставка окна карты на сайт)", //"API-Ключ для домена (для сайтов)",
            apiKeyDomainCap: "API-ключ на домен",
            apiKeyDirect: "API-ключ для приложений (запросы к REST/OGC)", //"API-Ключ прямого доступа (для приложений)",
            apiKeyDirectCap: "API-ключ для приложений",
            apiKeyList: "Список API-ключей",
            apiKeyListCap: "Список API-ключей",
            apiKeyDirectShort: "Ключ для приложения",
            apiKeyFilter: "API-ключ или домен",
            apiKeyFilterApply: "Найти",
            apiKeyEnabled: "активен",
            apiKeyDisabled: "не активен",
            apiKeyCreated: "получен",

            directKeyPurpose1: "API-ключ для приложений используется для обращений к <a target='blank' class='hyperLink' href='https://geomixer.ru/docs/dev-manual/rest-api/get-started/'>REST-сервисам</a> для подключения данных в настольные и/или веб-приложения.",
            directKeyPurpose2: "API-ключ для приложений НЕ может быть использован на публичных сайтах.",
            apiKeySite: "Сайт:",
            apiKeyReadAgreement: "Пожалуйста, ознакомьтесь с ",
            apiKeyAgreement: "я согласен с ",
            apiKeyConditions: "условиями использования",
            apiKeyGet: "Получить ключ",
            apiKeyUrge: "Необходимо принять условия использования",
            apiKeyAccept: "Принять",
            apiKeyCancel: "Отклонить",
            apiKeyReceive: "Ваш новый ключ",

            ErrorApiKeySiteEmpty: "Поле сайт не может быть пустым!",
            ErrorApiKeySiteInvalid: "Введите корректный адрес вашего сайта! Например, http://kosmosnimki.ru",
            ErrorApiKeyConditionsNotAccepted: "Для получения ключа необходимо согласиться с условиями использования!",

            clientRegistration: "Регистрация oAuth клиента",
            appName: "Название приложения",
            clientID: "ID клиента (client_id)",
            clientSecret: "oAuth ключ клиента (client_secret)",
            redirectUri: "URI скрипта обратного вызова (redirect_uri)",
            registerClient: "Получить новый ключ",

            password: "Пароль",
            getNew: "Изменить",
            cancelNew: "Закрыть",
            passwordSaved: "сохранен",
            passwordChanged: "изменен",
            old: "Старый пароль",
            newp: "Новый пароль",
            repeat: "Повтор пароля",
            submitp: "Изменить",

            megabyte: " мБ",
            yes: "да",
            no: "нет",

            ErrorNOT_AUTHORIZED: "Пользователь не авторизован!",
            ErrorLoginEmpty: "Требуется указать псевдоним!",
            ErrorLoginFormat: "Неправильный псевдоним! Допустимый вариант ",
            ErrorLoginExists: "Псевдоним уже используется!",
            ErrorAppName: "Не указано название приложения!",
            ErrorRedirectUri: "Требуется действительный uri обратного вызыва!",
            ErrorOldPassword: "Старый пароль указан неверно!",
            ErrorNewPassword: "Пароль не может быть пустым!",
            ErrorNotMatch: "Введённые пароли не совпадают!",

            ErrorCapchaRequired: "Введите число!",
            ErrorWrongCapcha: "Числа не совпадают!",
            ErrorEmailEmpty: "Требуется указать email!",
            ErrorWrongEmail: "Недопустимый адрес электронной почты!",
            ErrorEmailExists: "Такой адрес электронной почты уже зарегистрирован!",

            dataUpdateSuccess: "Изменения сохранены",

            registration: "Регистрация",
            registrationPageAnnotation: "Заполните поля формы",
            //registrationPageAnnotation: "Заполните поля формы. Введите ваш адрес электронной почты, псевдоним, желаемый пароль и число с картинки. Можете указать фамилилию и имя.",
            capcha: "Введите число",
            register: "Зарегистрироваться",
            backOn: "Повторить",
            loginPage: "вход",
            close: "Закрыть"

        }
        });

        _translationsHash.addtext("eng", { ProfilePlugin: {
            profile: "Profile",
            billing: "Billing",
            developer: "Developer",

            firstName: "First name",
            lastName: "Last name",
            email: "Email",
            login: "Nickname",
            fullName: "Full name",
            phone: "Phone",
            company: "Company",
            companyProfile: "Type of company activity",
            companyPosition: "Company position",
            isCompany: "I am speaking on behalf of the organization",
            subscribe: "I agree to receive updates and news by email",
            saveChanges: "Save",

            used: "used",
            remain: "rest",
            fileStorage: "Files",
            fileStorageUsed: "File storage consumtion",
            fileStorageRemain: "File storage remain",
            vectorLayerStorage: "Vector data",
            vectorLayerStorageUsed: "Vector storage consumption",
            vectorLayerStorageRemain: "Vector storage remain",
            subscription: "Subscriptions",
            subscriptionUsed: "Subscription consumption",
            subscriptionRemain: "Subscription remain",
            smsAvailable: "Sms",

            apiKeys: "API-keys",
            apiKeyInvite: "To get a key use apropriate links below",
            apiKeyDomain: "Domain API-key (for sites)",
            apiKeyDomainCap: "Domain API-key",
            apiKeyDirect: "Direct access API-key (for applications)",
            apiKeyDirectCap: "Direct access API-key",
            apiKeyList: "Issued API-keys list",
            apiKeyListCap: "Issued API-keys list",
            apiKeyDirectShort: "Direct access key",
            apiKeyFilter: "Key or domain",
            apiKeyFilterApply: "Search",
            apiKeyEnabled: "enabled",
            apiKeyDisabled: "disabled",
            apiKeyCreated: "created",

            directKeyPurpose1: "API-ключ для приложений используется для обращений к REST-сервисам (https://geomixer.ru/docs/dev-manual/rest-api/get-started/) для подключения данных в настольные и/или веб-приложения. API-ключ для приложений НЕ может быть использован на публичных сайтах.",
            directKeyPurpose2: "Ключ прямого доступа не может быть использован на сайте.",
            apiKeySite: "Site:",
            apiKeyReadAgreement: "Пожалуйста, ознакомьтесь с ",
            apiKeyAgreement: "я согласен с ",
            apiKeyConditions: "условиями использования",
            apiKeyGet: "Get the key",
            apiKeyUrge: "Необходимо принять условия использования",
            apiKeyAccept: "Accept",
            apiKeyCancel: "Cancel",
            apiKeyReceive: "Ваш новый ключ",

            ErrorApiKeySiteEmpty: "Поле сайт не может быть пустым!",
            ErrorApiKeySiteInvalid: "Введите корректный адрес вашего сайта! Например, http://kosmosnimki.ru",
            ErrorApiKeyConditionsNotAccepted: "Для получения ключа необходимо согласиться с условиями использования!",

            clientRegistration: "oAuth Client Registration",
            appName: "Client Application",
            clientID: "Client ID (client_id)",
            clientSecret: "Client secret key (client_secret)",
            redirectUri: "Redirect endpoint URI",
            registerClient: "Issue new secret key",

            password: "Password",
            getNew: "change",
            cancelNew: "close",
            passwordSaved: "saved",
            passwordChanged: "changed",
            old: "Old password",
            newp: "New password",
            repeat: "Repeat",
            submitp: "Change",

            megabyte: " MB",
            yes: "yes",
            no: "no",

            ErrorNOT_AUTHORIZED: "Authorization is required!",
            ErrorLoginEmpty: "Nickname is required!",
            ErrorLoginFormat: "Invalid nickname! Allowable nickname ",
            ErrorLoginExists: "Nickname duplicates!",
            ErrorAppName: "Application name is required!",
            ErrorRedirectUri: "Valid redirect uri is required!",
            ErrorOldPassword: "Password is invalid!",
            ErrorNewPassword: "Password is required!",
            ErrorNotMatch: "Passwords does not match!",

            ErrorCapchaRequired: "Input a number!",
            ErrorWrongCapcha: "Number mismatch!",
            ErrorEmailEmpty: "Email is required!",
            ErrorWrongEmail: "Invalid email!",
            ErrorEmailExists: "Email duplicates!",

            dataUpdateSuccess: "Saved successfully",

            registration: "Registration",
            registrationPageAnnotation: "Please fill all fields",
            capcha: "Input a number",
            register: "Register",
            backOn: "Back to",
            loginPage: "Login",
            close: "Close"

        }
        });
    }

    var ppBackScreen = $("div.profilePanel"),
    ppMainParts;

    var showProfile = function () {
        if (!ppBackScreen.length) {
            // Create
            ppBackScreen = $('<div class="profilePanel"><table width="100%" height="100%"><tr><td><img src="img/progress.gif"></td></tr></table></div>').hide().appendTo('#all');
            var ppFrame = $('<div class="profilePanel-content"></div>');
            var ppScrollableContainer = $('<div class="profilePanel-scrollable"></div>');
            var ppMenu = $('<div class="profilePanel-menu"></div>');
            var success = $('<div class="UpdateMessage"><div class="success">' + _gtxt('ProfilePlugin.dataUpdateSuccess') + '</div></div>');
            var fail = $('<div class="UpdateMessage"><div class="fail">' + 'Error' + '</div></div>');

            // Pages
            var pageTemplate =
                '<div class="page">' +
                    '{{#each items}}' +
                        '{{#if form_caption}}' +
                            '<div class="form-caption {{#if first}}first{{/if}}">{{text}}</div>' +
                        '{{/if}}' +
                        '{{#if span}}' +
                            '<div>{{text}}: <span {{#if id}}class="{{id}}"{{/if}}></span></div>' +
                        '{{/if}}' +
                        '{{#if span_nl}}' +
                            '<div>{{text}}:<br/><span {{#if id}}class="{{id}}"{{/if}}></span></div>' +
                        '{{/if}}' +
                        '{{#if block}}' +
                            '<div>' +
                                '{{#content}}' +
                                    '{{#if p}}<p>{{text}}</p>{{/if}}' +
                                    '{{#if link_button}}<div {{#if id}}class="{{id}} link_button"{{/if}}><span>{{text}}</span></div>{{/if}}' +
                                '{{/content}}' +
                            '</div>' +
                        '{{/if}}' +
                        '{{#if text_input}}' +
                            '<div onclick="$(this).children().focus()" class="editable">{{text}}: <input {{#if id}}class="{{id}}"{{/if}} type="text" value=""></div>' +
                        '{{/if}}' +
                        '{{#if text_area}}' +
                            '<div onclick="$(this).children().focus()" class="editable">{{text}}: <textarea {{#if id}}class="{{id}}"{{/if}}></textarea></div>' +
                        '{{/if}}' +
                        '{{#if error}}' +
                            '<div class="ErrorSummary">error</div>' +
                        '{{/if}}' +
                        '{{#if button_input}}' +
                            '<div class="SubmitBlock" {{#if width}}style="width:{{width}}"{{/if}}>' +
                            '<input type="button" {{#if id}}class="{{id}}"{{/if}} value="{{text}}"/>' +
                            '<img src="img/progress.gif"></div>' +
                        '{{/if}}' +

                        '{{#if checkbox_group}}' +
                            '<table>' +
                            '{{#each checkbox_group}}' +
                                '<tr><td><input type="checkbox" class="{{id}}" id="pp{{id}}"></td><td><label for="pp{{id}}">{{text}}</label></td></tr>' +
                            '{{/each}}' +
                            '</table>' +
                        '{{/if}}' +
                        '{{#if table}}' +
                            '<table border=0 class="{{id}}">' +
                            '{{#columns}}' + '<tr><th>{{column1}}</th><th>{{column2}}</th><th>{{column3}}</th></tr>' + '{{/columns}}' +
                            '{{#rows}}' + '<tr>{{#cells}}<td class="{{id}}">{{text}}</td>{{/cells}}</tr>' + '{{/rows}}' +
                            '</table>' +
                        '{{/if}}' +
                    '{{/each}}' +
                '</div>';
            var page1 = $(Handlebars.compile(pageTemplate)(
            { id: "page1", items: [
                { span: true, id: "Email", text: _gtxt('ProfilePlugin.email') },
                { text_input: true, id: "Login LoginEmpty LoginFormat LoginExists correct", text: _gtxt('ProfilePlugin.login') },
                { text_input: true, id: "FullName correct", text: _gtxt('ProfilePlugin.fullName') },
                { text_input: true, id: "Phone correct", text: _gtxt('ProfilePlugin.phone') },
                { text_input: true, id: "Company correct", text: _gtxt('ProfilePlugin.company') },
                { text_input: true, id: "CompanyProfile correct", text: _gtxt('ProfilePlugin.companyProfile') },
                { text_input: true, id: "CompanyPosition correct", text: _gtxt('ProfilePlugin.companyPosition') },
                { checkbox_group: [
                    { id: "IsCompany", text: _gtxt('ProfilePlugin.isCompany') },
                    { id: "Subscribe", text: _gtxt('ProfilePlugin.subscribe') }
                ]
                },
                { error: true },
                { button_input: true, id: "SaveChanges", text: _gtxt('ProfilePlugin.saveChanges') }
            ]
            })).appendTo(ppFrame),
            page2 = $(Handlebars.compile(pageTemplate)(
            { id: "page2", items: [
                { table: true, id: "ResourceTable",
                    columns: [{ column1: "", column2: _gtxt('ProfilePlugin.used'), column3: _gtxt('ProfilePlugin.remain')}],
                    rows: [
                        { cells: [
                        { id: "FileStorage", text: _gtxt('ProfilePlugin.fileStorage') },
                        { id: "FileStorageUsed value", text: "b1" },
                        { id: "FileStorageRemain value", text: "c1"}]
                        },
                        { cells: [
                        { id: "VectorLayerStorage", text: _gtxt('ProfilePlugin.vectorLayerStorage') },
                        { id: "VectorLayerStorageUsed value", text: "b2" },
                        { id: "VectorLayerStorageRemain value", text: "c2"}]
                        },
                        { cells: [
                        { id: "Subscription", text: _gtxt('ProfilePlugin.subscription') },
                        { id: "SubscriptionUsed value", text: "b3" },
                        { id: "SubscriptionRemain value", text: "c3"}]
                        }
                    ]

                },
                { span: true, id: "SmsAvailable", text: _gtxt('ProfilePlugin.smsAvailable') }
            ]
            })).appendTo(ppFrame),
            page3 = $(Handlebars.compile(pageTemplate)(
            { id: "page3", items: [
                { form_caption: true, text: _gtxt('ProfilePlugin.apiKeys'), first: true },
                { block: true, content: [{ link_button: true, text: _gtxt('ProfilePlugin.apiKeyList'), id: "apiKeyList"}] },
                { block: true, content: [
                     { p: true, text: _gtxt('ProfilePlugin.apiKeyInvite') },
                     { link_button: true, text: _gtxt('ProfilePlugin.apiKeyDomain'), id: "apiKeyDomain" },
                     { link_button: true, text: _gtxt('ProfilePlugin.apiKeyDirect'), id: "apiKeyDirect" }
                ]
                },
                { form_caption: true, text: _gtxt('ProfilePlugin.clientRegistration') },
                { text_input: true, id: "AppName correct", text: _gtxt('ProfilePlugin.appName') },
                { span: true, id: "ClientID", text: _gtxt('ProfilePlugin.clientID') },
                { span_nl: true, id: "ClientSecret", text: _gtxt('ProfilePlugin.clientSecret') },
                { text_input: true, id: "RedirectUri correct", text: _gtxt('ProfilePlugin.redirectUri') },
                { error: true },
                { button_input: true, id: "RegisterClient", text: _gtxt('ProfilePlugin.registerClient'), width: '180px' }
            ]
            })).appendTo(ppFrame);

            // Profile submit
            var successmess_timeout;
            page1.find('.SaveChanges').click(function () {
                changePassForm.slideUp("fast");
                changePassControls.first().val(_gtxt('ProfilePlugin.getNew'));
                success.hide();
                var wait = $(this).next().css('visibility', 'visible');
                clearTimeout(successmess_timeout);

                sendCrossDomainPostRequest(mykosmosnimki + "/Handler/Settings", { WrapStyle: 'message',
                    Login: page1.find('.Login').val().trim(),
                    FullName: page1.find('.FullName').val().trim(),
                    Phone: page1.find('.Phone').val().trim(),
                    Company: page1.find('.Company').val().trim(),
                    Profile: page1.find('.CompanyProfile').val().trim(),
                    Position: page1.find('.CompanyPosition').val().trim(),
                    IsCompany: page1.find('.IsCompany').is(":checked"),
                    Subscribe: page1.find('.Subscribe').is(":checked")
                    },
                    function (response) {
                        wait.css('visibility', 'hidden');
                        if (response.Status.toLowerCase() == 'ok' && response.Result) {
                            //page1.children('.ErrorSummary').text('error').css('visibility', 'hidden');
                            page1.children('.ErrorSummary').hide();
                            success.show();
                            successmess_timeout = setTimeout(function () { success.hide(); }, 2000);
                        }
                        else if (response.Result.length > 0 && response.Result[0].Key)
                            page1.trigger('onerror', [response.Result[0].Key, response.Result[0].Value.Errors[0].ErrorMessage]);
                        else
                            page1.trigger('onerror', response.Result.Message);                          
                    });
            });

            // Register client submit
            var newsecret_timeout;
            page3.find('.RegisterClient').click(function () {

                closeApiKeyDialog();
                var wait = $(this).next().css('visibility', 'visible');
                var client_secret = page3.find('.ClientSecret').removeClass('new');
                clearTimeout(newsecret_timeout);

                sendCrossDomainPostRequest(mykosmosnimki + "/Handler/RegisterClient", { WrapStyle: 'message',
                    AppName: page3.find('.AppName').val(), RedirectUri: page3.find('.RedirectUri').val()
                },
                      function (response) {
                          wait.css('visibility', 'hidden');
                          if (response.Status.toLowerCase() == 'ok' && response.Result) {
                              client_secret.addClass('new').text(response.Result.Key);
                              newsecret_timeout = setTimeout(function () { client_secret.removeClass('new'); }, 2000);
                              //page3.children('.ErrorSummary').css('visibility', 'hidden');
                              page3.children('.ErrorSummary').hide();
                          }
                          else {
                              page3.trigger('onerror', response.Result.Message);
                          }
                      });
            });
            var ppPages = ppFrame.find('div.page').hide();

            // Change password form
            var changePassControls = $(Handlebars.compile(
            '<input style="width:80px; float:right; margin:6px 12px 0 0;" type="button" value="{{i "ProfilePlugin.getNew"}}"/>' +
            '<div style="border:none; font-weight:normal;margin:10px 0 10px 12px;">{{i "ProfilePlugin.password"}} <span class="PasswordState">{{i "ProfilePlugin.passwordSaved"}}</span></div>')())
            .insertAfter(page1.find('.Email').parent()),
            changePassForm = $(Handlebars.compile(
            '<div class="newpass-form">' +
                '{{i "ProfilePlugin.old"}}: <input type="password" class="OldPassword" value=""><br/>' +
                '{{i "ProfilePlugin.newp"}}: <input type="password" class="NewPassword NotMatch" value=""><br/>' +
                '{{i "ProfilePlugin.repeat"}}: <input type="password" class="PasswordRepeat NotMatch" value=""><br/>' +
                '<div class="ErrorSummary" style="padding-top:6px"></div>\
                <div class="SubmitBlock">\
                <input type="button" class="ChangePassword" value="{{i "ProfilePlugin.submitp"}}"/>\
                <img src="img/progress.gif"></div>' +

            '</div>')()),
            changePass_timeout;

            changePassForm.insertAfter(changePassControls.last());
            changePassForm.find('.ChangePassword').click(function () {
                //clearPageErrors($(this));
                //clearPageErrors(page1);
                var wait = $(this).next().css('visibility', 'visible');
                sendCrossDomainPostRequest(mykosmosnimki + "/Handler/ChangePassword", { WrapStyle: 'message',
                    oldpassword: changePassForm.children('.OldPassword').val().trim(),
                    password: changePassForm.children('.NewPassword').val().trim(),
                    repeat: changePassForm.children('.PasswordRepeat').val().trim()
                },
                function (response) {
                    wait.css('visibility', 'hidden');
                    clearTimeout(changePass_timeout);
                    if (response.Status.toLowerCase() == 'ok' && response.Result) {
                        var state = changePassForm.hide().prev().find('.PasswordState').text(_gtxt('ProfilePlugin.passwordChanged')).addClass('changed');
                        changePassControls.first().val(_gtxt('ProfilePlugin.getNew'));
                        changePass_timeout = setTimeout(function () {
                            state.fadeOut("slow", function () {
                                $(this).text(_gtxt('ProfilePlugin.passwordSaved')).removeClass('changed');
                            }).fadeIn("slow");
                        }, 2000);
                    }
                    else
                        changePassForm.trigger('onerror', response.Result.Message);
                });
            });

            changePassControls.first().click(function () {
                if (changePassForm.is(':visible')) {
                    changePassForm.slideUp("fast");
                    $(this).val(_gtxt('ProfilePlugin.getNew'));
                } else {
                    changePassForm.slideDown("fast");
                    $(this).val(_gtxt('ProfilePlugin.cancelNew'));
                    changePassForm.trigger('onrender');
                }
            });

            // API-keys dialogs
            var closeApiKeyDialog = function () {
                var akd = $('.apiKeyDialog');
                if (akd.length > 0) {
                    // akd.find('.licence').mCustomScrollbar("destroy");
                    // akd.find('.list').mCustomScrollbar("destroy");
                    removeDialog($('.apiKeyDialog').parent()[0]);
                }
            },
            showApiKeyDialog = function (dtype) {
                //if ($('.apiKeyDialog').length > 0) {
                //  return;
                //}

                closeApiKeyDialog();
                clearPageErrors($('.page:visible'));

                if (dtype == 'List') {
                    let startW = 556, startH = 340,
                        akDialog = $('<div class="apiKeyDialog"></div>'),
                        wait = $('<div style="position:absolute; top:120px; left:270px"><img src="img/progress.gif"></div>');
                    akDialog.append(wait);
                    window.showDialog(_gtxt('ProfilePlugin.apiKey' + dtype + 'Cap'), akDialog[0], startW, startH)
                    .style.overflow = 'hidden';

                    akDialog.parent().on("dialogresizestart", function () {
                        //startW = ui.size.width;
                        //startH = ui.size.height;
                    })
                    .on("dialogresize", function (event, ui) {
                        var list = akDialog.find('.list');
                        list.height(list.height() + ui.size.height - startH);
                        //startW = ui.size.width;
                        startH = ui.size.height;
                    });
                    sendCrossDomainJSONRequest(mykosmosnimki + "/handler/apikeys?wrapstyle=func", function (response) {
                         if (parseResponse(response) || response.Status == 'OK') {
                             wait.remove();
                             if (response.Result && response.Result.length > 0) {
                                var list = $('<div class="list"></div>'),
								apiKeyActivation = function(){
									var checkboxes = $('input[type="checkbox"]', list)
									.click(function(){
										checkboxes.prop('disabled', true);
										var progress = $('<span>&nbsp;</span><img src="img/progress.gif">')
										var checkbox = $(this);
										checkbox.parent().append(progress)									
										sendCrossDomainPostRequest(mykosmosnimki + "/Handler/ActivateKey", { 
											WrapStyle: 'message',
											Apikey: checkbox.val()
										},
										function (apiKeyResp) {
											checkboxes.prop('disabled', false);
											progress.remove();
											if (apiKeyResp.Status.toLowerCase() == 'ok') {
												for (var i = 0; i < response.Result.length; ++i)
													if (response.Result[i].Apikey==apiKeyResp.Result.Apikey){
														response.Result[i].IsActive = apiKeyResp.Result.IsActive;
														break;
													}
											}
											else {
												console.log(response);												
											}
												
										})
									})
								},
                                createTbl = function (filter) {
                                    var tbl = '<div><table border=0>';
                                    var re = new RegExp(filter, 'i');
                                    for (var i = 0; i < response.Result.length; ++i)
                                        if (filter == null || filter.search(/\S/) < 0 || response.Result[i].Apikey.search(re) != -1 || (response.Result[i].Domain != 'Direct' && response.Result[i].Domain.search(re) != -1))
                                            tbl += '<tr><td>' + response.Result[i].Apikey + '</td><td style="word-break:break-all">' + (response.Result[i].AllowDirect ? _gtxt('ProfilePlugin.apiKeyDirectShort') : response.Result[i].Domain) +
                                            //'</td><td>' + (response.Result[i].IsActive ? '<i class="icon-check">' : '') +
											'</td><td>' + '<input type="checkbox" '+(response.Result[i].IsActive ? 'checked' : '') + ' value="' + response.Result[i].Apikey + '">' +
                                            '</td><td>' + response.Result[i].Created + '</td></tr>';
                                    tbl += '</table></div>';
                                    return tbl;
                                };
                                 var filter = $('<div style="padding-left:6px">' + _gtxt('ProfilePlugin.apiKeyFilterApply') + ': <input type="text" placeholder="' + _gtxt('ProfilePlugin.apiKeyFilter') + '"></div>').appendTo(akDialog);
                                 filter.find('input[type="text"]').keyup(function () {
                                     list.find('table').parent().remove();
                                     list.mCustomScrollbar('destroy')
                                     .append(createTbl($(this).val())).mCustomScrollbar();
									 apiKeyActivation();
                                     keys = list.find('table');
                                     resize(akDialog.parent().dialog("option", "width") - startW);
                                 });
                                 list.appendTo(akDialog)
                                .append($(createTbl()))
                                .mCustomScrollbar();
								apiKeyActivation();
								
                                var header = list.before($(Handlebars.compile('<table border=0><tr><th>ключ</th><th>тип/сайт</th><th>активен</th><th>{{i "ProfilePlugin.apiKeyCreated"}}</th></tr></table>')())).prev(),
                                keys = list.find('table'),
                                resize = function (dif) {
                                    var th = header.find('tr th')
                                    var td = keys.find('tr:eq(0) td');
                                    header.width(keys.width(514 + dif).width());
                                    th.eq(0).width(td.eq(0).width(90).width());
                                    th.eq(2).width(td.eq(2).width(70).width());
                                    th.eq(3).width(td.eq(3).width(90).width());
                                    th.eq(1).width(td.eq(1).width());
                                };
                                 akDialog.parent().on("dialogresize", function (event, ui) {
                                     resize(ui.size.width - startW);
                                 });
                                 resize(0);
                             }
                         }
                         else {
                             removeDialog(akDialog.parent()[0]);
                         }
                     });
                }
                else {
                    var fordirect = dtype == 'Direct' ?
                    '<div>{{{i "ProfilePlugin.directKeyPurpose1"}}}</div>' +
                    '<div>{{i "ProfilePlugin.directKeyPurpose2"}}</div>'
                    : '';
                    var fordomain = dtype == 'Domain' ?
                    '<div>{{i "ProfilePlugin.apiKeySite"}}<input type="text" tabindex="2" class="ApiKeySite ApiKeySiteEmpty ApiKeySiteInvalid" value="http://"></div>'
                    : '';
                    var akForm = $(Handlebars.compile('<div class="apiKeyDialog">' +
                    '<div class="first">' +
                    '<div>{{i "ProfilePlugin.apiKeyReadAgreement"}}<span class="showLicence hyperLink">{{i "ProfilePlugin.apiKeyConditions"}}</span></div>' +
                    '<div><div style="float:left;margin:0"><input type="checkbox" tabindex="1" id="agree" class="agree"></div><div style="padding-left:10px"><label for="agree">{{i "ProfilePlugin.apiKeyAgreement"}} {{i "ProfilePlugin.apiKeyConditions"}}</div></div>' +
                    fordomain +
                    fordirect +
                    '<div class="spacer"></div>' +
                    '<div class="ErrorSummary"><span class="fail"></span><span class="success"></span><img class="wait" src="img/progress.gif"></div>' +
                    '<div class="submit"><input tabindex="3" type="button" class="get" title="{{i "ProfilePlugin.apiKeyUrge"}}" value="{{i "ProfilePlugin.apiKeyGet"}}"/></div>' +
                    '</div>' +
                    '<div class="licence"></div>' +
                    '<div class="submit"><input tabindex="1" type="button" class="accept" value="{{i "ProfilePlugin.apiKeyAccept"}}"/><input tabindex="2" type="button" class="cancel" value="{{i "ProfilePlugin.apiKeyCancel"}}"/></div>' +
                    '</div>')());

                    let licence = akForm.find('.licence'),
                        spacer = akForm.find('.spacer'),
                        startH;
                    licence.hide().next().hide();
                    if (dtype == 'Domain')
                        spacer.height('20px');

                    let summary = akForm.find('.ErrorSummary'),
                        wait = summary.children('.wait'),
                        site = akForm.find('.ApiKeySite'),
                        agree = akForm.find('.agree'),
                        getKey = akForm.find('.get').css('opacity', 0.5)
                        .click(function () {
                            var respHandler = function (response) {
                                wait.css('visibility', 'hidden');
                                if (response.Status.toLowerCase() == 'ok' && response.Result) {
                                    summary.children('span.success').text(_gtxt('ProfilePlugin.apiKeyReceive') + ' ' + response.Result.Key);
                                }
                                else {
                                    summary.children('span.fail').text(_gtxt('ProfilePlugin.Error' + response.Result.Message));
                                    akForm.find('.' + response.Result.Message).addClass('error')
                                }
                            };
                            clearError();
                            wait.css('visibility', 'visible');
                            if (site.length)
                                sendCrossDomainPostRequest(mykosmosnimki
                            + "/Handler/CreateKey", { WrapStyle: 'message', domain: site.val(), agree: agree.is(':checked') }
                            , respHandler);
                            else
                                sendCrossDomainPostRequest(mykosmosnimki
                            + "/Handler/CreateDirect", { WrapStyle: 'message', agree: agree.is(':checked') }
                            , respHandler);
                        });
                    getKey.prop('disabled', true);
                    site.prop('disabled', true).keydown(function (e) {
                        if ($(this).is('.error')) clearError();
                        if (e.which == 13)
                            getKey.click();
                    });
                    var clearError = function () {
                        summary.children('span').text('');
                        site.removeClass('error');
                    };
                    akForm.find('.showLicence').click(function () {
                        clearError();
                        licence.show().prev().hide();
                        licence.next().show();
                        if (licence.text() == '')
                            licence.load(gmxCore.getModulePath('ProfilePlugin') + 'license.html', function () { licence.mCustomScrollbar() });
                    });
                    licence.next('div').children('input').click(function () {
                        licence.next().hide();
                        licence.hide().prev().show();
                    })
                    .first().click(function () {
                        agree[0].checked = true;
                        agree.change();
                    })
                    .next('.cancel').click(function () {
                        agree[0].checked = false;
                        agree.change();
                    });
                    agree.change(function () {
                        getKey.prop('disabled', !agree.is(':checked'));
                        site.prop('disabled', !agree.is(':checked'));

                        if (agree.is(':checked')) {
                            getKey.css('opacity', 1)
                            .focus()
                            .attr('title', _gtxt('ProfilePlugin.apiKeyGet'));
                        }
                        else {
                            getKey.css('opacity', 0.5)
                            .attr('title', _gtxt('ProfilePlugin.apiKeyUrge'));
                        }
                    });

                    window.showDialog(_gtxt('ProfilePlugin.apiKey' + dtype + 'Cap'), akForm[0], 555, 320);
                    akForm.parent('.ui-dialog-content').css('overflow', 'hidden');
                    akForm.parent().on("dialogresizestart", function (event, ui) { startH = ui.size.height; })
                    .on("dialogresize", function (event, ui) {
                        licence.height(licence.height() + ui.size.height - startH);
                        spacer.height(spacer.height() + ui.size.height - startH);
                        startH = ui.size.height;
                    });
                }
            };
            page3.find('.apiKeyDomain').click(function () { showApiKeyDialog('Domain'); });
            page3.find('.apiKeyDirect').click(function () { showApiKeyDialog('Direct'); });
            page3.find('.apiKeyList').click(function () { showApiKeyDialog('List'); });

            ppPages.find('input[type="text"], input[type="password"]').keyup(function (e) {
                if (e.which == 13) {
                    var submit = $(this).siblings('div.SubmitBlock').children('input[type="button"]');
                    if (!submit.length)
                        submit = $(this).parent().siblings('div.SubmitBlock').children('input[type="button"]');
                    submit.click();
                }
                else
                    clearInputErrors($(this));
            })
            .focusin(function () {
                closeApiKeyDialog();
                clearInputErrors($(this));
            });

            // Error display
            var clearInputErrors = function (input) {
                if (input.val().search(/\S/) != -1 && input.is('.error')) {
                    var es = input.nextAll('.ErrorSummary');
                    if (es.length == 0)
                        es = input.parent().nextAll('.ErrorSummary');
                    if (input.is('.NotMatch')) {
                        var s = input.siblings('.NotMatch');
                        if (s.val() === input.val()) {
                            input.removeClass('error');
                            s.removeClass('error');
                            es.slideUp(); //.hide();
                        }
                    }
                    else {
                        input.removeClass('error').addClass('correct');
                        es.slideUp(); //.hide();
                    }
                }
            }
            var clearPageErrors = function (page) {
                page.find('.ErrorSummary').hide();
                page.find('.error').removeClass('error');
            }
            changePassForm.bind('onerror', function (e, m) {
                $(this).children('.ErrorSummary').text(_gtxt('ProfilePlugin.Error' + m)).slideDown('slow');
                $(this).find('.' + m).addClass('error');
                $(this).find(':password,:text').filter(function () { return $(this).val() == ""; }).addClass('error');
                return false;
            });
            changePassForm.bind('onrender', function () {
                $(this).children('input[type="password"]').val('');
                clearPageErrors($(this));
                clearPageErrors(page1);
                return false;
            });
            ppPages.bind('onerror', function (e, m1, m2) {
                var m = _gtxt('ProfilePlugin.Error' + m1);
                if (m2)
                    m += " " + m2;
                $(this).children('.ErrorSummary').text(m).slideDown('slow');
                $(this).find('.' + m1).removeClass('correct').addClass('error');
                return false;
            })
            ppPages.bind('onrender', function () {
                clearPageErrors($(this));
                changePassForm.hide();
                changePassControls.first().val(_gtxt('ProfilePlugin.getNew'));
                return false;
            });

            ppPages.first().show();
            ppScrollableContainer.hide().appendTo('#all').append(ppFrame);

            // Menu
            var menuEntryTemplate = '<div class="MenuEntry">{{text}}</div>';
            var showPage = function (e, page) {

                closeApiKeyDialog();

                ppMenu.children('.MenuEntry').removeClass('selected');
                ppPages.hide();
                page.show();
                $(e.target).removeClass('targeted').addClass('selected');
                page.trigger('onrender');
            };
            $(Handlebars.compile(menuEntryTemplate)({ text: _gtxt('ProfilePlugin.profile') })).appendTo(ppMenu).click(function (e) { showPage(e, page1); });
            $(Handlebars.compile(menuEntryTemplate)({ text: _gtxt('ProfilePlugin.billing') })).appendTo(ppMenu).click(function (e) { showPage(e, page2); });
            $(Handlebars.compile(menuEntryTemplate)({ text: _gtxt('ProfilePlugin.developer') })).appendTo(ppMenu).click(function (e) { showPage(e, page3); });

            //wait.appendTo(ppMenu).hide();
            success.appendTo(ppMenu).hide();
            fail.appendTo(ppMenu).hide();
            ppMenu.hide().appendTo('#all');
            var ppMenuEntries = ppMenu.children('.MenuEntry');
            ppMenuEntries.first().addClass('selected');
            ppMenuEntries.mouseover(function (e) { if (!$(e.target).is('.selected')) $(e.target).addClass('targeted') });
            ppMenuEntries.mouseout(function (e) { if (!$(e.target).is('.selected')) $(e.target).removeClass('targeted') });

            // All together
            ppMainParts = $([ppScrollableContainer, ppMenu]).map(function () { return this[0]; });
            ppMainParts.data('ondataload', function () {
                if (ppBackScreen.is(':visible')) {
                    ppPages.trigger('onrender');
                    ppMainParts.show();
                }
            });
            $('body>div>div').mousedown(function (e) {
                if (!ppMainParts.is($(e.target)) && !ppMainParts.find($(e.target)).length) {
                    ppBackScreen.hide();
                    ppMainParts.hide();
                    closeApiKeyDialog();
                    if (!nsGmx.leafletMap.gmxControlsManager.get('layers')) {
                        nsGmx.leafletMap.addControl(overlays);
                    }
                }
            });
            ppScrollableContainer.mCustomScrollbar();
            $(window).resize(resizePanel);
        }

        // Show
        var overlays = nsGmx.leafletMap.gmxControlsManager.get('layers');
        ppBackScreen.show();
        fillProfile(ppMainParts.data('ondataload'), function () { ppBackScreen.hide(); });
        resizePanel();
    };

    var fillProfile = function (onsuccess, onerror) {
        sendCrossDomainJSONRequest(mykosmosnimki + "/currentuser.ashx", function (response) {
            if (parseResponse(response) && response.Result) {
                var content = $('.profilePanel-content');
                content.find('.Email').text(response.Result[0].Email);
                content.find('.PasswordState').text(_gtxt('ProfilePlugin.passwordSaved'));
                content.find('.Login').val(response.Result[0].Login);
                content.find('.FullName').val(response.Result[0].FullName);
                content.find('.Phone').val(response.Result[0].Phone);
                content.find('.Company').val(response.Result[0].Company);
                content.find('.CompanyProfile').val(response.Result[0].CompanyProfile);
                content.find('.CompanyPosition').val(response.Result[0].CompanyPosition);
                content.find('.Subscribe').prop('checked', response.Result[0].Subscribe);
                content.find('.IsCompany').prop('checked', response.Result[0].IsCompany);
                fillBillingPage(content, response);
                fillDeveloperPage(content, response);
                onsuccess();
            }
            else {
                onerror();
            }
        });
    };

    var fillBillingPage = function (content, response) {
        content.find('.FileStorageUsed').text((response.Result[0].FileStorageUsed / 1000000).toFixed(2) + _gtxt('ProfilePlugin.megabyte'));
        content.find('.FileStorageRemain').text(response.Result[0].FileStorageAvailable == null ? '' : ((response.Result[0].FileStorageAvailable - response.Result[0].FileStorageUsed) / 1000000).toFixed(2) + _gtxt('ProfilePlugin.megabyte'));
        content.find('.VectorLayerStorageUsed').text((response.Result[0].VectorLayerStorageUsed / 1000000).toFixed(2) + _gtxt('ProfilePlugin.megabyte'));
        content.find('.VectorLayerStorageRemain').text(response.Result[0].VectorLayerStorageAvailable == null ? '' : ((response.Result[0].VectorLayerStorageAvailable - response.Result[0].VectorLayerStorageUsed) / 1000000).toFixed(2) + _gtxt('ProfilePlugin.megabyte'));
        content.find('.VectorLayers').text(response.Result[0].VectorLayers);
        content.find('.VectorLayerObjects').text(response.Result[0].VectorLayerObjects);

        content.find('.SmsAvailable').text(response.Result[0].SmsAvailable == null || response.Result[0].SmsAvailable > 0 ? _gtxt('ProfilePlugin.yes') : _gtxt('ProfilePlugin.no'));
        content.find('.SubscriptionUsed').text(response.Result[0].SubscriptionUsed != null ? response.Result[0].SubscriptionUsed : '');
        content.find('.SubscriptionRemain').text(response.Result[0].SubscriptionRemain != null ? response.Result[0].SubscriptionRemain : '');
    }

    var fillDeveloperPage = function (content, response) {
        content.find('.AppName').val(response.Result[0].AppName);
        content.find('.ClientID').text(response.Result[0].ID);
        content.find('.ClientSecret').text(response.Result[0].ClientSecret);
        content.find('.RedirectUri').val(response.Result[0].RedirectUri);
    }

    var resizePanel = function () {
        var h = $('#leftMenu').css('height');
        $('.profilePanel, .profilePanel-scrollable, .profilePanel-menu').height(h);
    }

    // RegistrationForm
    var showRegistrationForm = function () {
        var registrationForm = $(Handlebars.compile(
        '<table style="width:100%;height:100%;" border="0"><tr><td>\
        <form>\
            <table class="registrationForm" border="0">\
            <tr><td colspan="2" class="header">{{i "ProfilePlugin.registrationPageAnnotation"}}</td></tr>\
			<tr><td colspan="2">\
			<table border="0"><tr>\
			<td>{{i "ProfilePlugin.firstName"}}</td><td align="right"><input type="text" tabindex="1" class="FirstName" id="RegFirstName" name="RegFirstName"/></td>\
			<td class="LastNameLbl">{{i "ProfilePlugin.lastName"}}</td><td align="right"><input type="text" tabindex="1" class="LastName" id="RegLastName" name="RegLastName"/></td>\
			</tr></table>\
			</td></tr>\
            <tr><td colspan="2"><table border="0"><tr><td>{{i "ProfilePlugin.email"}}</td><td align="right"><input type="text" tabindex="1" class="Login EmailEmpty WrongEmail EmailExists" id="RegEmail" name="RegEmail"/></td></tr></table></td></tr>\
            <tr>\
                <td>\
                    <table border="0"><tr><td>{{i "ProfilePlugin.password"}}</td><td align="right"><input tabindex="2" type="password" class="Password NewPassword NotMatch"/></td></tr></table>\
                </td>\
                <td>\
                    <table border="0"><tr><td>{{i "ProfilePlugin.repeat"}}</td><td align="right"><input type="password" tabindex="3" class="Repeat NotMatch"/></td></tr></table>\
                </td>\
            </tr>\
            <tr>\
                <td>\
                    <table border="0"><tr><td>{{i "ProfilePlugin.login"}}</td><td align="right"><input type="text" tabindex="4" class="NickName LoginEmpty LoginFormat LoginExists" id="RegNick" name="RegNick"/></td></tr></table>\
                </td>\
                <td>\
                    <table border="0"><tr><td>{{i "ProfilePlugin.capcha"}}</td><td align="right"><input type="text" tabindex="5" class="Capcha CapchaRequired WrongCapcha"/></td><td align="right">' +
                    '<img src="' + mykosmosnimki + '/Account/Captcha?r=' + Math.round(Math.random() * Math.pow(10, 9)) + '">' +
                    '</td></tr></table>\
            </tr>\
            <tr><td colspan="2" class="submit">\
                <div class="ErrorSummary"></div>\
                <div class="SubmitBlock">\
                <input tabindex="6" type="button" value="{{i "ProfilePlugin.register"}}"/>\
                <img src="img/progress.gif"></div>\
            </td></tr>\
            <tr><td colspan="2">\
            <div class="policy">\
            Нажимая на кнопку, вы соглашаетесь с <a target="blank" href="//my.kosmosnimki.ru/Docs/Политика конфиденциальности.pdf">политикой конфиденциальности</a>\
            и <a target="blank" href="//my.kosmosnimki.ru/Docs/Политика оператора в отношении обработки и защиты персональных данных.pdf">политикой оператора</a> в отношении обработки и защиты персональных данных\
            </td></tr>\
            </table>\
        </form>\
        </td></tr></table>'
        )()),
            confirmScreen = $(Handlebars.compile('<div class="registrationConfirm"><div></div><div><input type="button" value="{{i "ProfilePlugin.close"}}"/></div></div>')()),
            errorSummaryHeight,
        submit = registrationForm.find('input[type="button"]').click(function () {
            var errorSummary = registrationForm.find('.ErrorSummary'),
            wait = submit.next('img').css('visibility', 'visible');
            registrationForm.find('form').submit();

            _mapHelper.createPermalink(function (id) {
                sendCrossDomainPostRequest(mykosmosnimki + "/Handler/RegistrationExt", { WrapStyle: 'message',
					firstName: registrationForm.find('.FirstName').val(),
					lastName: registrationForm.find('.LastName').val(),
                    email: registrationForm.find('.Login').val(),
                    login: registrationForm.find('.NickName').val(),
                    password: registrationForm.find('.Password').val(),
                    repeat: registrationForm.find('.Repeat').val(),
                    captcha: registrationForm.find('.Capcha').val(),
                    permalink: "http://" + window.location.host + window.location.pathname + "?permalink=" + id + (window.defaultMapID == window.globalMapName ? "" : ("&" + window.globalMapName))
                },
                function (response) {

                    registrationForm.find('.Capcha').val("");
                    registrationForm.find('input[type="button"]').focus();
                    wait.css('visibility', 'hidden');

                    if (response.Status.toLowerCase() == 'ok' && response.Result) {
                        //afterRegistration();
                        regFormDialog.style.height = errorSummaryHeight;
                        registrationForm.fadeOut("slow", function () {
                            $(this).replaceWith(confirmScreen); //.fadeIn("slow");
                        });
                        confirmScreen.children('div').first().text(response.Result.Message);
                        confirmScreen.find('input').click(function () { removeDialog(regFormDialog); });
                    }
                    else {
                        registrationForm.find('.error').removeClass('error');
                        errorSummary.text('');
                        registrationForm.find(':password,:text').filter(function () { return $(this).val() == ""; }).addClass('error');
                        if (response.Result.length > 0 && response.Result[0].Key) {
                            errorSummaryHeight = errorSummary.text(
                            _gtxt('ProfilePlugin.Error' + response.Result[0].Key) + " " + response.Result[0].Value.Errors[0].ErrorMessage).height();
                            registrationForm.find('.' + response.Result[0].Key).addClass('error');
                        }
                        else {
                            errorSummaryHeight = errorSummary.text(_gtxt('ProfilePlugin.Error' + response.Result.Message)).height();
                            registrationForm.find('.' + response.Result.Message).addClass('error');
                        }
                        errorSummary.slideDown();
                        registrationForm.find('img').first().attr("src", mykosmosnimki + '/Account/Captcha/sort?r=' + Math.round(Math.random() * Math.pow(10, 9)));
                    }
                })
            });
        });

        registrationForm.find('form').submit(function (e) {
            e.preventDefault();
        });

        var regFormDialog = window.showDialog(_gtxt('ProfilePlugin.registration'), registrationForm[0], 560, 272);
        $(regFormDialog).dialog('option', 'resizable', false);
        regFormDialog.style.overflow = 'hidden';
        errorSummaryHeight = regFormDialog.style.height;
        regFormDialog.style.height = '';

        var clearError = function () {
            registrationForm.find('.error').removeClass('error');
            registrationForm.find('.ErrorSummary').text('').slideUp();
        };

        registrationForm.find('input[type="text"], input[type="password"]')
        .keydown(function (e) {
            if (e.which == 13)
                submit.click();
        })
        .focusin(clearError);

        return regFormDialog;
    };

    // var SubmitBlock = function (form, onsuccess, onerror) {
    //     this.submit = function () { }
    // };

    var checkExist;

    gmxCore.addModule('ProfilePlugin', {
        pluginName: 'ProfilePlugin',
        showProfile: showProfile,
        showRegistrationForm: showRegistrationForm,
        afterViewer: function () {
            checkExist = setInterval(function () {
                if (nsGmx.widgets.authWidget && nsGmx.widgets.authWidget.getUserInfo() != null) {
                    if (nsGmx.widgets.authWidget.getUserInfo().Login != null) {
                        var a = $('a:contains("' + nsGmx.Translations.getText('auth.myAccount') + '")');
                        a.attr({ 'class': 'dropdownMenuWidget-dropdownItemAnchor' });
                        a.siblings('div').remove();
                        a.attr('href', 'javascript:void(0)');
                        a.removeAttr('target');
                        a.click(function (event) {
                            showProfile();
                            event.stopPropagation();
                        });
                    }
                    else {
                        var showLoginDialog = nsGmx.widgets.authWidget._authManager.login,
                        regForm;
                        nsGmx.widgets.authWidget._authManager.login = function () {
                            if (regForm && $(regForm).is(':visible')) {
                                removeDialog(regForm);
                                regForm = false;
                            }
                            showLoginDialog();
                            var regLink = $(':ui-dialog .registration');
                            regLink.off("click").click(function () {
                                regLink.parents(':ui-dialog').dialog("close");
                                regForm = showRegistrationForm(function () {
                                    window.location.reload();
                                });
                            });
                        };
                    }
                    clearInterval(checkExist);
                }
            }, 100);
        }
    },
    {
        // css: 'ProfilePlugin.css',
        init: function () {
            initTranslations();
        }
    });
})(jQuery)

