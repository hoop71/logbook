logbookweb.service('errorHandler', [function(){
	return {
		getErrorMessage: function(errorCode){
			switch(errorCode){
				case('auth/user-not-found'):
					return {
							type: "error",
							message: "Parece que ese usuario no está registrado en nuestra base de datos. Revisa los campos, por favor."
						};
					break;
				case('auth/wrong-password'):
					return{
						type: "error",
						message: "La contraseña es incorrecta. Inténtalo de nuevo."
					}
					break;
				case('auth/invalid-email'):
					return{
						type: "warning",
						message: "El email que escogiste parece estar mal escrito. Por favor revísalo."
					}
					break;
				case('auth/weak-password'):
					return{
						type: "warning",
						message: "Tu contraseña debe tener al menos 8 caracteres. Inténtalo de nuevo."
					}
					break;
				case('auth/email-already-in-use'):
					return{
						type: "error",
						message: "Ya existe un usuario registrado con ese email."
					}
					break;
				case('login/newpassemail-sent'):
					return{
						type: "warning",
						message: "Te hemos enviado un email con las instrucciones para cambiar tu contraseña. Por favor busca en tu bandeja de entrada."
					}
				case('auth/operation-not-allowed'):
					return{
						type: "error",
						message: "El proceso de registro no está habilitado. Por favor vuelve a intentarlo más tarde."
					}
					break;
				case('form/incomplete-fields'):
					return{
						type: "warning",
						message: "Debes llenar todos los campos obligatorios."
					}
					break;
				case('EDIT/success'):
					return{
						type: "success",
						message: "La entrada ha sido editada exitosamente"
					}
					break;
				case('EDIT/no-success'):
					return{
						type: "error",
						message: "Hubo un error, por favor intentalo más tarde..."
					}
					break;
				default:
					return{
						type: "warning",
						message: "parece que hubo un error. Inténtalo de nuevo."
					}
			}
		}
	}
}])