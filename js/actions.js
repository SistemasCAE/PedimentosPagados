var fn = {
	deviceready: function(){
		document.addEventListener("deviceready", fn.init/*this.init*/, false);
	},
	init: function(){
	/*
	 * En esta sección vamos a asociar
	 * todos los eventos del "Click" al HTML
	 */
	  fn.compruebaSesion();
	  $("#botonAcceder").tap(fn.iniciarSesion);
   	  $("#botonConsultarPedimento").tap(fn.consultaPedimento);
	  $("#botonConsultarFecha").tap(fn.consultaFechaPago);
	  $("#linkConsultaNoPedimento").tap(fn.divPorPedimento);
	  $("#linkConsultaFechaPago").tap(fn.divPorFechaPago);
	  $("#cierraSesion").tap(fn.cierraSesion);
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
			fn.enviaSesion("compruebaSesion.php",usuario,password);
		}
		else
		{
			$("#aduanaNp").text('Aduana: AICM');
			$("#aduanaFp").text('Aduana: AICM');
			fn.enviaSesion("compruebaSesion47.php",usuario,password)
		}
	},
	enviaSesion: function(archivoSesion,usuario,password){
	//console.log("http://enlinea.cae3076.com/AppConsultaPedimentos/"+archivoSesion);
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
		$("#usuario").val("");
		$("#password").val("");
		window.location.href = "#paginaInicio";
	},
	
	compruebaSesion: function(){
		if(window.localStorage.getItem("nombreUsuario") != null){
			window.location.href="#inicio";
		}
	},
	
	consultaPedimento: function(){
		$('#resultado').html("Cargando...");
		var noPedimento= $("#noPedimento").val();
		try{
			if(noPedimento === ""){
				throw new Error("No ha indicado el pedimento");
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
			return;
		}
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		$.ajax({
				type: "GET",
				url: "http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento.php",
				data: { 
					opcion: 1,
					noPedimento: noPedimento
				},
				dataType: "json"
			}).done(function(data, textStatus, jqXHR){
				$('#resultado').html('');
				for(var x=0; x<data.length; x++)
				{
					$('#resultado').append('<div id="'+data[x].Archivo+'" onClick="fn.abrePDF('+"'"+data[x].Archivo+"','"+data[x].Ruta+"'"+')">'+data[x].Archivo+'</div></br>');
				}
			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	},
	
	abrePDF : function(archivo,ruta){
		var vector = ruta.split("/");
		var nuevaRuta = vector[5]+"/"+vector[6]+"/"+vector[7]+"/"+vector[8]+"/"+vector[9]+"/"+archivo;
		var UrlFile = 'http://enlinea.cae3076.com/Portal_CAE/'+nuevaRuta;
		var ref = cordova.InAppBrowser.open('https://docs.google.com/viewer?url='+UrlFile+'&embedded=true', '_blank', 'location=yes');
		window.open = cordova.InAppBrowser.open;
	},
	
	consultaFechaPago: function(){
		var fechaInicio= $("#fechaInicio").val();
		var fechaFin= $("#fechaFin").val();
		try{
			if(fechaInicio == ""){
				throw new Error("No ha indicado Fecha Inicio");
			}
			if(fechaFin == ""){
				throw new Error("No ha indicado Fecha Final");
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
		}
		$('#resultado').html('');
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$('#resultado').html('Resultado Consulta Fecha Pago');
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
fn.init();

/*
 *Llamar deviceready para compilar
 */
//fn.deviceready();