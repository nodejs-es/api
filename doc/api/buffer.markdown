## Buffers

El puro Javascript es amigable con Unicode, pero no se lleva tan bien con los datos binarios. Cuando tratamos con streams TCP o ficheros del sistema, es necesario manejar streams de octets. Node tiene algunas estrategias para manipular, crear, y consumir streams de octets.

Los datos en Raw son almacenados en instancias de la clase `Buffer`. Un `Buffer` es similar a un array de integers pero correspondiendo a una localización en raw de la memeria fuera del heap de V8. Un `Buffer` no puede ser redimencionado.

El objeto `Buffer` es global.

Convertir entre Buffers y objectos String de Javascript requiere de un método de codificación explícito. Aquí están las diferentes cadenas de codificación;

* `'ascii'` - solo para datos de 7 bit ASCII. Este método de codificación es muy rápido, y dejará el bit alto si está configurado.

* `'utf-8'` - Multiples bytes de caracteres con codificación Unicode. Muchas páginas webs y otros formatos de documentos usan UTF-8.

* `'usc2'` - 2-bytes, de caracteres con codificación `little endian` Unicode. Sólo pueden codificar BMP(Basic Multilingual Plane, U+0000 - U+FFFF).

* `'base64'` - Cadena codificada en Base64.

* `'binary'` - Una forma de codificar datos binarios en Raw dentro de cadenas pero solo usando los primeros 8 bits de cada caracter. Este método de codificación es obsoleto y debe ser evitado en favor del objeto `Buffer` donde sea posible. Esta codificación será eliminada en futuras versiones de Node.

### new Buffer(size)

Asigna un nuevo buffer de `size` octets.

### new Buffer(array)

Asigna un nuevo buffer usando un `array` de octets.

### new Buffer(str, encoding='utf8')

Asigna un nuevo buffer conteniendo el `str` dado.

### buffer.write(string, offset=0, encoding='utf8')

Escribe `string` en el Buffer en `offset` usando el método dado. Devuelve el número de octets escritos. Si `Buffer` no contiene suficiente espacio para encajar la cadena entera, escribirá una cantidad parcial de la cadena. En caso de codificación `utf8`, el método no escribirá caracteres parciales.

Ejemplo: Escribe una cadena utf8 dentro de un buffer, y entonces lo imprime por pantalla:

    buf = new Buffer(256);
    len = buf.write('\u00bd + \u00bc = \u00be', 0);
    console.log(len + " bytes: " + buf.toString('utf8', 0, len));

    // 12 bytes: ½ + ¼ = ¾


### buffer.toString(encoding, start=0, end=buffer.length)

Decodifica y devuelve un cadena con los datos de un buffer codificado con `encoding` comenzando en `start` y terminando en `end`.

Mira el ejemplo de`buffer.write()`, arriba.

### buffer[index]

Obtiene y configura el octet en `index`. Los valores se refieren a bytes individuales, por lo que el rango legal esta entre `0x00` and `0xFF` en hexadecimal o `0` y `255`.

Ejemplo: Copiando un cadena ASCII dentro de un buffer, un byte cada vez:

    str = "node.js";
    buf = new Buffer(str.length);

    for (var i = 0; i < str.length ; i++) {
      buf[i] = str.charCodeAt(i);
    }

    console.log(buf);

    // node.js

### Buffer.isBuffer(obj)

Comprueba si `obj` es un `Buffer`.

### Buffer.byteLength(string, encoding='utf8')

Da la longitud de una cadena en bytes. Esto no es más que `string.prototype.length` puesto que devuelve el número de *caracteres* en la cadena.

Ejemplo:

    str = '\u00bd + \u00bc = \u00be';

    console.log(str + ": " + str.length + " characters, " +
      Buffer.byteLength(str, 'utf8') + " bytes");

    // ½ + ¼ = ¾: 9 characters, 12 bytes


### buffer.length

El tamaño del buffer en bytes. Advierta que esto no es necesariamente el contenido. `length` se refiere a la cantidad de memoria asignada para el objeto buffer. No cambia cuando el contenido del buffer cambia.

    buf = new Buffer(1234);

    console.log(buf.length);
    buf.write("some string", "ascii", 0);
    console.log(buf.length);

    // 1234
    // 1234

### buffer.copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)

Hace un memcpy() entre Buffers.

Ejemplo: construye dos Buffers, entonces copia `buf1` desde el byte 16 hasta el byte 19 dentro de `buf2`, comenzando en el octavo byte de `buf2`.

    buf1 = new Buffer(26);
    buf2 = new Buffer(26);

    for (var i = 0 ; i < 26 ; i++) {
      buf1[i] = i + 97; // 97 is ASCII a
      buf2[i] = 33; // ASCII !
    }

    buf1.copy(buf2, 8, 16, 20);
    console.log(buf2.toString('ascii', 0, 25));

    // !!!!!!!!qrst!!!!!!!!!!!!!


### buffer.slice(start, end=buffer.length)

Devuelve un nuevo buffer el cual hace referencia a la misma memoria que el antíguo, pero desplazado y cortado por los indices `start` y `end`.

**¡Al modificar el nuevo buffer, modificarás la memoria en el buffer original!**

Ejemplo: contruye un Buffer con el alfabeto ASCII, toma un fragmento, y entonces modifica un byte desde el Buffer original.

    var buf1 = new Buffer(26);

    for (var i = 0 ; i < 26 ; i++) {
      buf1[i] = i + 97; // 97 is ASCII a
    }

    var buf2 = buf1.slice(0, 3);
    console.log(buf2.toString('ascii', 0, buf2.length));
    buf1[0] = 33;
    console.log(buf2.toString('ascii', 0, buf2.length));

    // abc
    // !bc
