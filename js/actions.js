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

var fn = {
	deviceready: function(){
		document.addEventListener("deviceready", fn.init/*this.init*/, false);
	},
	init: function(){
	/*
	 * En esta sección vamos a asociar
	 * todos los eventos del "Click" al HTML
	 */
	  $("#botonIniciarSesion").tap(fn.iniciarSesion);
	 
	 
	}
},
iniciarSesion: function(){
	cordova.plugins.SitewaertsDocumentViewer.canViewDocument(
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
};


/*
 *Llamar al metodo Init en el navegador
 */
//fn.init();

/*
 *Llamar deviceready para compilar
 */
//
fn.deviceready();