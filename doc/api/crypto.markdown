# Crypto

    Stability: 3 - Stable

Usa `require('crypto')` para acceder a este módulo.

El módulo crypto necesita que OpenSSL esté disponible en el sistema.
Ofrece una forma de encapsular credenciales seguras para ser usadas 
como parte de una red HTTPS segura o una conexión http.

Además ofrece un conjunto de envoltorios para los métodos hash, hmac, cipher, decipher, sign y verify de OpenSSL.

## crypto.createCredentials(details)

Crea un objeto credenciales, con los detalles opcionales en forma de diccionario con las siguientes claves:

* `key` : cadena que contiene la clave privada codificada en PEM.
* `passphrase` : cadena que contiene la passphrase de la clave privada.
* `cert` : cadena que contiene el certificado codificado en PEM.
* `ca` : cadena o lista de cadenas de certificados de confianza codificados en PEM.
* `crl` : una cadena o lista de cadenas de CRL (lista de revocación de certificados) codificados en formato PEM.
* `ciphers`: una cadena que especifica los algoritmos de cifrado que deben usarse o excluirse. Consulte
<http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT> para detalles relativos al formato

Si no se ha dado ningún elemento en `ca`, node.js usará la lista de CAs de confianza publicadas como dice en
<http://mxr.mozilla.org/mozilla/source/security/nss/lib/ckfw/builtins/certdata.txt>.


### crypto.createHash(algorithm)

Crea y devuelve un nuevo objeto hash, un hash criptográfico con el algoritmo 
dado que puede ser usado para generar el hash digests.

`algorithm` depende de los algoritmos disponibles en la versión de OpenSSL en el sistema.
Algunos ejemplos son `'sha1'`, `'md5'`, `'sha256'`, `'sha512'`, etc. 
En versiones recientes, `openssl list-message-digest-algorithms` mostrará los algoritmos digest disponibles.

Ejemplo: este programa calcula la suma sha1 de un fichero

    var filename = process.argv[2];
    var crypto = require('crypto');
    var fs = require('fs');

    var shasum = crypto.createHash('sha1');

    var s = fs.ReadStream(filename);
    s.on('data', function(d) {
      shasum.update(d);
    });

    s.on('end', function() {
      var d = shasum.digest('hex');
      console.log(d + '  ' + filename);
    });

## Class: Hash

Clase para calcular sumas hash de datos

Devuelto  por `crypto.createHash`.

### hash.update(data)

Actualiza el contenido del hash con el `data` dado. La codificación de este viene dada en
 `input_encoding` y puede ser `'utf8'`, `'ascii'` o `'binary'`.
Por defecto es `'binary'`.
Esto puede ser invocado muchas veces con dato nuevo mientras estos van llegando.

### hash.digest([encoding])

Calcula el digest todos los datos que van al hash.
La codificación (`encoding`) puede ser `'hex'`, `'binary'` o `'base64'`.
Por omisión es `'binary'`.

Nota: el objeto `hash` no puede ser usado después de haber invocado `digest()`.


### crypto.createHmac(algorithm, key)

Crea y devuelve un objeto hmac, un hmac criptográfico con el algoritmo y la clave dadas.

`algorithm` depende de los algoritmos disponibles en la versión de OpenSSL en el sistema -  ver createHash arriba.
`key` es la clave hmac a usar.

## Class: Hmac

Clase para crear contenidos autenticados mediante hmac.

Devuelto por `crypto.createHmac`.

### hmac.update(data)

Actualiza el contenido del hmac con el `data` dado.
Esto puede ser invocado muchas veces con dato nuevo mientras estos van llegando.

### hmac.digest(encoding='binary')

Calcula el digest (resumen) de todos los datos que van al hmac.
La codificación (`encoding`) puede ser `'hex'`, `'binary'` o `'base64'`.
Por omisíón es `'binary'`.

Nota: El objeto `hmac` no puede ser usado tras la llamada a `digest()`.


### crypto.createCipher(algorithm, key)

Crea y devuelve un objeto cipher (codificador), con el algoritmo y la clave dadas.

`algorithm` es dependiente de OpenSSL, por ejemplo `'aes192'`, etc.
En versiones recientes, `openssl list-cipher-algorithms` mostrará 
los algoritmos cipher disponibles.
`password` se usa para derivar la clave y el IV (vector de inicialización), debe ser una cadena de texto codificada en  `'binary'` 
(consulta [Buffer section](buffer.html) para más información).

## crypto.createCipheriv(algorithm, key, iv)

Crea y obtiene un objeto de cifrado configurado con el algoritmo dado, clave e IV.

`algorithm` es el mismo que `createCipher()`. `key` es la clave usada por 
el algoritmo. `iv` es el vector de inicialización. `key` e `iv` deben ser cadenas de texto codificadas como `'binary'`
(Consulta [Buffer section](buffer.html) para más información).

## Class: Cipher

Clase para encriptar datos.

Devuelto por `crypto.createCipher` y `crypto.createCipheriv`.

### cipher.update(data, [input_encoding], [output_encoding])

Actualiza el cipher con `data`, la codificación viene dada en 
`input_encoding` y puede ser `'utf8'`, `'ascii'` o `'binary'`. 
Por omisión `'binary'`. 

El `output_encoding` especifica el formato de la salida del dato codificado,
y puede ser `'binary'`, `'base64'` o `'hex'`. Por omisión `'binary'`.

Devuelve el contenido codificado, y puede ser llamado muchas veces a medida que nuevos datos van llegando.

### cipher.final([output_encoding])

Devuelve cualquier contenido codificado restante, donde `output_encoding` puede ser:
`'binary'`, `'base64'` o `'hex'`. Por omisión `'binary'`.

Nota: El objeto `cipher` no puede ser usado tras la llamada a `final()`.

### cipher.setAutoPadding(auto_padding=true)

Puede deshabilitar el relleno (padding) automático. Si `auto_padding` se establece en false,
el tamaño de los datos a cifrar debe ser múltiplo del tamaño del bloque de cifrado. De lo contrario `final` fallará.
Es útil si desea utilizar un relleno no estándar, p.e. `0x0` en vez de PKCS. Debe invocarlo antes que a `cipher.final`.


### crypto.createDecipher(algorithm, key)

Crea y devuelve un objeto decipher (decodificación), con el algoritmo y clave dado.
Este es el simétrico del objeto cipher (codificación) de arriba.

### decipher.update(data, input_encoding='binary', output_encoding='binary')

Actualiza el objeto decodificador con `data`, que puede estar codificado en `'binary'`, `'base64'` o `'hex'`.
El `output_decoding` especifica en qué formato devolver el texto plano decodificdo: `'binary'`, `'ascii'` o `'utf8'`.

## Class: Decipher

Clase para decodificar datos

Devuelto por `crypto.createDecipher` y `crypto.createDecipheriv`.

### decipher.update(data, [input_encoding], [output_encoding])

Actualiza el descifrador con los datos (`'data'`) suministrados, que
habrán sido codificados en `'binary'`, `'base64'` o `'hex'`. Por defecto `'binary'`.

`output_decoding` especifica en que codificación debe retornarse el texto descifrado. 
Esta puede ser: `'binary'`, `'ascii'` o `'utf8'`. Por defecto `'binary'`.

### decipher.final([output_encoding])

Devuelve el texto plano decodificado restante, siendo
`output_encoding` `'binary'`, `'ascii'` o `'utf8'`.
Por omisión `'binary'`.

Nota: El objeto `decipher` no podrá ser usado tras la llamada a `final()`.

### decipher.setAutoPadding(auto_padding=true)

Puede desactivar el relleno automático si los datos fueron cifrados sin un relleno de bloque estándar.
Con esto previene que `decipher.final` chequee y elimine el relleno. 
Solo puede funcionar si el tamaño de los datos es múltiplo del tamaño del bloque de cifrado.
Debe invocar esta función antes de enviar datos a `decipher.update`.

## crypto.createSign(algorithm)

Crea y devuelve un objeto firma (signing) con el algoritmo dado.
En versiones recientes, `openssl list-public-key-algorithms` muestra
los algoritmos de firmado disponibles. Por ejemplo: `'RSA-SHA256'`

## Class: Signer

Clase para generar firmas.

Devuelto por `crypto.createSign`.

### signer.update(data)

Actualiza el objeto firma con los datos dados.
Puede ser llamado muchas veces a medida que nuevos datos van llegando.

### signer.sign(private_key, output_format='binary')

Calcula la firma en todos los datos actualizados pasados a través del objeto firma.
`private_key` es una cadena que contiene la clave privada para firmar codificada en PEM.

Devuelve la firma en `output_format` que puede estar en `'binary'`, `'hex'` o 
`'base64'`. Por omisión `'binary'`.

Nota: El objeto `signer` no puede usarse tras la llamada a `sign()`.

### crypto.createVerify(algorithm)

Crea y devuelve un objeto verificación con el algoritmo dado.
Este es el simétrico del objeto firma de arriba.

## Class: Verify

Class for verifying signatures.

Returned by `crypto.createVerify`.

### verifier.update(data)

Actualiza el objeto verificador con los datos dados.
Puede ser llamado muchas veces a medida que nuevos datos van llegando.

### verifier.verify(cert, signature, signature_format='binary')

Verifica los datos firmados usando `cert`, que es una cadena que contiene la llave pública codificada en PEM; y `signature`, que es la firma del dato previamente calculada; `signature_format` puede ser `'binary'`, `'hex'` o `'base64'`.

Devuelve true o false dependiendo en la validez de la firma para el dato y la clave pública dadas.

Nota: El objeto `verifier` no debe usarse tras la llamada a `verify()`.

## crypto.createDiffieHellman(prime_length)

Crea un objeto para el intercambio de claves mediante el protocolo criptográfico Diffie-Hellman 
y genera un número primo con la longitud de bits indicada en `prime_length`.
El generador usado es `2`.

## crypto.createDiffieHellman(prime, [encoding])

Crea un objeto para el intercambio de claves mediante el protocolo criptográfico Diffie-Hellman 
usando el número primo suministrado.
El generador usado es `2`.
La codificación puede ser `'binary'`, `'hex'`, o `'base64'`.
Por defecto `'binary'`.

## Class: DiffieHellman

Clase para crear intercambios de clave mediante el protocolo criptográfico Diffie-Hellman

Devuelto por `crypto.createDiffieHellman`.

### diffieHellman.generateKeys([encoding])

Genera claves Diffie-Hellman, pública y privada, y devuelve la clave pública con la codificación especificada.
Esta clave debe ser transferida a la otra parte —la otra persona, máquina, etc.
La codificación puede ser `'binary'`, `'hex'`, o `'base64'`.
Por defecto `'binary'`.

### diffieHellman.computeSecret(other_public_key, [input_encoding], [output_encoding])

Computa el secreto compartido sirviéndose de la clave pública (`other_public_key`) del emisor del mensaje 
y devuelve el valor ya computado del secreto compartido.
La clave suministrada es interpretada usando la codificación especificada en `input_encoding`.
Para el secreto se usa la especificada en `output_encoding`.

Las codificaciones admitidas son: `'binary'`, `'hex'`, o `'base64'`.
La codificación por omisión para `input_encoding` es `'binary'`.
Si no se especifica una codificación para `output_encoding` se usará la misma que para `input_encoding`.

### diffieHellman.getPrime([encoding])

Devuelve el primo Diffie-Hellman en la codificación especificada que puede ser
`'binary'`, `'hex'`, o `'base64'`. Por defecto `'binary'`.

### diffieHellman.getGenerator([encoding])

Devuelve el primo Diffie-Hellman en la codificación especificada que puede ser
`'binary'`, `'hex'`, o `'base64'`. Por defecto `'binary'`.

### diffieHellman.getPublicKey([encoding])

Devuelve la clave pública Diffie-Hellman en la codificación especificada que puede ser
`'binary'`, `'hex'`, o `'base64'`. Por defecto `'binary'`.

### diffieHellman.getPrivateKey([encoding])

Devuelve la clave privada Diffie-Hellman en la codificación especificada que puede ser
`'binary'`, `'hex'`, o `'base64'`. Por defecto `'binary'`.

### diffieHellman.setPublicKey(public_key, [encoding])

Establece la clave pública Diffie-Hellman en la codificación especificada que puede ser
`'binary'`, `'hex'`, o `'base64'`. Por defecto `'binary'`.

### diffieHellman.setPrivateKey(public_key, [encoding])

Establece la clave privada Diffie-Hellman en la codificación especificada que puede ser
`'binary'`, `'hex'`, o `'base64'`. Por defecto `'binary'`.

## crypto.getDiffieHellman(group_name)
Crea un objeto predefinido Diffie-Hellman para el intercambio de claves.
Los grupos soportados son: `'modp1'`, `'modp2'`, `'modp5'`
(definidos en el [RFC 2412](http://www.rfc-editor.org/rfc/rfc2412.txt ))
y `'modp14'`, `'modp15'`, `'modp16'`, `'modp17'`, `'modp18'`
(definidos en el [RFC 3526](http://www.rfc-editor.org/rfc/rfc3526.txt )).
El objeto devuelto tiene la misma interfaz que los objetos creados mediante

[crypto.createDiffieHellman()](#crypto.createDiffieHellman), pero no permitirá
el cambio de claves (mediante
[diffieHellman.setPublicKey()](#diffieHellman.setPublicKey) por ejemplo).
La ventaja de usar esta rutina radica en que las partes no tienen que generar ni 
intercambiar el grupo de antemano, ahorrándose ambos tanto tiempo de proceso como de comunicación.

Ejemplo (obteniendo un secreto compartido):

    var crypto = require('crypto');
    var alice = crypto.getDiffieHellman('modp5');
    var bob = crypto.getDiffieHellman('modp5');

    alice.generateKeys();
    bob.generateKeys();

    var alice_secret = alice.computeSecret(bob.getPublicKey(), 'binary', 'hex');
    var bob_secret = bob.computeSecret(alice.getPublicKey(), 'binary', 'hex');

    /* alice_secret y bob_secret deben ser iguales */
    console.log(alice_secret == bob_secret);

## crypto.pbkdf2(password, salt, iterations, keylen, callback)

El (asíncrono) PBKDF2 aplica una función pseudoaleatoria HMAC-SHA1 para derivar una clave, con 
la longitud dada para el `password` suministrado, valor salt e iteraciones.
El callback recibe dos argumentos `(err, derivedKey)`.

## crypto.randomBytes(size, [callback])

Genera números pseudoaleatorios. Criptográficamente fuerte. Uso:

    // async
    crypto.randomBytes(256, function(ex, buf) {
      if (ex) throw ex;
      console.log('Have %d bytes of random data: %s', buf.length, buf);
    });

    // sync
    try {
      var buf = crypto.randomBytes(256);
      console.log('Have %d bytes of random data: %s', buf.length, buf);
    } catch (ex) {
      // handle error
    }
