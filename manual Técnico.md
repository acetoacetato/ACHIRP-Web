# Documentación Página ACHIRP

**Este es un manual técnico**. En este se hablará sobre los archivos clave y el funcionamiento del aplicativo, para finalizar con un ejemplo de inserción de una nueva sección.

## Ambiente NodeJS

Nodejs es un abiente de servidor que funciona sobre un intérprete de javascript, permitiendo la codificación de todo el back-end en este lenguaje. Para su uso en aplicaciones web, se hace el uso del framework *express*, destinado para crear las distintas rutas de acceso de la página, además de la administración de las carpetas accesibles por quienes visiten la página.

## Funcionamiento de la aplicación web

Para el funcionamiento de la aplicación, se tienen en cuenta 4 cosas: El archivo inicializador del servidor, las rutas, los modelos y las vistas.

### Archivo inicializador del Servidor

El archivo, llamado server.js, inicializa y une las rutas con las conexiones a la base de datos, administra (en caso de ser necesario) el puerto de conexión (para web se debe usar el puerto 80 por defecto), administra las carpetas públicas para quienes visiten la página y finalmente inicializa el servidor. El archivo está documentado con el detalle sobre el funcionamiento de cada línea.

### Rutas

Las rutas son una sección del sitio web. Por ejemplo achirp.cl tendrá la página principal, la cual será una ruta. Por el lado del administrador, achirp.cl/asamblea será la ruta por la cual los administradores podrán administrar los datos de las asambleas realizadas y por realizar. Estas se administran desde su archivo correspondiente, en **la carpeta routes**, donde se entrará más en detalle de su uso más adelante.

### Modelos

La aplicación web utiliza una base de datos no relacional, sobre el motor mongodb.
El modelo no relacional establece un funcionamiento menos estructurado que una relacional, pero para el caso de esta aplicación, se usará como una relacional. 

Los modelos son archivos de javascript que manejan la estructura un documento de la base de datos. Hay que tener en cuenta que cualquier modificación de la estructura de estos modelos se harán efectivas desde los nuevos datos ingresados desde la aplicación, por lo que los antiguos mantendrán la estructura anterior.

### Vistas

Las vistas son archivos que toman los datos pre procesados que extraen las rutas y le dan forma. El funcionamiento es parecido a un archivo PHP; se comporta como un HTML hasta que se utiliza una serie de caracteres especiales, que expresa el inicio de código de javascript que manejará los datos que da la ruta. Más detalles en cómo se hace se discuten más adelante.

## Detalle de implementación

En esta sección se discuten los detalles propuestos en la sección anterior.

## Detalle de las Rutas

Una ruta es un archivo de extensión '.js' situada en la carpeta 'routes'. 

Para su inicialización, se debe importar la librería express e inicializar un enrutador.

    express = require('express')
    router = express.Router()

Una vez inicializado el router, se puede habilitar una ruta con este.

    router.get('/', (req, res) => {
        // Acá va el código a ejecutar.
    })

El código de arriba habilita la ruta '/' para funcionar mediante el método GET, req y res son variables que contienen los datos de entrada (req) y los datos que se mandarán de respuesta (res). 

Si por ejemplo, para una ruta 'achirp.cl/asamblea?ms1=hola&ms2=adios', se ejecutaría el método de arriba, y en req.body estará un diccionario con los valores:

    {
        'ms1' : 'hola',
        'ms2' : 'adios'
    }

De esta manera, podremos acceder a los valores de la siguiente manera:

    req.body.ms1 // hola
    req.body['ms2'] // adios

Ambas maneras serán igual de válidas y retornarán el mismo resultado.