## Crypto

Usa `require('crypto')` para acceder a este módulo.

El módulo crypto necesita que OpenSSL esté disponible en el sistema.
Ofrece una forma de encapsular credenciales seguras para ser usadas como parte de una red HTTPS segura o una conexión http.

Además ofrece un conjunto de envoltorios para los métodos hash, hmac, cipher, decipher, sign y verify de OpenSSL.

### crypto.createCredentials(details)

Crea un objeto credenciales, con los detalles opcionales en forma de diccionario con las 
siguientes claves:

* `key` : cadena que contiene la clave privada codificada en PEM.
* `cert` : cadena que contiene el certificado codificado en PEM.
* `ca` : cadena o lista de cadenas de certificados de confianza codificados en PEM.

Si no se han dado ningún elemento en `ca`, node.js usará la lista de CAs de confianza publicadas como dice en
<http://mxr.mozilla.org/mozilla/source/security/nss/lib/ckfw/builtins/certdata.txt>.


### crypto.createHash(algorithm)

Crea y devuelve un nuevo objeto hash, un hash criptográfico con el algoritmo dado que puede ser usado para generar el hash digests.

`algorithm` depende de los algoritmos disponibles en la versión de OpenSSL en el sistema. Algunos ejemplos son `'sha1'`, `'md5'`, `'sha256'`, `'sha512'`, etc. 
En versiones recientes, `openssl list-message-digest-algorithms` mostrará los algoritmos digest disponibles.

### hash.update(data)

Actualiza el contenido del hash con el `data` dado.
Esto puede ser invocado muchas veces con dato nuevo mientras estos van llegando.

### hash.digest(encoding='binary')

Calcula el digest todos los datos que van al hash.
La codificación (`encoding`) puede ser `'hex'`, `'binary'` o `'base64'`.

### crypto.createHmac(algorithm, key)

Crea y devuelve un objeto hmac, un hmac criptográfico con el algoritmo y la clave dadas.

`algorithm` depende de los algoritmos disponibles en la versión de OpenSSL en el sistema -  ver createHash arriba.
`key` es la clave hmac a usar.

### hmac.update(data)

Actualiza el contenido del hmac con el `data` dado.
Esto puede ser invocado muchas veces con dato nuevo mientras estos van llegando.

### hmac.digest(encoding='binary')

Calcula el digest (resumen) de todos los datos que van al hmac.
La codificación (`encoding`) puede ser `'hex'`, `'binary'` o `'base64'`.


### crypto.createCipher(algorithm, key)

Crea y devuelve un objeto cipher (codificador), con el algoritmo y la clave dadas.

`algorithm` es dependiente de OpenSSL, por ejemplo `'aes192'`, etc.
En versiones recientes, `openssl list-cipher-algorithms` mostrará los algoritmos cipher disponibles.

### cipher.update(data, input_encoding='binary', output_encoding='binary')

Actualiza el cipher con `data`, la codificación viene dada en `input_encoding` y puede ser `'utf8'`, `'ascii'` o `'binary'`. El `output_encoding` especifica el formato de la salida del dato codificado, y puede ser `'binary'`, `'base64'` o `'hex'`.

Devuelve el contenido codificado, y puede ser llamado muchas veces a medida que nuevos datos van llegando.

### cipher.final(output_encoding='binary')

Devuelve cualquier contenido codificado restante, donde `output_encoding` puede ser `'binary'`, `'ascii'` o `'utf8'`.

### crypto.createDecipher(algorithm, key)

Crea y devuelve un objeto decipher (decodificación), con el algoritmo y clave dado.
Este es el simétrico del objeto cipher (codificación) de arriba.

### decipher.update(data, input_encoding='binary', output_encoding='binary')

Actualiza el objeto decodificador con `data`, que puede estar codificado en `'binary'`, `'base64'` o `'hex'`.
El `output_decoding` especifica en qué formato devolver el texto plano decodificdo: `'binary'`, `'ascii'` o `'utf8'`.

### decipher.final(output_encoding='binary')

Devuelve el texto plano decodificado restante, siendo `output_encoding` `'binary'`, `'ascii'` o `'utf8'`.

### crypto.createSign(algorithm)

Crea y devuelve un objeto firma (signing) con el algoritmo dado.
En versiones recientes, `openssl list-public-key-algorithms` mostrará los algoritmos de firmado disponibles. Por ejemplo: `'RSA-SHA256'`.

### signer.update(data)

Actualiza el objeto firma con los datos dados.
Puede ser llamado muchas veces a medida que nuevos datos van llegando.

### signer.sign(private_key, output_format='binary')

Calcula la firma en todos los datos actualizados pasados a través del objetvo firma.
`private_key` es una cadena que contiene la clave privada para firmar codificada en PEM.

Devuelve la firma en `output_format` que puede estar en `'binary'`, `'hex'` o `'base64'`.

### crypto.createVerify(algorithm)

Crea y devuelve un objeto verificación con el algoritmo dado.
Este es el simétrico del objeto firma de arriba.

### verifier.update(data)

Actualiza el objeto verificador con los datos dados.
Puede ser llamado muchas veces a medida que nuevos datos van llegando.

### verifier.verify(cert, signature, signature_format='binary')

Verifica los datos firmados usando `cert`, que es una cadena que contiene la llave pública codificada en PEM; y `signature`, que es la firma del dato previamente calculada; `signature_format` puede ser `'binary'`, `'hex'` o `'base64'`.

Devuelve true o false dependiendo en la validez de la firma para el dato y la clave pública dadas.
