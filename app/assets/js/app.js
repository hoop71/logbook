
'use strict';

var logbookweb = angular.module('logbookweb', [
    'ui.router',
    'firebase',
    'chart.js',
    'socialbase.sweetAlert',
    'logbookweb.login',
    'logbookweb.signup',
    'logbookweb.dashboard',
    'logbookweb.table',
    'logbookweb.profile',
    'logbookweb.entry',
    'logbookweb.detail',
    'logbookweb.error'


    ]);

logbookweb.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');

  	
        
});

logbookweb.service('adminserv',['$firebaseArray','$firebaseObject','$rootScope','Auth','$http','constCirugias','constEspecialidades', 'constUniversidades', 'constDirectrices', 'constDiagnosticos', 'constIconos', function($firebaseArray, $firebaseObject, $rootScope,Auth, $http, constCirugias, constEspecialidades, constUniversidades, constDirectrices, constDiagnosticos, constIconos) {
  $rootScope.constantsLoaded = false;
  var entradas = [];
  //var datosAnestesia = datosAnestesia;
  var entradaSeleccionada = "-KoE6_-sAZdMn5apKbQp"; //esto es para hacer pruebas en detail!!!
  //var entradaSeleccionada = null; //esto para cuando esté listo!!!
  var user = '';
  var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  
  var myServ = this;

  var iconos = constIconos;
  
  
  var diagnosticos = constDiagnosticos;
  var cirugias = constCirugias;
  
  // var datosAnestesia = constProcedAnestesia;
  var especialidades = null;
  var universidades = null;
  //var directrices = constDirectrices;
  var directrices = null;


  // var refConstante = firebase.database().ref('constantes/medellin/profesores');
  // var listConstante = $firebaseArray(refConstante);
  // listConstante.$loaded().then(function(result){
  //     constProfesores.forEach(function(entry, index){
  //         listConstante.$add(entry);
  //     })
  // })
  
  //+++++++++++++++++++++++++++++++++++++++
  //DATOS CONDICIONALES POR ESPECIALIDAD
  //+++++++++++++++++++++++++++++++++++++++
  
  var lugares = [];
  var rotaciones = [];
  var complicaciones = [];
  var profesores =[];

  var searchById = function(array, id){
      id = parseInt(id)
      for(var entry of array){
          if (entry.id == id) {
              return entry;
              break;
          };
      }  
  }
  var crearModelo = function(universidad, especialidad){
    console.log("creando modelo")
    var refDir = firebase.database().ref('constantes/directrices');
    var listDir = $firebaseArray(refDir.orderByChild('id').equalTo(universidad));
    listDir.$loaded().then(function(){
      var directriz = listDir[0];
      //console.log(directriz)
      console.log("directrices cargadas")
      var refUnis = firebase.database().ref('constantes/general/unis');
      var listUnis = $firebaseArray(refUnis);
      listUnis.$loaded().then(function(){
        universidades = listUnis;
        var refEsp = firebase.database().ref('constantes/general/especialidades');
        var listEsp = $firebaseArray(refEsp);
        listEsp.$loaded().then(function(){
          especialidades = listEsp;
          var refProfesores = firebase.database().ref('constantes/general/profesores');
          var listProfesores = $firebaseArray(refProfesores);
          listProfesores.$loaded().then(function(){
            console.log('cargados profesores')
            var constantes = searchById(directriz.especialidades, especialidad);
            var refLugares = firebase.database().ref('constantes/general/lugares');
            var listLugares = $firebaseArray(refLugares);
            listLugares.$loaded().then(function(){
              console.log('cargados lugares')
              var refRotaciones = firebase.database().ref('constantes/general/rotaciones');
              var listRotaciones = $firebaseArray(refRotaciones);
              listRotaciones.$loaded().then(function(){
                var refComplicaciones = firebase.database().ref('constantes/general/complicaciones');
                var listComplicaciones = $firebaseArray(refComplicaciones);
                listComplicaciones.$loaded().then(function(){
                  console.log('cargadas complicaciones')
                  lugares = [];
                  for (var i = 0; i < constantes.listaLugares.length; i++) {
                      lugares.push(searchById(listLugares, constantes.listaLugares[i]))
                  };
                  rotaciones = [];
                  for (var i = 0; i < constantes.listaRotaciones.length; i++) {
                      rotaciones.push(searchById(listRotaciones, constantes.listaRotaciones[i]))
                  };
                  complicaciones = [];
                  for (var i = 0; i < constantes.listaComplicaciones.length; i++) {
                      complicaciones.push(searchById(listComplicaciones, constantes.listaComplicaciones[i]))
                  };
                  profesores = [];
                  for (var i = 0; i < constantes.listaProfesores.length; i++) {
                      profesores.push(searchById(listProfesores, constantes.listaProfesores[i]))
                  };
                  $rootScope.constantsLoaded = true;
                  $rootScope.$broadcast('adminserv:directricesListas');
                });
              })
            });
          })
        })
      })
    }) 
  }
  if(localStorage.getItem("especialidad")){
    if (localStorage.getItem("universidad")) {
      crearModelo(parseInt(localStorage.getItem("universidad")), parseInt(localStorage.getItem("especialidad")))
    }
  }
  

  return {
    agregarEntrada: function(entrada){
      entradas.push(entrada);
    },
    getEntradas: function(){
      return entradas;
    },
    setSeleccion: function(id){
      entradaSeleccionada = id;
    },
    getSeleccion: function(){
      return entradaSeleccionada;
    },
    getUser: function() {
        if(user==''){
            user = localStorage.getItem("userKey");
        }
        return user;
    },
    setUser: function(userKey) {
        localStorage.setItem("userKey", userKey)
        user = userKey;
    },
    getEspecialidad: function(){
        return localStorage.getItem("especialidad");
    },
    setEspecialidad: function(especialidad){
        localStorage.setItem("especialidad", especialidad);
    },
    setUniversidad: function(universidad){
        localStorage.setItem("universidad", universidad);
    },
    logoutUser: function(){
        Auth.$signOut();
        user = '';
        localStorage.removeItem('userKey');
        localStorage.removeItem('especialidad');
    },
    getDia: function(dia){
        return dias[dia];
    },
    getMes: function(mes){
        return meses[mes];
    },
    setDatosCondicionales: function(universidad,especialidad){
        crearModelo(parseInt(universidad),parseInt(especialidad));
    },
    getSelectInfo: function(campo){
        switch(campo){
            case 'lugares':
                return lugares;
                break;
            case 'rotaciones':
                return rotaciones;
                break;
            case 'diagnosticos':
                return diagnosticos;
                break;
            case 'cirugias':
                return cirugias;
                break;
            case 'datosAnestesia':
                return datosAnestesia;
                break;
            case 'complicaciones':
                return complicaciones;
                break;
            case 'especialidades':
                return especialidades;
                break; 
            case 'profesores':
                return profesores;
                break;        
        }
    },
    getNameById: function(constante, id, largo){

      if (id && $rootScope.constantsLoaded) {
        id = parseInt(id)
        switch(constante){
            case 'lugar':
                if (largo) {
                    return searchById(lugares, id).nombreLargo;
                }else{
                    console.log(lugares)
                    return searchById(lugares, id).nombreCorto;
                };
                break;  
            case 'rotacion':
                if (largo) {
                    return searchById(rotaciones, id).nombreLargo;
                }else{
                    return searchById(rotaciones, id).nombreCorto;
                };
                break;
            case 'diagnostico':
                if (largo) {
                    return searchById(diagnosticos, id).nombreLargo;
                }else{
                    return searchById(diagnosticos, id).nombreCorto;
                };
                break;
            case 'cirugia':
                if (largo) {
                    return searchById(cirugias, id).nombreLargo;
                }else{
                    return searchById(cirugias, id).nombreCorto;
                };
                break;
            case 'complicacion':
                if (largo) {
                    return searchById(complicaciones, id).nombreLargo;
                }else{
                    return searchById(complicaciones, id).nombreCorto;
                };
                break;
            case 'rol':
                if (largo) {
                    return searchById(iconos.rol, id).nombreLargo;
                }else{
                    return searchById(iconos.rol, id).nombreCorto;
                };
                break;
            case 'tipo':
                if (largo) {
                    return searchById(iconos.tipo, id).nombreLargo;
                }else{
                    return searchById(iconos.tipo, id).nombreCorto;
                };
                break;
            case 'feeling':
                if (largo) {
                    return searchById(iconos.feeling, id).nombreLargo;
                }else{
                    return searchById(iconos.feeling, id).nombreCorto;
                };
                break;
            case 'especialidad':
                if (largo) {
                    return searchById(especialidades, id).nombreLargo;
                }else{
                    return searchById(especialidades, id).nombreCorto;
                };
                break;
            case 'universidad':
                if (largo) {
                    return searchById(universidades, id).nombreLargo;
                }else{
                    return searchById(universidades, id).nombreCorto;
                };
                break;
            case 'nodo0':
                if (largo) {
                    return searchById(datosAnestesia[0], id).nombreLargo;
                }else{
                    return searchById(datosAnestesia[0], id).nombreCorto;
                };
                break;
            case 'profesor':
                if (largo) {
                    return searchById(profesores, id).nombreLargo;
                }else{
                    return searchById(profesores, id).nombreCorto;
                };
                break;
            case 'mes':
                if (largo) {
                    return meses[id];
                }else{
                    return meses[id];
                };
                break;
        }
      }else{
        return null;
      }
        
    },
    getIconById: function(tipo, id){
      if (id) {
        switch(tipo){
            case 'rol':
                return searchById(iconos.rol, id).url;
                break;
            case 'tipo':
                return searchById(iconos.tipo, id).url;
                break;
            case 'feeling':
                return searchById(iconos.feeling, id).url;
                break;
            case 'asa':
                return searchById(iconos.asa, id).url;
                break;
        }
      }else{
        return null;
      }
        
    },
    searchById: function(array, id){
        for(var entry of array){
            if (entry.id == parseInt(id)) {
                return entry;
                break;
            };
        }  
    },
    interpretarFecha: function(fechaStr){
        var laFecha = new Date(fechaStr)
        var ano = laFecha.getFullYear();
        var mes = meses[laFecha.getMonth()];
        var dia = laFecha.getDate();
        var nombreDia = dias[laFecha.getDay()];
        return nombreDia + " " + mes + " " + dia + " de " + ano;
    },
    interpretarFechaShort: function(fechaStr){
      var laFecha = new Date(fechaStr)
      var ano = laFecha.getFullYear();
      //var mes = meses[laFecha.getMonth()];
      var mes = laFecha.getMonth()+1;
      var dia = laFecha.getDate();
      return dia + '/' + mes + '/' + ano
    },
    getAnores: function(initDate, targetDate){
      var dateInit = new Date(initDate);
      var dateTarget = new Date(targetDate)
      return Math.ceil((dateTarget - dateInit)/31536000000);
    }
  };
}]);


logbookweb.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

logbookweb.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });
}]);
logbookweb.directive('alFinalizar', function() {
  return function(scope, element, attrs) {
    angular.element(element).css('color','blue');
    if (scope.$last){
      $.material.init();
    }
  };
})


