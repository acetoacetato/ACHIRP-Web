formateaFecha = (fecha, formato) => {
    var newFecha = ((new Date(fecha)).toISOString().split("T")[0])
    if(formato = undefined || formato == "dd-mm-aaaa")
        newFecha = newFecha.split("-").reverse().join("-");

    return newFecha;
}