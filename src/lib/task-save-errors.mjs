/** Human-readable task-save feedback; edits remain available for retry. */
export function taskSaveErrorMessage(status){
 switch(status){
  case 401:return "Tu sesión ha caducado. Vuelve a iniciar sesión; conserva estos cambios antes de salir.";
  case 403:return "No tienes permiso para guardar esta tarea.";
  case 404:return "La tarea ya no existe. Copia tus cambios antes de actualizar.";
  default:return "No se pudo guardar la tarea. Comprueba tu conexión e inténtalo de nuevo.";
 }
}
export function taskSaveNetworkErrorMessage(){
 return "No se pudo conectar. Los cambios permanecen en el editor; vuelve a intentarlo.";
}
