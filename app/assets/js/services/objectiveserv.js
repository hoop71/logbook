logbookweb.service('objectiveServ', ['adminserv','$firebaseArray','$firebaseObject', function(adminserv, $firebaseArray, $firebaseObject){
	return {
		addEntrance: function(referencia, entrada, objetivos){
			console.log(Object.keys(objetivos))
			Object.keys(objetivos).forEach(function(key) {
			//for (var objetivo of objetivos) {
				var objetivo = objetivos[key];
				objetivo.procedimientos.forEach(function(objProced){
					var esta = false;
					entrada.cirugia.forEach(function(entProced){
						if (objProced === entProced.id) {
							esta = true;
						}
					})
					if (esta) {
						// aqui tengo que revisar que cumpla con la condicion de la fecha y del rol
						if (!objetivo.entradas) {
							objetivo.entradas = [];
						}
						console.log("agregue")
						objetivo.entradas.push(referencia.key)
					}
				})
			})
		}
	}
}])