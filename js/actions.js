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
		//var ref = cordova.InAppBrowser.open('http://enlinea.cae3076.com/Portal_CAE/PDFS/2017/AAM9712016M2/20171127/3076-75-7066204/7066204-PC.pdf', '_blank', 'location=yes');
		
		//window.open = cordova.InAppBrowser.open;
		
		
		//window.open("http://enlinea.cae3076.com/Portal_CAE/PDFS/2017/AAM9712016M2/20171127/3076-75-7066204/7066204-PC.pdf",'_blank', 'location=no,toolbar=no,hardwareback=yes');
			var VIEWER_OPTIONS = {
			documentView: {
				closeLabel: "Fertig"
			},
			navigationView: {
				closeLabel: "Zurück"
			},
			email: {
				enabled: false
			},
			print: {
				enabled: true
			},
			openWith: {
				enabled: false
			},
			bookmarks: {
				enabled: false
			},
			search: {
				enabled: false
			},
			autoClose: {
				onPause: false
			}
		};
		
		var options = $.extend({}, VIEWER_OPTIONS);
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
		alert("fin metodo");
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