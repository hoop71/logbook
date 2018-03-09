logbookweb.service('objectiveServ', ['adminserv','$firebaseArray','$firebaseObject', function(adminserv, $firebaseArray, $firebaseObject){
	return {
		addEntrance: function(referencia, entrada, objetivos){
			var agregue = false;
			Object.keys(objetivos).forEach(function(key) {
			//for (var objetivo of objetivos) {
				var objetivo = objetivos[key];
				if (entrada.anores>=objetivo.fechas.start && entrada.anores<=objetivo.fechas.end && objetivo.rol.indexOf(entrada.rol)>=0) {
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
							agregue = true;
							objetivo.entradas.push(referencia.key)
						}
					})
				}
			})
			return agregue;
		},
		checkRetroactivity: function(entradas, objetivo){
			entradas.forEach(function(entrada){
				if (entrada.anores>=objetivo.fechas.start && entrada.anores<=objetivo.fechas.end && objetivo.rol.indexOf(entrada.rol)>=0) {
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
							agregue = true;
							objetivo.entradas.push(entrada.$id)
						}
					})
				}
			})
		},
		checkStatus: function(objetivo){
			if (objetivo.entradas) {
				if (objetivo.entradas.length >= objetivo.cantidad) {
					return "completado";
				}else{
					return "pendiente"
				}
			}else{
				return "pendiente"
			}
		},
		eraseEntryUpdate:function(entry, objetivos){
			console.log(entry.$id)
			console.log(objetivos)
			Object.keys(objetivos).forEach(function(key) {
				var objetivo = objetivos[key];
				if (objetivo.entradas) {
					var index = objetivo.entradas.indexOf(entry.$id);
					if (index > -1) {
				    	objetivo.entradas.splice(index, 1);
				    	console.log("borre de objetivo")
					}
				}
				
			})
		}
	}
}]) 


