## Cadena de consulta

Este módulo provee de utilidades para el tratamiento de cadenas de consultas.
Se ofrece los siguientes métodos:

### querystring.stringify(obj, sep='&', eq='=')

Serializa un objeto a una cadena de consulta.
Opcionalmente reemplaza el separador por omisión y la asignación de caracteres.

Ejemplo:

    querystring.stringify({foo: 'bar'})
    // devuelve
    'foo=bar'

    querystring.stringify({foo: 'bar', baz: 'bob'}, ';', ':')
    // devuelve
    'foo:bar;baz:bob'

### querystring.parse(str, sep='&', eq='=')

Deserializa una cadena de consulta a un objeto.
Opcionamente puede reemplazar el separador por omisión y asignar caracteres.

Ejemplo:

    querystring.parse('a=b&b=c')
    // returns
    { a: 'b', b: 'c' }

### querystring.escape

La función escape es usada por `querystring.stringify`,
para proporcionar reemplazos si es necesario.

### querystring.unescape

La función unescape es usada por `querystring.parse`,
para proporcionar reemplazos  si es necesario.
