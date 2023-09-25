const script = document.createElement('script'); 
document.head.appendChild(script);    
script.type = 'text/javascript';
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js";

const style = document.createElement('link');
document.head.appendChild(style);
style.rel = 'stylesheet';
style.href = 'https://notifyhub.github.io/style.css';
style.type = 'text/css';


script.onload = function(){
	
	const axiosLoad = document.createElement('script');
	document.head.appendChild(axiosLoad);
	axiosLoad.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';

	jQuery(document).ready(function($) {
		const formElement = $(
			`
			<div class="whatsapp-form-notifyhub" style="display: none;">
			<div class="whatsatpp-box_notifyhub">
			<div class="header-notifyhub">
			<span class="title">Fale agora pelo Whatsapp</span>
			</div>

			<div class="body-notifyhub">
			<div class="text-body-notifyhub">
			<p>Insira as informações para iniciar uma conversa</p>
			</div>

			<div class="form-notifyhub">
			<form id="notifyhub-form-handler">
			<div id="form_hidden_fields_notifyhub">
			<input type="hidden" id="url_paramns_nh_get_utm">
			</div>

			<div class="wrapper-field-nh">
			<input type="text" class="show" id="name_notifyhub" placeholder="Seu nome">
			<input type="text" id="email_notifyhub" placeholder="Seu email">
			<input type="text" id="phone_notifyhub" data-js="phoneInput" placeholder="Seu telefone">
			</div>					

			<button class="btn-fom-nh" id="btn_send_nh_form">
			<img src="https://notifyhub.github.io/img/button-whatsapp-notifyhub.png" alt="">
			</button>
			</form>

			<span id="error_text_form"></span>
			<span id="loading_notifyhub_end_send">
			<img src="https://notifyhub.github.io/img/loading-notifyhub.gif" alt="">
			</span>

			<div class="warn-policies">
			<img src="https://notifyhub.github.io/img/info-notifyhub.png" alt="NotifuHub | Termos e Políticas">
			<p>Ao clicar em enviar você concorda com nossos <a href="">termos e política de privacidade.</a> </p>
			</div>	

			</div>

			</div>

			</div>

			<div class="button-whatsapp">
			<button class="btn-whatsapp-notifyhub" id="btnWhatsappNotifyHub">
			<img src="https://notifyhub.github.io/img/notifyhub.-whatsapp-icon.png" alt="">
			</button>
			</div>
			</div>
			`)

		$('body').append(formElement);

		$(window).on('load', function() {
			setTimeout(() => {
				$('.whatsapp-form-notifyhub').fadeIn('slow/400/fast');
			}, 1000)
		});


		$("#btnWhatsappNotifyHub").on('click', function() {
			$('.whatsatpp-box_notifyhub').toggleClass('show');
		});

		const urlParamsUtm = document.location;
		const _utmUrl = $('#url_paramns_nh_get_utm').val(urlParamsUtm);

		const inputPhone = document.querySelector('[data-js="phoneInput"]')
		inputPhone.addEventListener('input', handleInput, false)

		function handleInput (e) {
			e.target.value = phoneMask(e.target.value)
		}

		function phoneMask (phone) {
			return phone.replace(/\D/g, '')
			.replace(/^(\d)/, '($1')
			.replace(/^(\(\d{2})(\d)/, '$1) $2')
			.replace(/(\d{5})(\d{1,5})/, '$1-$2')
			.replace(/(-\d{4})\d+?$/, '$1');
		}

		$( "#notifyhub-form-handler" ).on( "submit", async function( event ) {
			event.preventDefault();

			const errorText = $('#error_text_form');

			let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
			let mailRgx =   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

			const nameInput = $("#name_notifyhub");
			const emailInput = $("#email_notifyhub");
			const phoneInput = $("#phone_notifyhub");
			const warnPolicies = $(".form-notifyhub .warn-policies");

			if(nameInput.val().trim().length <= 0){
				return errorText.text('Nome é obrigatório');
			} else if (specialChars.test(nameInput.val())){
				return errorText.text('Nome possui caracteres inválidos');
			}

			nameInput.removeClass('show');
			emailInput.addClass('show');

			if(!mailRgx.test(emailInput.val())){
				return errorText.text('Adicione um email válido');
			}

			emailInput.removeClass('show');
			phoneInput.addClass('show');
			warnPolicies.addClass('show');

			if(phoneInput.val().trim().length <= 0){
				return errorText.text('Adicione um telefone válido');
			} else if (phoneInput.val().replace(/\D/g, "").length < 11 ){
				return errorText.text('Telefone deve ser 11 números com dígito 9.');
			}

			const _uoid = $("#u_notifyhub_lead").val();
			const _doid = $("#d_notifyhub_l_domain").val();

			const h = $('.body-notifyhub .text-body-notifyhub p');
			const f = $('.form-notifyhub form#notifyhub-form-handler');
			const l = $('#loading_notifyhub_end_send');

			h.text('Iniciando Conversa...')
			h.addClass('loading');
			f.fadeOut('slow/400/fast');
			l.css({ display: 'block' });
			errorText.css({ display: 'none' });

			const data = {
				name: nameInput.val(),
				email: emailInput.val(),
				phone: phoneInput.val(),
				userId: _uoid,
				domainId: _doid,
				utmParams: _utmUrl.val()	
			}

			var whatsappUrl;
			const response = await axios.post('http://localhost:5000/leads', data);

			if(!response.data.whatsapp){
				h.text('Insira as informações para iniciar uma conversa')
				h.removeClass('loading');
				f.fadeIn('slow/400/fast');
				l.css({ display: 'none' });
				errorText.css({ display: 'block' });
				return;
			}

			whatsappUrl = `https://api.whatsapp.com/send/?phone=${response.data.whatsapp.phone.replace(/\D/g, "")}&text=${response.data.whatsapp.message}&type=phone_number&app_absent=0`;

			return location.href = whatsappUrl;
		});

	});
} 