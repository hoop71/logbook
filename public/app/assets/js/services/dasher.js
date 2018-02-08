logbookweb.service('dataCruncher', ['adminserv', function(adminserv){
	var entriesByYear = [[],[],[],[],[]];
	var entriesByRole =[]; 
	var entriesByType =[]; 
	var monthAvgByYear = [];
	var dashboardData = {
		general: {},
		r1: {},
		r2: {}, 
		r3: {},
		r4: {}, 
	};

	var dataLugar = [];
	var labelsLugar = [];

	var dataRotacion = [];
	var labelsRotacion = [];

	var dataTipo = [];
	var labelsTipo = [];

	var dataDiagnostico = [];
	var labelsDiagnostico = [];
	var labelsDx = [];
	var maxDx = 5;

	var dataCirugia = [];
	var labelsCirugia = [];
	var labelsQx = [];
	var maxQx = 5;

	var detailRol = [{labels: [], data: [[]], total: 0},{labels: [], data: [[]], total: 0},{labels: [], data: [[]], total: 0}];
	var byDate = {};
	var nestedByDate = {};

	var totalProced = 0;

	var today = new Date();
	function monthDiff(d1, d2) {
	    var months;
	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	    months -= d1.getMonth() + 1;
	    months += d2.getMonth();
	    return months <= 0 ? 1 : months+1;
	}


	function trimTo(maxSize, arrayLabels, arrayData){
		var orderedLabels = [];
		var rawData = arrayData.slice();
		arrayData.sort(function(a, b){return b-a});
		if (arrayData.length>maxSize) {
			arrayData.splice(maxSize, arrayData.length - maxSize);
		}
		for (var i = 0; i < arrayData.length; i++) {
		    var theInd = rawData.indexOf(arrayData[i]);
		    orderedLabels[i] = arrayLabels[theInd];
		    rawData.splice(theInd, 1);
		    arrayLabels.splice(theInd, 1)
		};
		return [orderedLabels, arrayData];
	}

	return{
		getDashboardData: function(user, entries){
			// LIMPIO VARIABLES
			entriesByYear = [[],[],[],[],[]];
			entriesByRole = [[0,0,0],[0,0,0],[0,0,0],[0,0,0], [0,0,0]];
			entriesByType = [[0,0,0],[0,0,0],[0,0,0],[0,0,0], [0,0,0]];
			monthAvgByYear = [];
			dashboardData = {
				general: {
					byLocation: {},
					byRotation: {},
					byRole: {},
					byRoleProgress: {},
					byType: {},
					byTypeProgress: {},
					byDiagnosis:{},
					byProcedure: {},
					byDateYear: {},
					byDateMonths: {} 
				},
				r1: {
					byLocation: {},
					byRotation: {},
					byRole: {},
					byType: {},
					byDiagnosis:{},
					byProcedure: {},
					byDateYear: {},
					byDateMonths: {}
				},
				r2: {
					byLocation: {},
					byRotation: {},
					byRole: {},
					byType: {},
					byDiagnosis:{},
					byProcedure: {},
					byDateYear: {},
					byDateMonths: {}
				}, 
				r3: {
					byLocation: {},
					byRotation: {},
					byRole: {},
					byType: {},
					byDiagnosis:{},
					byProcedure: {},
					byDateYear: {},
					byDateMonths: {}
				},
				r4: {
					byLocation: {},
					byRotation: {},
					byRole: {},
					byType: {},
					byDiagnosis:{},
					byProcedure: {},
					byDateYear: {},
					byDateMonths: {}
				}, 
			};
			today = new Date();

			dataLugar = [];
    		labelsLugar = [];

    		dataRotacion = [];
    		labelsRotacion = [];

    		dataTipo = [];
    		labelsTipo = [];

    		dataDiagnostico = [];
    		labelsDiagnostico = [];

    		dataCirugia = [];
    		labelsCirugia = [];

    		detailRol = [{labels: [], data: [[]], total: 0},{labels: [], data: [[]], total: 0},{labels: [], data: [[]], total: 0}];
    		byDate = {};
    		nestedByDate = {};

    		var registre = false;

    		//ARRANCO ANALISIS
			var monthsOfStudy = monthDiff(new Date(user.fechainicio),today);
			dashboardData.general.totalQx = entries.length;
			dashboardData.general.qxPerYear = (entries.length/user.anores).toFixed(2);
			dashboardData.general.qxPerMonth = (entries.length/monthsOfStudy).toFixed(2);

			for (var entry of entries) {
				var entryDate = new Date(entry.fecha);
				var entryYear = entryDate.getFullYear();
				var entryMonth = entryDate.getMonth();
				var entryDayNumber = entryDate.getDate();
				
				//console.log(entryDayNumber)
				if (entryYear.toString() in byDate) { //ya hay datos de ese año
					byDate[entryYear.toString()]++;
					nestedByDate[entryYear.toString()][entryMonth][entryDayNumber]++;

				}else{ //no hay datos de ese año

					byDate[entryYear.toString()]=1;	
					nestedByDate[entryYear.toString()] = [
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
					nestedByDate[entryYear.toString()][entryMonth][entryDayNumber] = 1;

				}
				totalProced += entry.cirugia.length
			 	if (entry.anores>=0) {
			 		entriesByYear[entry.anores].push(entry)
			 	}else{
			 		//falta ver qué hacer con las entradas que no tienen anores por algun motivo.
			 	}
			 	//*****************************
			 	//anido por rol
			 	//*****************************
			 	entriesByRole[0][entry.rol-1]++;
			 	entriesByRole[entry.anores][entry.rol-1]++;

			 	//*****************************
			 	//anido por tipo
			 	//*****************************
			 	entriesByType[0][entry.tipoCir-1]++;
			 	entriesByType[entry.anores][entry.tipoCir-1]++;

			 	//*****************************
			 	//anido por lugar
			 	//*****************************
			 	registre = false;
			 	var nombre = adminserv.getNameById('lugar',entry.lugar, false);
			 	labelsLugar.forEach(function(entryLL, indLL){
			 	    if (nombre == entryLL) {
			 	        dataLugar[indLL]++;
			 	        registre = true;
			 	    };
			 	})
			 	if (!registre) {
			 	    labelsLugar.push(nombre);
			 	    dataLugar.push(1);
			 	};

			 	//*****************************
			 	//anido por rotacion
			 	//*****************************
			 	registre = false;
			 	var nombre = adminserv.getNameById('rotacion',entry.rotacion, false);
			 	labelsRotacion.forEach(function(entryR, indR){
			 	    if (nombre == entryR) {
			 	        dataRotacion[indR]++;
			 	        registre = true;
			 	    };
			 	})
			 	if (!registre) {
			 	    labelsRotacion.push(nombre);
			 	    dataRotacion.push(1);
			 	};

			 	//*****************************
			 	//anido por diagnosticos
			 	//*****************************
			 	for (var i = entry.diagnostico.length - 1; i >= 0; i--) {
			 		registre = false;
				 	var nombre = adminserv.getNameById('diagnostico',entry.diagnostico[i], true);
				 	labelsDiagnostico.forEach(function(entryR, indR){
				 	    if (nombre == entryR) {
				 	        dataDiagnostico[indR]++;
				 	        registre = true;
				 	    };
				 	})
				 	if (!registre) {
				 	    labelsDiagnostico.push(nombre);
				 	    dataDiagnostico.push(1); 
				 	};
			 	}
			 	

			 	//*****************************
			 	//anido por procedimiento
			 	//*****************************
			 	for (var i = entry.cirugia.length - 1; i >= 0; i--) {
			 		registre = false;
				 	var nombre = adminserv.getNameById('cirugia',entry.cirugia[i].id, true);
				 	labelsCirugia.forEach(function(entryR, indR){
				 	    if (nombre == entryR) {	//el nombre ya existe, ya había uno de este mismo procedimiento
				 	        dataCirugia[indR]++;
				 	        registre = true;
				 	    };
				 	})
				 	if (!registre) {	//el nombre no existe, hay que crearlo nuevo.
				 	    labelsCirugia.push(nombre);
				 	    dataCirugia.push(1); 
				 	};

				 	//*****************************
				 	//anido por procedimiento en cada rol (para los detalles)
				 	//*****************************
				 	registre = false;
				 	var detailLabels = detailRol[entry.rol-1].labels;
				 	var detailData = detailRol[entry.rol-1].data[0];
				 	detailLabels.forEach(function(entryDet, indDet){
				 		
				 		if (nombre == entryDet) {	
				 			detailRol[entry.rol-1].total++;
				 	        detailData[indDet]++;
				 	        registre = true;
				 	    };
				 	})
				 	if (!registre) {	
				 	    detailLabels.push(nombre);
				 	    detailData.push(1); 
				 	    detailRol[entry.rol-1].total++;
				 	};
			 	}	
			} //Cierro for entry in entries

			//*****************************
			//Recorto Dx al top elegido
			//*****************************
			var dxTrim = trimTo(maxDx,labelsDiagnostico, dataDiagnostico);
			labelsDx = dxTrim[0];
			dataDiagnostico = dxTrim[1];
			


			//*****************************
			//Recorto Qx al top elegido
			//*****************************
			var qxTrim = trimTo(maxQx,labelsCirugia, dataCirugia);
			labelsQx = qxTrim[0];
			dataCirugia = qxTrim[1];

			//*****************************
			//Recorto los datos por Rol
			//*****************************
			for (var i = 0; i <=2 ; i++) {
				var trim = trimTo(5, detailRol[i].labels, detailRol[i].data[0]);
				detailRol[i].labels = trim[0],
				detailRol[i].data = [trim[1]];
			}
			

			//*****************************
			//Preparo datos a devolver
			//*****************************
			dashboardData.general.byLocation.data=[dataLugar];
			dashboardData.general.byLocation.labels=labelsLugar;

			dashboardData.general.byRotation.data=[dataRotacion];
			dashboardData.general.byRotation.labels=labelsRotacion;

			
			dashboardData.general.barsByYearData = [
		    	[entriesByYear[1].length, entriesByYear[2].length, entriesByYear[3].length, entriesByYear[4].length]
		  	];

		  	dashboardData.general.byRole.data=entriesByRole[0];
		  	dashboardData.general.byRole.labels=["Cirujano", "1. ayudante", "2. ayudante"];

		  	dashboardData.general.byRoleProgress.data = [
		  		[entriesByRole[1][0],entriesByRole[2][0],entriesByRole[3][0], entriesByRole[4][0]],
		  		[entriesByRole[1][1],entriesByRole[2][1],entriesByRole[3][1], entriesByRole[4][1]],
		  		[entriesByRole[1][2],entriesByRole[2][2],entriesByRole[3][2], entriesByRole[4][2]]];
		  	dashboardData.general.byRoleProgress.labels=["R1", "R2", "R3", "R4"];

		  	dashboardData.general.byType.data=entriesByType[0];
		  	dashboardData.general.byType.labels=["Electiva", "Urgente", "Emergente"];

		  	dashboardData.general.byTypeProgress.data = [
		  		[entriesByType[1][0], entriesByType[2][0], entriesByType[3][0], entriesByType[4][0]],
		  		[entriesByType[1][1], entriesByType[2][1], entriesByType[3][1], entriesByType[4][1]],
		  		[entriesByType[1][2], entriesByType[2][2], entriesByType[3][2], entriesByType[4][2]]]
		  	dashboardData.general.byTypeProgress.labels=["R1", "R2", "R3", "R4"];

		  	dashboardData.general.byDiagnosis.data=[dataDiagnostico];
			dashboardData.general.byDiagnosis.labels=labelsDx;

			dashboardData.general.byProcedure.data=[dataCirugia];
			dashboardData.general.byProcedure.labels=labelsQx;

			dashboardData.general.byRoleDetail = detailRol;

		
			dashboardData.general.byDateYear.data = [Object.values(byDate)] 
			dashboardData.general.byDateYear.labels = Object.keys(byDate);
			
			for (var property in nestedByDate) {
			    if (nestedByDate.hasOwnProperty(property)) {
			        var newData = []
			        for (var i in nestedByDate[property]) {
			        	var total = 0;
			        	for (var j in nestedByDate[property][i]) {
			        		
			        		total += nestedByDate[property][i][j];
			        	}
			        	newData.push(total)
			        }
			        var newObject = {
			        	title: property,
			        	data: [newData]
			        }
			        dashboardData.general.byDateMonths[property] = newObject;
			    }
			}
		  	dashboardData.r1.totalQx = entriesByYear[1].length;
		  	dashboardData.r2.totalQx = entriesByYear[2].length;
		  	dashboardData.r3.totalQx = entriesByYear[3].length;
		  	dashboardData.r4.totalQx = entriesByYear[4].length;
		  	for (var i = 0; i <4 ; i++) {
		  		if (i+1==user.anores) {
		  			monthAvgByYear[i] = entriesByYear[i+1].length/(monthsOfStudy-(i)*12);
		  			break;
		  		}else{
		  			monthAvgByYear[i] = entriesByYear[i+1].length/12;
		  		}
		  	}
		  	dashboardData.r1.qxMonthAvg = monthAvgByYear[0];
		  	dashboardData.r2.qxMonthAvg = monthAvgByYear[1];
		  	dashboardData.r3.qxMonthAvg = monthAvgByYear[2];
		  	dashboardData.r4.qxMonthAvg = monthAvgByYear[3];

		  	dashboardData.r1.byRole.data = entriesByRole[1];
		  	dashboardData.r2.byRole.data = entriesByRole[2]
		  	dashboardData.r3.byRole.data = entriesByRole[3]
		  	dashboardData.r4.byRole.data = entriesByRole[4]

		  	dashboardData.r1.byType.data=entriesByType[1];
		  	dashboardData.r2.byType.data=entriesByType[2];
		  	dashboardData.r3.byType.data=entriesByType[3];
		  	dashboardData.r4.byType.data=entriesByType[4];

		  	return dashboardData
		}
	}
}])