## URL

Este módulo posee utilidades para la resolución y análisis de URL.
Para usarlo utilice `require('url')`.

Analizar objetos URL tiene algo o mucho de los siguientes campos, dependiendo de
que exista o no en la cadena de URL. Las partes que no están en la cadena de URL
no se analizarán y no estarán presente en el objeto. Un ejemplo para la siguiente URL

`'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'`

* `href`: La dirección URL ha sido analizada desde un principio.

  Ejemplo: `'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'`
* `protocol`: El protocolo de petición (request).

  Ejemplo: `'http:'`
* `host`: Una parte del host de la URL completa, incluyendo la información del puerto y autentificación.

  Ejemplo: `'user:pass@host.com:8080'`
* `auth`: Parte de la información de autentificación de la URL.

  Ejemplo: `'user:pass'`
* `hostname`: Sólo la parte del nombre del host.

  Ejemplo: `'host.com'`
* `port`: El número de puerto del host.

  Ejemplo: `'8080'`
* `pathname`: La sección de la ruta de la URL, que viene después del host y antes de la consulta, incluyendo la barra inicial si está presente.

  Ejemplo: `'/p/a/t/h'`
* `search`: La parte de 'cadena de consulta' de la URL, incluyendo el signo de interrogación principal.

  Ejemplo: `'?query=string'`
* `query`: La parte de cualquier 'parámetro' de la cadena de consulta, o un parser de un objeto de cadena de consulta.

  Ejemplo: `'query=string'` o `{'query':'string'}`
* `hash`: La parte del 'fragmento' de la  URL incluyendo el símbolo de la libra.

  Ejemplo: `'#hash'`

Los siguientes métodos son proporcionados por el módulo URL:

### url.parse(urlStr, parseQueryString=false)

Toma una cadena de la URL, y la devuelve como un objeto.  Devuelve `true` como el segundo argumento  a
la cadena de consulta usando el módulo `querystring`.

### url.format(urlObj)

Toma un parser de un objeto URL, y devuelve una cadena de URL.

### url.resolve(from, to)

Toma una URL base, y el atributo href de la URL, y lo determina como un navegador sería la etiqueta anchor (enlace).
