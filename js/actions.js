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
	console.log("http://enlinea.cae3076.com/AppConsultaPedimentos/"+archivoSesion);
		/*if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
		}else{*/
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
		//}
	},
	
	cierraSesion: function(){
		window.localStorage.removeItem("nombreUsuario");
		$('#noPedimento').val('')
		$('#fechaInicio').val('');
		$('#fechaFin').val('');
		$('#resultado').html('');
		$("#usuario").val("");
		$("#password").val("");
		window.location.href = "#paginaInicio";
	},
	
	compruebaSesion: function(){
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
		$('#resultado').html("Cargando...");
		var empresa_rfc = window.localStorage.getItem("nombreUsuario");
		var noPedimento= $("#noPedimento").val();
		try{
			if(noPedimento === ""){
				throw new Error("No ha indicado el pedimento");
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
			return;
		}
		
		if(window.localStorage.getItem("aduana")=='puebla')
		{
			var archivoConsulta = 'buscaPedimento.php';
		}
		else{
			var archivoConsulta = 'buscaPedimento47.php';
		}
		
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		$.ajax({
				type: "GET",
				url: "http://enlinea.cae3076.com/AppConsultaPedimentos/"+archivoConsulta,
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
	},
	
	abrePDF : function(archivo,ruta){
		var vector = ruta.split("/");
		var nuevaRuta = vector[5]+"/"+vector[6]+"/"+vector[7]+"/"+vector[8]+"/"+vector[9]+"/"+archivo;
		var UrlFile = 'http://enlinea.cae3076.com/Portal_CAE/'+nuevaRuta;
		var ref = cordova.InAppBrowser.open('https://docs.google.com/viewer?url='+UrlFile+'&embedded=true', '_blank', 'location=yes');
		window.open = cordova.InAppBrowser.open;
	},
	
	consultaFechaPago: function(){
		$('#resultado').html("Cargando...");
		var empresa_rfc = window.localStorage.getItem("nombreUsuario");
		var fechaInicio= $("#fechaInicio").val();
		var operacion= $("#combo").val();
		var fechaFin= $("#fechaFin").val();
		
		if(window.localStorage.getItem("aduana")=='puebla')
		{
			var archivoConsulta = 'buscaPedimento.php';
		}
		else{
			var archivoConsulta = 'buscaPedimento47.php';
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
		}
		//$('#resultado').html('');
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		$.ajax({
				type: "GET",
				url: "http://enlinea.cae3076.com/AppConsultaPedimentos/"+archivoConsulta,
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
				//alert(data[0].Pedimento);
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
						//alert();
						if(((x+1)%3)==1)
						{
							$('#cuadricula').append('<div id="'+data[x].Pedimento+'" class="ui-block-a">'+data[x].Pedimento+'</div>');
						}
						else
						{
							if(((x+1)%3)==2)
							{
								$('#cuadricula').append('<div id="'+data[x].Pedimento+'" class="ui-block-b">'+data[x].Pedimento+'</div');
							}
							else
							{
								if(((x+1)%3)==0)
								{
									$('#cuadricula').append('<div id="'+data[x].Pedimento+'" class="ui-block-c">'+data[x].Pedimento+'</div>');
								}
							}
						}
						//$('#resultado').append('<div id="'+data[x].Pedimento+'">'+data[x].Pedimento+'</div><br>');	
						//$('#resultado').append('<div id="'+data[x].Archivo+'" onClick="fn.abrePDF('+"'"+data[x].Archivo+"','"+data[x].Ruta+"'"+')">'+data[x].Archivo+'</div></br>');
					}
				}
			}).fail(function(error){
				alert("Error");
				console.log(error.responseText);
			});
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//$('#resultado').html('Resultado Consulta Fecha Pago');
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