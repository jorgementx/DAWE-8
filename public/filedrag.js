// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function output(msg) {
		var m = $id("messages");
		m.innerHTML += msg;
	}


	// file drag hover
	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function fileSelectHandler(e) {

		// cancel event and hover styling
		fileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;
   
		for (var f of files) {
			parseFile(f);
		}
        // files can be added by drag&drop or clicking on form's button
        // if the later, append files to form files field 
        var formFiles = $id("upload").fileselect;
        if (formFiles.files.length == 0){
            formFiles.files = files;
        }

	}


	// output file information
	function parseFile(file) {

		output(
			"<p>Datos del fichero: <strong>" + file.name +
			"</strong> Tipo: <strong>" + file.type +
			"</strong> Tamaño: <strong>" + file.size +
			"</strong> bytes</p>"
		);

	}


    function enviar(submitform) {
    // debes devolver una función que recoja los datos de submitform usando FormData y haga una
    // petición post (usando el Fetch API) con dichos datos a /pedido/add 
    //  El resultado debes tratarlo como un objeto JSON y mostrarlo pantalla. En concreto la respuesta
    // JSON debe contener las rutas a los ficheros subidos al servidor (al hacer click sobre ellas deben
    // abrirse los ficheros) y los valores del resto de campos
		
		return function () {
			if (!submitform.querySelector(':invalid')) {
				fetch('/pedido/add', {
					method: 'POST',
					body: new FormData(submitform)
				})
					.then(r1 => r1.json())
					.then(r2 => {
						console.log(r2);
						if (r2.success) addResults(r2);
					});
			 }
				
		}
    }

	// output information
	function output2(msg) {
		var m = $id("messages2");
		m.innerHTML = msg;
	}

	function addResults(emaitza) {
		output2(
			"<p>Resultados del formulario:<p>" +
			"<ul>" +
				"<li>Nombre: " + emaitza.nombre + "</li>" +
				"<li>Teléfono: " + emaitza.telefono + "</li>" +
				"<li>Email: " + emaitza.email + "</li>" +
				"<li>Libro: " + emaitza.libros + "</li>" +
				"<li>Cantidad: " + emaitza.cantidad + "</li>" +
				"<li>Imágenes:</li>" +
				"<div>" +
					irudiakJarri(emaitza.files) +
				"</div>" +
			"</ul>"
		);
	}

	function fitxHelbideaK(files) {
		var emaitza = "";

		for(let file of files){
			var helbideAbs = window.location.host + file.replace("public", "");
			emaitza += "<li><a class = \"link external\" href=\"" +
			file.replace("public", "") + "\" target=\"_blank\">" + helbideAbs + "</a></li>";
		}

		return emaitza;
	}

	function irudiakJarri(files) {
		var emaitza = "";

		for(let file of files) {
			var  helbideErl = file.replace("public", "");
			emaitza += "<a href=\"" + helbideErl + "\" target=\"_blank\"><img src=\"" + 
						helbideErl + "\" style=\"width:100px; height:100px; margin-right: 5px;\" title=" +
						file.replace("public/imgs/", "") + " alt=" + file.replace("public/imgs/", "") + "></a>";
		}

		return emaitza;
	}

	// initialize
	function init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("enviar");


        submitbutton.onclick = enviar($id("upload"));



		// file select
		fileselect.addEventListener("change", fileSelectHandler, false);


			// file drop
			filedrag.addEventListener("dragover", fileDragHover, false);
			filedrag.addEventListener("dragleave", fileDragHover, false);
			filedrag.addEventListener("drop", fileSelectHandler, false);
			filedrag.style.display = "block";

	}

	// call initialization file
	if (window.File && window.FileList) {
		init();
	}

