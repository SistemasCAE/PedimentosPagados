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
	},
	iniciarSesion: function(){

		alert("Llegue");
		var _sdv;
		_sdv = cordova.plugins.SitewaertsDocumentViewer;
		_sdv.canViewDocument(
		"http://enlinea.cae3076.com/Portal_CAE/PDFS/2017/AAM9712016M2/20171127/3076-75-7066204/7066204-PC.pdf", 
		"application/pdf", 
		options,
		function onPossible()
		{
			entry.canView = true;
			next();
		},
		function onMissingApp()
		{
			entry.canView = true;
			next();
		},
		function onImpossible()
		{
			entry.canView = false;
			next();
		},
		function onError(error)
		{
			window.console.log(error);
			entry.canView = false;
			next();
		});
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