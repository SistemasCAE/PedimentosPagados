var ArrMenu =[
	{
		nombre: "Consulta operación",
		url:"inicio"
	},
	{
		nombre: "Buzón Notificaciones",
		url:"notificaciones"
	},
	{
		nombre: "Configuración de Alertas",
		url:"configuracion"
	}
]
var fn = {
	deviceready: function(){
		document.addEventListener("deviceready", fn.init/*this.init*/, false);
	},
	init: function(){
	/*
	 * En esta sección vamos a asociar
	 * todos los eventos del "Click" al HTML
	 */
	  if(window.localStorage.getItem("configuracion") == null){
			window.localStorage.setItem("configuracion","");
	  }
	  
	  fn.Menu();
	  fn.cargaNotificaciones();
	  fn.compruebaSesion();
	  $("#botonAcceder").tap(fn.iniciarSesion);
	  $("#botonGuardaConfig").tap(fn.inicioRegistroCel);
   	  $("#botonConsultarPedimento").tap(fn.consultaPedimento);
	  $("#botonConsultarFecha").tap(fn.consultaFechaPago);
	  $("#linkConsultaNoPedimento").tap(fn.divPorPedimento);
	  $("#linkConsultaFechaPago").tap(fn.divPorFechaPago);
	  $("#cierraSesion").tap(fn.cierraSesion);
	  $("#cierraSesion2").tap(fn.cierraSesion);
	  $("#cierraSesion3").tap(fn.cierraSesion);
	  
	},
	cargaNotificaciones : function(){
		var frecuenciaNotificaciones = window.localStorage.getItem("frecuenciaNotifica");
		if(window.localStorage.getItem("switchNotifica") != null){
			var tiempo = new Date();
			var hora = tiempo.getHours();
			if(hora >= '08' && hora <= '23')
			{
				var idDispositivo = window.localStorage.getItem("registrationID");
				////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
				$.ajax({
					type: "GET",
					url: "http://enlinea.cae3076.com/AppConsultaPedimentos/Notificaciones/funciones2.php",
					data: { 
						datos : idDispositivo
					},
					dataType: "json"
				}).done(function(data, textStatus, jqXHR){
					for(var x=0; x<data.length; x++)
					{
						$('#contenidoNotificaciones').append('<li><a href="#" data-role="button" data-icon="alert" data-theme="a">'+data[x].Mensaje+'</a></li>');
					}
				}).fail(function(error){

				});
				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			}
			else{
			}
		}
	},
	inicioRegistroCel : function(){
		plataforma=device.platform;
        fn.setupPush();
		$('#popup1').html('<center><img src="img/loading3.png" alt="" width="150"></center>');
		$("#popup1").popup("open");
	},
	setupPush: function() {
        var push = PushNotification.init({
            "android": {
                "senderID": "816833643158",
				"sound": true,
                "vibration": true,
                "badge": false
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": false
            	},
            "windows": {}
        });
		
        push.on('registration', function(data) {
		
		window.localStorage.setItem("switchNotifica", $("#switchNotificaciones").val());
		window.localStorage.setItem("frecuenciaNotifica", $("#rango").val());
		window.localStorage.setItem("registrationID", data.registrationId);
		
		jQuery.ajax({
			url: 'http://enlinea.cae3076.com/AppConsultaPedimentos/Notificaciones/funciones.php',
			type:'GET',
			data:'datos='+data.registrationId+'||'+plataforma+'||'+window.localStorage.getItem("switchNotifica")+'||'+window.localStorage.getItem("frecuenciaNotifica")+'||'+window.localStorage.getItem("nombreUsuario")+'||'+window.localStorage.getItem("aduana"),
			dataType:'json',
			success:function(response){
			  if (response.msg=='primera'){
				alert('Se ha guardado su configuración');
				window.localStorage.setItem("configuracion","guardada");
				$('#popup1').html('');
				$("#popup1").popup("close");
			  }else{
				alert('Se ha actualizado su configuración');
				$('#popup1').html('');
				$("#popup1").popup("close");
			  }
			},
			error:function(xhr, status){
			  alert(status, 'ERROR');

			}
		  });
		 
            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {

        });
		
        push.on('notification', function(data) {
    	cordova.plugins.notification.badge.set(0);
            navigator.notification.alert(
                data.message,         					// message
		        "null",          						// callback
                data.title,           					// title
                'Ok'                   					// buttonName
            );
       });
    },
	Menu : function()
	{
		var tamArreglo=ArrMenu.length;
		for(var i = 0; i<tamArreglo; i++)
		{
			$("#listaPanel").append('<li><a href="#'+ArrMenu[i].url+'" data-transition="flow" id="0'+ArrMenu[i].url+i+'" data-icon="home">'+ArrMenu[i].nombre+'</a></li>');
			$("#listaPanel2").append('<li><a href="#'+ArrMenu[i].url+'" data-transition="flow" id="1'+ArrMenu[i].url+i+'" data-icon="mail">'+ArrMenu[i].nombre+'</a></li>');
			$("#listaPanel3").append('<li><a href="#'+ArrMenu[i].url+'" data-transition="flow" id="2'+ArrMenu[i].url+i+'" data-icon="gear">'+ArrMenu[i].nombre+'</a></li>');
		}
	},
	iniciarSesion: function(){
		var usuario = $("#usuario").val();
		var password = $("#password").val();
		try{
			if(usuario === ""){
				throw new Error("No ha indicado el usuario");
				return;
			}
			if(password === ""){
				throw new Error("No ha indicado la contraseña");
				return;
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
			console.log(error);
			return;
		}		
		var aduana = $("#aduana").val();
		if(aduana=='puebla')
		{
			$("#aduanaNp").text('Aduana: Puebla');
			$("#aduanaFp").text('Aduana: Puebla');
			window.localStorage.setItem("aduana", aduana);
			fn.enviaSesion("compruebaSesion.php",usuario,password);
		}
		else
		{
			$("#aduanaNp").text('Aduana: AICM');
			$("#aduanaFp").text('Aduana: AICM');
			window.localStorage.setItem("aduana", aduana);
			fn.enviaSesion("compruebaSesion47.php",usuario,password)
		}
	},
	enviaSesion: function(archivoSesion,usuario,password){
		if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
		}else{
			$.ajax({
				method: "POST",
				url: "http://enlinea.cae3076.com/AppConsultaPedimentos/"+archivoSesion,
				data: { 
					usu: usuario,
					pass: password
				}
			}).done(function(mensaje){
				if(mensaje != "0"){
					window.localStorage.setItem("nombreUsuario", usuario);
					window.location.href="#inicio";
				}else{
					window.plugins.toast.show("Usuario/Contraseña invalido(s)", 'long', 'center');
				}
			}).fail(function(error){
				alert("hubo error");
			});
		}
	},
	
	cierraSesion: function(){
		
		////////////////////////////////////////////////////////////////////	AJAX	//////////////////////////////////////////////////////////////////////////
		var idDispositivo = window.localStorage.getItem("registrationID");
		var rfc_sesion = window.localStorage.getItem("nombreUsuario");
		if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
		}else{
			$.ajax({
				method: "POST",
				url: "http://enlinea.cae3076.com/AppConsultaPedimentos/cierraSesion.php",
				data: { 
					id: idDispositivo,
					rfc: rfc_sesion
				}
			}).done(function(mensaje){
				if(mensaje != "0"){
					window.localStorage.removeItem("nombreUsuario");
					window.localStorage.removeItem("aduana");
					window.localStorage.removeItem("switchNotifica");
					window.localStorage.removeItem("frecuenciaNotifica");
					window.localStorage.removeItem("jsonData");
					window.localStorage.removeItem("configuracion");
					window.localStorage.removeItem("registrationID");
					$('#noPedimento').val('')
					$('#fechaInicio').val('');
					$('#fechaFin').val('');
					$('#resultado').html('');
					$("#usuario").val("");
					$("#password").val("");
					window.location.href = "#paginaInicio";
				}else{
					window.plugins.toast.show("", 'long', 'center');
					window.localStorage.removeItem("nombreUsuario");
					window.localStorage.removeItem("aduana");
					window.localStorage.removeItem("switchNotifica");
					window.localStorage.removeItem("frecuenciaNotifica");
					window.localStorage.removeItem("jsonData");
					window.localStorage.removeItem("configuracion");
					window.localStorage.removeItem("registrationID");
					$('#noPedimento').val('')
					$('#fechaInicio').val('');
					$('#fechaFin').val('');
					$('#resultado').html('');
					$("#usuario").val("");
					$("#password").val("");
					window.location.href = "#paginaInicio";
				}
			}).fail(function(error){
				alert("hubo error");
			});
		}
		
		////////////////////////////////////////////////////////////////////	AJAX	//////////////////////////////////////////////////////////////////////////
		
	},
	
	compruebaSesion: function(){
		if(window.localStorage.getItem("switchNotifica") != null){
			$("#switchNotificaciones").val(window.localStorage.getItem("switchNotifica"));
		}
		if(window.localStorage.getItem("frecuenciaNotifica") != null){
			$('#slider').html('');
			var cadena = '<input type="range" data-show-value="true" data-popup-enabled="true" min="1" max="6" value="'+window.localStorage.getItem("frecuenciaNotifica")+'" id="rango">';
			$('#slider').html(cadena);
		}
		
		if(window.localStorage.getItem("nombreUsuario") != null){
			if(window.localStorage.getItem("aduana") != null){
				if(window.localStorage.getItem("aduana")=='puebla')
				{
					$("#aduanaNp").text('Aduana: Puebla');
					$("#aduanaFp").text('Aduana: Puebla');
				}
				else
				{
					$("#aduanaNp").text('Aduana: AICM');
					$("#aduanaFp").text('Aduana: AICM');
				}
				window.location.href="#inicio";
			}
		}
	}
}
/*
 *Llamar al metodo Init en el navegador
 */
//fn.init();

/*
 *Llamar deviceready para compilar
 */
fn.deviceready();