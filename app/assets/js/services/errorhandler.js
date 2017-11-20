logbookweb.service('errorHandler', [function(){
	return {
		getErrorMessage: function(errorCode){
			switch(errorCode){
				case('auth/user-not-found'):
					return "Parece que ese usuario no está registrado en nuestra base de datos. Revisa los campos, por favor.";
					break;
				case('auth/wrong-password'):
					return "La contraseña es incorrecta. Inténtalo de nuevo."
					break;
				default:
					return "parece que hubo un error. Inténtalo de nuevo.";
			}
		}
	}
}])