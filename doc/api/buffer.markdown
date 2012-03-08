# Buffer

    Stability: 3 - Stable

El puro Javascript es amigable con Unicode, pero no se lleva tan bien con 
los datos binarios. Cuando tratamos con streams TCP o ficheros del sistema,
es necesario manejar streams de octets. Node tiene algunas estrategias para
manipular, crear, y consumir streams de octets.

Los datos en Raw son almacenados en instancias de la clase `Buffer`. Un 
`Buffer` es similar a un array de integers pero correspondiendo a una localización
en raw de la memeria fuera del heap de V8. Un `Buffer` no puede ser redimencionado.

La clase `Buffer` es global, dado que es muy raro hacer un
`require('buffer')`.

Convertir entre Buffers y objectos String de Javascript requiere de un método de 
codificación explícito. Aquí están las diferentes cadenas de codificación.

* `'ascii'` - solo para datos de 7 bit ASCII. Este método de codificación es muy rápido
  y dejará el bit alto si está configurado.
  Note that this encoding converts a null character (`'\0'` or `'\u0000'`) into
  `0x20` (character code of a space). If you want to convert a null character
  into `0x00`, you should use `'utf8'`.

* `'utf8'` - Multiples bytes de caracteres con codificación Unicode. Muchas páginas webs y otros formatos de documentos usan UTF-8.

* `'ucs2'` - 2-bytes, de caracteres con codificación `little endian` Unicode. 
  Sólo pueden codificar BMP(Basic Multilingual Plane, U+0000 - U+FFFF).

* `'base64'` - String codificado a Base64.

* `'binary'` - Una forma de codificar datos binarios en Raw dentro de strings pero solo usando
  los primeros 8 bits de cada caracter. Este método de codificación es obsoleto y
  debe ser evitado en favor del objeto `Buffer` donde sea posible. Esta codificación
  será eliminada en futuras versiones de Node.

* `'hex'` - Encode each byte as two hexidecimal characters.

## Class: Buffer

The Buffer class is a global type for dealing with binary data directly.
It can be constructed in a variety of ways.

### new Buffer(size)

* `size` Number

Asigna un nuevo buffer de `size` octets.

### new Buffer(array)

* `array` Array

Asigna un nuevo buffer usando un `array` de octets.

### new Buffer(str, [encoding])

* `str` String - string to encode.
* `encoding` String - encoding to use, Optional.

Allocates a new buffer containing the given `str`.
`encoding` defaults to `'utf8'`.

### buf.write(string, [offset], [length], [encoding])

* `string` String - data to be written to buffer
* `offset` Number, Optional, Default: 0
* `length` Number, Optional
* `encoding` String, Optional, Default: 'utf8'

Escribe `string` en el Buffer en `offset` usando el método dado.
`offset` defaults to `0`, `encoding` defaults to `'utf8'`. `length` is
the number of bytes to write. Devuelve el número de octets escritos. Si `Buffer` 
no contiene suficiente espacio para encajar en el string completo, escribirá una
cantidad parcial de la cadena. `length` defaults to `buffer.length - offset`.
The method will not write partial characters.

    buf = new Buffer(256);
    len = buf.write('\u00bd + \u00bc = \u00be', 0);
    console.log(len + " bytes: " + buf.toString('utf8', 0, len));

The number of characters written (which may be different than the number of
bytes written) is set in `Buffer._charsWritten` and will be overwritten the
next time `buf.write()` is called.


### buf.toString([encoding], [start], [end])

* `encoding` String, Optional, Default: 'utf8'
* `start` Number, Optional, Default: 0
* `end` Number, Optional

Decodifica y devuelve un string con los datos de un buffer codificado con `encoding`
(por omisión en `'utf8'`) comenzando en `start` (por omisión `0`) y terminando en
`end` (por omisión `buffer.length`).

Observe el ejemplo de `buffer.write()`, encima.


### buf[index]

<!--type=property-->
<!--name=[index]-->

Obtiene y configura el octet en `index`. Los valores se refieren a bytes individuales,
por lo que el rango legal esta entre `0x00` and `0xFF` en hexadecimal o `0` y `255`.

Ejemplo: Copiando un cadena ASCII dentro de un buffer, un byte cada vez:

    str = "node.js";
    buf = new Buffer(str.length);

    for (var i = 0; i < str.length ; i++) {
      buf[i] = str.charCodeAt(i);
    }

    console.log(buf);

    // node.js

### Class Method: Buffer.isBuffer(obj)

* `obj` Object
* Return: Boolean

Comprueba si `obj` es un `Buffer`.

### Class Method: Buffer.byteLength(string, [encoding])

* `string` String
* `encoding` String, Optional, Default: 'utf8'
* Return: Number

Da la longitud de una cadena en bytes. `encoding` por omisión en `'utf8'`.
Esto no es lo mismo como `String.prototype.length` puesto que devuelve el
número de *caracteres* en el string.

Ejemplo:

    str = '\u00bd + \u00bc = \u00be';

    console.log(str + ": " + str.length + " characters, " +
      Buffer.byteLength(str, 'utf8') + " bytes");

    // ½ + ¼ = ¾: 9 characters, 12 bytes

### buf.length

* Number

El tamaño del buffer en bytes. Vea que esto no es necesariamente al tamaño
del contenido. `length` se refiere a la cantidad de memoria asignada para el
objeto buffer. No cambia cuando el contenido del buffer cambia.

    buf = new Buffer(1234);

    console.log(buf.length);
    buf.write("some string", "ascii", 0);
    console.log(buf.length);

    // 1234
    // 1234

### buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])

* `targetBuffer` Buffer object - Buffer to copy into
* `targetStart` Number, Optional, Default: 0
* `sourceStart` Number, Optional, Default: 0
* `sourceEnd` Number, Optional, Default: 0

Does copy between buffers. The source and target regions can be overlapped.
`targetStart` and `sourceStart` default to `0`.
`sourceEnd` defaults to `buffer.length`.

Ejemplo: construye dos Buffers, entonces copia `buf1` desde el byte 16 hasta el byte 19
dentro de `buf2`, comenzando en el octavo byte de `buf2`.

    buf1 = new Buffer(26);
    buf2 = new Buffer(26);

    for (var i = 0 ; i < 26 ; i++) {
      buf1[i] = i + 97; // 97 is ASCII a
      buf2[i] = 33; // ASCII !
    }

    buf1.copy(buf2, 8, 16, 20);
    console.log(buf2.toString('ascii', 0, 25));

    // !!!!!!!!qrst!!!!!!!!!!!!!


### buf.slice([start], [end])

* `start` Number, Optional, Default: 0
* `end` Number, Optional, Default: 0

Devuelve un nuevo buffer el cual hace referencia a la misma memoria que el antíguo,
pero desplazado y cortado por los indices `start` (por omisión `0`) and 
`end` (por omisión `buffer.length`).


**¡Al modificar el nuevo buffer, modificarás la memoria en el buffer original!**

Ejemplo: contruye un Buffer con el alfabeto ASCII, toma un fragmento, y 
entonces modifica un byte desde el Buffer original.

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

### buf.readUInt8(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads an unsigned 8 bit integer from the buffer at the specified offset.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Example:

    var buf = new Buffer(4);

    buf[0] = 0x3;
    buf[1] = 0x4;
    buf[2] = 0x23;
    buf[3] = 0x42;

    for (ii = 0; ii < buf.length; ii++) {
      console.log(buf.readUInt8(ii));
    }

    // 0x3
    // 0x4
    // 0x23
    // 0x42

### buf.readUInt16LE(offset, [noAssert])
### buf.readUInt16BE(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads an unsigned 16 bit integer from the buffer at the specified offset with
specified endian format.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Example:

    var buf = new Buffer(4);

    buf[0] = 0x3;
    buf[1] = 0x4;
    buf[2] = 0x23;
    buf[3] = 0x42;

    console.log(buf.readUInt16BE(0));
    console.log(buf.readUInt16LE(0));
    console.log(buf.readUInt16BE(1));
    console.log(buf.readUInt16LE(1));
    console.log(buf.readUInt16BE(2));
    console.log(buf.readUInt16LE(2));

    // 0x0304
    // 0x0403
    // 0x0423
    // 0x2304
    // 0x2342
    // 0x4223

### buf.readUInt32LE(offset, [noAssert])
### buf.readUInt32BE(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads an unsigned 32 bit integer from the buffer at the specified offset with
specified endian format.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Example:

    var buf = new Buffer(4);

    buf[0] = 0x3;
    buf[1] = 0x4;
    buf[2] = 0x23;
    buf[3] = 0x42;

    console.log(buf.readUInt32BE(0));
    console.log(buf.readUInt32LE(0));

    // 0x03042342
    // 0x42230403

### buf.readInt8(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads a signed 8 bit integer from the buffer at the specified offset.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Works as `buffer.readUInt8`, except buffer contents are treated as two's
complement signed values.

### buf.readInt16LE(offset, [noAssert])
### buf.readInt16BE(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads a signed 16 bit integer from the buffer at the specified offset with
specified endian format.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Works as `buffer.readUInt16*`, except buffer contents are treated as two's
complement signed values.

### buf.readInt32LE(offset, [noAssert])
### buf.readInt32BE(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads a signed 32 bit integer from the buffer at the specified offset with
specified endian format.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Works as `buffer.readUInt32*`, except buffer contents are treated as two's
complement signed values.

### buf.readFloatLE(offset, [noAssert])
### buf.readFloatBE(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads a 32 bit float from the buffer at the specified offset with specified
endian format.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Example:

    var buf = new Buffer(4);

    buf[0] = 0x00;
    buf[1] = 0x00;
    buf[2] = 0x80;
    buf[3] = 0x3f;

    console.log(buf.readFloatLE(0));

    // 0x01

### buf.readDoubleLE(offset, [noAssert])
### buf.readDoubleBE(offset, [noAssert])

* `offset` Number
* `noAssert` Boolean, Optional, Default: false
* Return: Number

Reads a 64 bit double from the buffer at the specified offset with specified
endian format.

Set `noAssert` to true to skip validation of `offset`. This means that `offset`
may be beyond the end of the buffer. Defaults to `false`.

Example:

    var buf = new Buffer(8);

    buf[0] = 0x55;
    buf[1] = 0x55;
    buf[2] = 0x55;
    buf[3] = 0x55;
    buf[4] = 0x55;
    buf[5] = 0x55;
    buf[6] = 0xd5;
    buf[7] = 0x3f;

    console.log(buf.readDoubleLE(0));

    // 0.3333333333333333

### buf.writeUInt8(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset. Note, `value` must be a
valid unsigned 8 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Example:

    var buf = new Buffer(4);
    buf.writeUInt8(0x3, 0);
    buf.writeUInt8(0x4, 1);
    buf.writeUInt8(0x23, 2);
    buf.writeUInt8(0x42, 3);

    console.log(buf);

    // <Buffer 03 04 23 42>

### buf.writeUInt16LE(value, offset, [noAssert])
### buf.writeUInt16BE(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset with specified endian
format. Note, `value` must be a valid unsigned 16 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Example:

    var buf = new Buffer(4);
    buf.writeUInt16BE(0xdead, 0);
    buf.writeUInt16BE(0xbeef, 2);

    console.log(buf);

    buf.writeUInt16LE(0xdead, 0);
    buf.writeUInt16LE(0xbeef, 2);

    console.log(buf);

    // <Buffer de ad be ef>
    // <Buffer ad de ef be>

### buf.writeUInt32LE(value, offset, [noAssert])
### buf.writeUInt32BE(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset with specified endian
format. Note, `value` must be a valid unsigned 32 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Example:

    var buf = new Buffer(4);
    buf.writeUInt32BE(0xfeedface, 0);

    console.log(buf);

    buf.writeUInt32LE(0xfeedface, 0);

    console.log(buf);

    // <Buffer fe ed fa ce>
    // <Buffer ce fa ed fe>

### buf.writeInt8(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset. Note, `value` must be a
valid signed 8 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Works as `buffer.writeUInt8`, except value is written out as a two's complement
signed integer into `buffer`.

### buf.writeInt16LE(value, offset, [noAssert])
### buf.writeInt16BE(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset with specified endian
format. Note, `value` must be a valid signed 16 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Works as `buffer.writeUInt16*`, except value is written out as a two's
complement signed integer into `buffer`.

### buf.writeInt32LE(value, offset, [noAssert])
### buf.writeInt32BE(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset with specified endian
format. Note, `value` must be a valid signed 32 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Works as `buffer.writeUInt32*`, except value is written out as a two's
complement signed integer into `buffer`.

### buf.writeFloatLE(value, offset, [noAssert])
### buf.writeFloatBE(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset with specified endian
format. Note, `value` must be a valid 32 bit float.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Example:

    var buf = new Buffer(4);
    buf.writeFloatBE(0xcafebabe, 0);

    console.log(buf);

    buf.writeFloatLE(0xcafebabe, 0);

    console.log(buf);

    // <Buffer 4f 4a fe bb>
    // <Buffer bb fe 4a 4f>

### buf.writeDoubleLE(value, offset, [noAssert])
### buf.writeDoubleBE(value, offset, [noAssert])

* `value` Number
* `offset` Number
* `noAssert` Boolean, Optional, Default: false

Writes `value` to the buffer at the specified offset with specified endian
format. Note, `value` must be a valid 64 bit double.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
should not be used unless you are certain of correctness. Defaults to `false`.

Example:

    var buf = new Buffer(8);
    buf.writeDoubleBE(0xdeadbeefcafebabe, 0);

    console.log(buf);

    buf.writeDoubleLE(0xdeadbeefcafebabe, 0);

    console.log(buf);

    // <Buffer 43 eb d5 b7 dd f9 5f d7>
    // <Buffer d7 5f f9 dd b7 d5 eb 43>

### buf.fill(value, [offset], [end])

* `value`
* `offset` Number, Optional
* `end` Number, Optional

Fills the buffer with the specified value. If the `offset` (defaults to `0`)
and `end` (defaults to `buffer.length`) are not given it will fill the entire
buffer.

    var b = new Buffer(50);
    b.fill("h");

## buffer.INSPECT_MAX_BYTES

* Number, Default: 50

How many bytes will be returned when `buffer.inspect()` is called. This can
be overridden by user modules.

Note that this is a property on the buffer module returned by
`require('buffer')`, not on the Buffer global, or a buffer instance.

## Class: SlowBuffer

This class is primarily for internal use.  JavaScript programs should
use Buffer instead of using SlowBuffer.

In order to avoid the overhead of allocating many C++ Buffer objects for
small blocks of memory in the lifetime of a server, Node allocates memory
in 8Kb (8192 byte) chunks.  If a buffer is smaller than this size, then it
will be backed by a parent SlowBuffer object.  If it is larger than this,
then Node will allocate a SlowBuffer slab for it directly.