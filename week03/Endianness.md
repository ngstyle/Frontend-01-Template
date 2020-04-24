# Endianness

The current behaviour, is determined by the endianness of the underlying hardware. As almost all desktop computers are x86, this means little-endian. Most ARM OSes use little-endian mode (ARM processors are bi-endian and thus can operate in either).

The reason why this is somewhat sad is the fact that it means almost nobody will test whether their code works on big-endian hardware, hurting what does, and the fact that the entire web platform was designed around code working uniformly across implementations and platforms, which this breaks.

you can use the following javascript function to determine the endianness of the machine, after which you can pass an appropriately formatted file to the client (you can store two versions of the file on server, big endian and little endian):

```javascript
function checkEndian() {
    var arrayBuffer = new ArrayBuffer(2);
    var uint8Array = new Uint8Array(arrayBuffer);
    var uint16array = new Uint16Array(arrayBuffer);
    uint8Array[0] = 0xAA; // set first byte
    uint8Array[1] = 0xBB; // set second byte
    if(uint16array[0] === 0xBBAA) return "little endian";
    if(uint16array[0] === 0xAABB) return "big endian";
    else throw new Error("Something crazy just happened");
}
```



JS 查看数字在内存中分布:

```javascript
	function isLittleEndian() {
    var arrayBuffer = new ArrayBuffer(2);
    var uint8Array = new Uint8Array(arrayBuffer);
    var uint16array = new Uint16Array(arrayBuffer);
    uint8Array[0] = 0xAA; // set first byte
    uint8Array[1] = 0xBB; // set second byte
    if (uint16array[0] === 0xBBAA) {
      console.log("little endian");
      return true;
    } else if (uint16array[0] === 0xAABB) {
      console.log("little endian");
      return false;
    } else throw new Error("Something crazy just happened");
  }

  function viewNumberInMem(number) {
    if (!number || isNaN(number)) {
      throw new Error("Param isNaN");
    }

    let bits = [];
    const bytes = new Uint8Array(8);
    const memory = new Float64Array(bytes.buffer);
    memory[0] = (number);
    console.log("******");

    // 小端序转大端序
    if (isLittleEndian()) {
      bytes.reverse();
    }

    for (var i = 0; i < 8; i++) {
      var byte = bytes[i]
      for (var j = 0; j < 8; j++) {
        bits[i * 8 + j] = byte >> (7 - j) & 1;
      }
    }

    return bits;
  }
```



> [理解字节序](https://www.ruanyifeng.com/blog/2016/11/byte-order.html)
>
> [Javascript Typed Arrays and Endianness](https://stackoverflow.com/questions/7869752/javascript-typed-arrays-and-endianness)

