var ArrMenu =[
	{
		nombre: "Consulta Pedimentos",
		url:"inicio"
	},
	{
		nombre: "Consulta Notificaciones",
		url:"notificaciones"
	},
	{
		nombre: "Configuración",
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
					url: "http://enlinea.cae3076.com/Notificaciones/funciones2.php",
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
		//alert('Received Device Ready Event');
        //alert('calling setup push');
		plataforma=device.platform;
        fn.setupPush();
	},
	setupPush: function() {
		//alert(push);
        //alert('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "816833643158"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            	},
            "windows": {}
        });
		
        push.on('registration', function(data) {
		//alert('registration event: ' + data.registrationId);
		if(window.localStorage.getItem("switchNotifica") != null){
			window.localStorage.removeItem("switchNotifica");
		}
		if(window.localStorage.getItem("frecuenciaNotifica") != null){
			window.localStorage.removeItem("frecuenciaNotifica");
		}
		
		window.localStorage.setItem("switchNotifica", $("#switchNotificaciones").val());
		window.localStorage.setItem("frecuenciaNotifica", $("#rango").val());
		
		window.localStorage.setItem("registrationID", data.registrationId);
		
		jQuery.ajax({
			url: 'http://enlinea.cae3076.com/Notificaciones/funciones.php',
			type:'GET',
			data:'datos='+data.registrationId+'||'+plataforma+'||'+window.localStorage.getItem("switchNotifica")+'||'+window.localStorage.getItem("frecuenciaNotifica")+'||'+window.localStorage.getItem("nombreUsuario"),
			dataType:'json',
			success:function(response){
			  if (response.msg=='primera'){
				alert('Se ha guardado su configuración');
				window.localStorage.setItem("configuracion","guardada");
			  }else{
				alert('Se ha actualizado su configuración');
			  }
			},
			error:function(xhr, status){
			  alert(status, 'ERROR');

			}
		  });
        //alert(window.localStorage.getItem("configuracion"));
            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
		//alert("push error = " + e.message);
      	//alert("push error = " + e.message);

        });
		
        push.on('notification', function(data) {
        //alert('notification event');
		alert(data.message);	
    	cordova.plugins.notification.badge.set(0);
            navigator.notification.alert(
                data.message,         					// message
		        fn.accionAlerta(data.message),          // callback
                data.title,           					// title
                'Ok'                   					// buttonName
            );
       });
    },
	accionAlerta : function (message){
		//alert("entre a accionAlerta");
		//alert(message);
	},
	Menu : function()
	{
		var tamArreglo=ArrMenu.length;
		for(var i = 0; i<tamArreglo; i++)
		{
			$("#listaPanel").append('<li><a href="#'+ArrMenu[i].url+'" data-transition="flow" id="0'+ArrMenu[i].url+i+'">'+ArrMenu[i].nombre+'</a></li>');
			$("#listaPanel2").append('<li><a href="#'+ArrMenu[i].url+'" data-transition="flow" id="1'+ArrMenu[i].url+i+'">'+ArrMenu[i].nombre+'</a></li>');
			$("#listaPanel3").append('<li><a href="#'+ArrMenu[i].url+'" data-transition="flow" id="2'+ArrMenu[i].url+i+'">'+ArrMenu[i].nombre+'</a></li>');
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
	},
	
	compruebaSesion: function(){
		if(window.localStorage.getItem("switchNotifica") != null){
			//alert(window.localStorage.getItem("switchNotifica"));
			$("#switchNotificaciones").val(window.localStorage.getItem("switchNotifica"));
		}
		if(window.localStorage.getItem("frecuenciaNotifica") != null){
			//alert(window.localStorage.getItem("frecuenciaNotifica"));
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
	},
	
	consultaPedimento: function(){
	if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
		}else{
		$('#resultado').html("Cargando...");
		var empresa_rfc = window.localStorage.getItem("nombreUsuario");
		var noPedimento= $("#noPedimento").val();
		try{
			if(noPedimento === ""){
				throw new Error("No ha indicado el pedimento");
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
			$('#resultado').html("");
			return;
		}
		
		if(window.localStorage.getItem("aduana")=='puebla')
		{
			var archivoConsulta = 'http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento.php';
		}
		else{
			var archivoConsulta = 'http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento47.php';
		}
		
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		$.ajax({
				type: "GET",
				url: archivoConsulta,
				data: { 
					opcion: 1,
					noPedimento: noPedimento,
					rfc : empresa_rfc
				},
				dataType: "json"
			}).done(function(data, textStatus, jqXHR){
				$('#resultado').html('');
				if(data[0].Archivo=='nada')
				{
					$('#resultado').html('No se encontraron registros');
				}
				else{
					for(var x=0; x<data.length; x++)
					{
						$('#resultado').append('<div id="'+data[x].Archivo+'" onClick="fn.abrePDF('+"'"+data[x].Archivo+"','"+data[x].Ruta+"'"+')">'+data[x].Archivo+'</div></br>');
					}
				}
			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		}
	},
	
	abrePDF : function(archivo,ruta){
		var vector = ruta.split("/");
		var nuevaRuta = vector[5]+"/"+vector[6]+"/"+vector[7]+"/"+vector[8]+"/"+vector[9]+"/"+archivo;
		var UrlFile = 'http://enlinea.cae3076.com/Portal_CAE/'+nuevaRuta;
		var ref = cordova.InAppBrowser.open('https://docs.google.com/viewer?url='+UrlFile+'&embedded=true', '_blank', 'location=yes');
		window.open = cordova.InAppBrowser.open;
	},
	
	consultaFechaPago: function(){
	if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
		}else{
		$('#resultado').html("Cargando...");
		var empresa_rfc = window.localStorage.getItem("nombreUsuario");
		var fechaInicio= $("#fechaInicio").val();
		var operacion= $("#combo").val();
		var fechaFin= $("#fechaFin").val();
		
		
		if(window.localStorage.getItem("aduana")=='puebla')
		{
			var archivoConsulta = 'http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento.php';
		}
		else{
			var archivoConsulta = 'http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento47.php';
		}
		
		
		try{
			if(fechaInicio == ""){
				throw new Error("No ha indicado Fecha Inicio");
			}
			if(fechaFin == ""){
				throw new Error("No ha indicado Fecha Final");
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
			$('#resultado').html("");
		}
		////////////////////////////////////////////////////////////// Envio AJAX //////////////////////////////////////////////////////////////////
		$.ajax({
				type: "GET",
				url: archivoConsulta,
				data: { 
					opcion: 2,
					fechaInicio: fechaInicio,
					fechaFin: fechaFin,
					rfc : empresa_rfc,
					operacion : operacion
				},
				dataType: "json"
			}).done(function(data, textStatus, jqXHR){
				$('#resultado').html('');
				console.log(data);
				if(data[0].Pedimento=='nada')
				{
					$('#resultado').html('No se encontraron registros');
				}
				else
				{
					$('#resultado').html('<div class = "ui-grid-b" id="cuadricula"></div>');
					for(var x=0; x<data.length; x++)
					{	
						console.log(data[x].Pedimento);
						if(((x+1)%3)==1)
						{
							$('#cuadricula').append('<div id="'+data[x].Pedimento+'" class="ui-block-a" onClick="fn.consultaPedimento2('+"'"+data[x].Pedimento+"'"+')">'+data[x].Pedimento+'</div>');
						}
						else
						{
							if(((x+1)%3)==2)
							{
								$('#cuadricula').append('<div id="'+data[x].Pedimento+'" class="ui-block-b" onClick="fn.consultaPedimento2('+"'"+data[x].Pedimento+"'"+')">'+data[x].Pedimento+'</div');
							}
							else
							{
								if(((x+1)%3)==0)
								{
									$('#cuadricula').append('<div id="'+data[x].Pedimento+'" class="ui-block-c" onClick="fn.consultaPedimento2('+"'"+data[x].Pedimento+"'"+')">'+data[x].Pedimento+'</div>');
								}
							}
						}
					}
				}
			}).fail(function(error){
				//alert("Error");
				console.log(error.responseText);
			});
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		}
	},
	
	consultaPedimento2: function(noPedimento){
	if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
		}else{
		console.log(noPedimento);
		var empresa_rfc = window.localStorage.getItem("nombreUsuario");
		
		if(window.localStorage.getItem("aduana")=='puebla')
		{
			var archivoConsulta = 'http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento.php';
		}
		else{
			var archivoConsulta = 'http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento47.php';
		}
		
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		$.ajax({
				type: "GET",
				url: archivoConsulta,
				data: { 
					opcion: 1,
					noPedimento: noPedimento,
					rfc : empresa_rfc
				},
				dataType: "json"
			}).done(function(data, textStatus, jqXHR){
				$('#popup').html('');
				if(data[0].Archivo=='nada')
				{
					$('#popup').html('No se encontraron registros');
				}
				else{
					$('#popup').html('<a href="#" data-rel="back" class="ui-btn ui-icon-delete ui-btn-icon-left"></a><h1><strong>Archivos Disponibles</strong></h1><br>');
					for(var x=0; x<data.length; x++)
					{
						$('#popup').append('<div id="'+data[x].Archivo+'" onClick="fn.abrePDF('+"'"+data[x].Archivo+"','"+data[x].Ruta+"'"+')">'+data[x].Archivo+'</div></br>');
					}
					fn.mostrarPopUp();
				}
			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		}
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	},
	
	mostrarPopUp : function()
	{
		$("#popup").popup("open");
	},
	
	divPorPedimento: function(){
		$('#noPedimento').val('')
		$('#fechaInicio').val('');
		$('#fechaFin').val('');
		$('#resultado').html('');
	},
	
	divPorFechaPago: function(){
		$('#noPedimento').val('')
		$('#fechaInicio').val('');
		$('#fechaFin').val('');
		$('#resultado').html('');
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