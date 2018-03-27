var fn = {
	deviceready: function(){
		document.addEventListener("deviceready", fn.init/*this.init*/, false);
	},
	init: function(){
	/*
	 * En esta sección vamos a asociar
	 * todos los eventos del "Click" al HTML
	 */
	  $("#botonAcceder").tap(fn.iniciarSesion);
   	  $("#botonConsultarPedimento").tap(fn.consultaPedimento);
	  $("#botonConsultarFecha").tap(fn.consultaFechaPago);
	  $("#linkConsultaNoPedimento").tap(fn.divPorPedimento);
	  $("#linkConsultaFechaPago").tap(fn.divPorFechaPago);
	  $("#cierraSesion").tap(fn.cierraSesion);
	  
	},
	iniciarSesion: function(){
		window.location.href="#inicio";
		var aduana = $("#aduana").val();
		if(aduana=='puebla')
		{
			$("#aduanaNp").text('Aduana: Puebla');
			$("#aduanaFp").text('Aduana: Puebla');
		}
		else
		{
			$("#aduanaNp").text('Aduana: AICM');
			$("#aduanaFp").text('Aduana: AICM');
		}
		/*var UrlFile = 'http://enlinea.cae3076.com/Portal_CAE/PDFS/2017/AAM9712016M2/20171127/3076-75-7066204/7066204-PC.pdf';
		var ref = cordova.InAppBrowser.open('https://docs.google.com/viewer?url='+UrlFile+'&embedded=true', '_blank', 'location=yes');
		window.open = cordova.InAppBrowser.open;*/
	},
	
	cierraSesion: function(){
		//window.localStorage.removeItem("nombreUsuario");
		//$("#usuarioSesion").val("");
		//$("#passwordSesion").val("");
		window.location.href = "#paginaInicio";
	},
	
	consultaPedimento: function(){
		$('#resultado').html("Cargando...");
		var noPedimento= $("#noPedimento").val();
		try{
			if(noPedimento == ""){
				throw new Error("No ha indicado el pedimento");
			}
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
		}
		$('#resultado').html('');
		////////////////////////////////////////////////////////////// Envio AJAX//////////////////////////////////////////////////////////////////
		$http({
			method: 'GET',
			url: "http://enlinea.cae3076.com/AppConsultaPedimentos/buscaPedimento.php?opcion="+1+"&noPedimento="+noPedimento
	   	}).then(function (success){
			alert(success.data[0][0]);
	   	},function (error){

		});
		/*$.ajax({
				method: "GET",
				url: "",
				data: { 
					opcion: 1,
					noPedimento: noPedimento
				}
			}).done(function(mensaje){
				//alert("Datos enviados");
				if(mensaje != "0"){
					$('#resultado').html(mensaje.data[0][0]);
				}else{
					window.plugins.toast.show("Error", 'long', 'center');
				}

			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});*/
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	},
	
	abrePDF : function(ruta_completa){
		alert("llegue" + ruta_completa);
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