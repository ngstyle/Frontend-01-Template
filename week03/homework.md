1. 字符串和数字互转函数。

   ```javascript
   <script>
   
     function number2Str(number, radix = 10) {
       // number参数 均作为十进制处理
       if (radix < 2 || radix > 36) {
         throw new Error('radix argument must be between 2 and 36');
       }
   
       // 整数
       let integer = Math.trunc(number);
       // 直接减精度丢失 let franction = number - integer;
   
       // 将number 变为整数
       let oriNum = number;
       let exponent = 0;
       while (number !== Math.trunc(number)) {
         exponent++;
         number = oriNum * 10 ** exponent;
       }
   
       // 小数
       let franction = (number - integer * 10 ** exponent) / 10 ** exponent;
       let franction2 = number - integer * 10 ** exponent;
   
       // 去除尾部的0
       while (franction2 / 10 === Math.trunc(franction2 / 10)) {
         franction2 = franction2 / 10;
         exponent--;
       }
   
       console.log(`franction = ${franction}, exponent = ${exponent}`);
       console.log(`franction2 = ${franction2}, exponent = ${exponent}`);
   
       let result = '';
       while (integer > 0) {
         // 10进制以上需要处理 toString偷懒处理
         result = (integer % radix).toString(radix) + result;
         integer = Math.trunc(integer / radix);
       }
   
       if (franction !== 0) {
         result += '.';
   
         // 非十进制
         if (radix !== 10) {
           let count = 0;
           while (franction > 0) {
             let fi = Math.trunc(franction * radix);
             // 10进制以上需要处理 toString偷懒处理
             result += fi.toString(radix);
             franction = franction * radix - fi;
   
             // TODO 暂保留52位，需根据radix保留位数以及四舍五入
             if (++count === 52) {
               break;
             }
           }
         } else {
           // 十进制
           // let fstr = "";
           // while (franction2 > 0) {
           //   fstr = franction2 % radix + fstr;
           //   franction2 = Math.trunc(franction2 / radix);
           // }
           // result += fstr;
   
           while (exponent > 0) {
             if (exponent > 1) {
               result += Math.trunc(franction2 / radix ** (exponent - 1)) % radix;
             } else {
               result += franction2 % radix;
             }
             exponent--;
           }
         }
       }
   
       return result;
     }
   
   
     // 仅十进制param
     function str2Number(param, radix = 10) {
       let [mantissa, exponent] = param.split(/[eE][+]?/);
       if (exponent) {
         let mantissaStr = String(str2Number(mantissa) * 10 ** exponent);
         return str2Number(mantissaStr, radix);
       }
   
       let [intStr, fractionStr = ""] = param.split(".");
   
       // 整数
       // let result = [...intStr].map(v => v.codePointAt(0) - "0".codePointAt(0))
       //   .reduce((pre, curr, i, arr) => {
       //     // 16进制
       //     let r = pre + curr * (radix ** (arr.length - 1 - i));
       //     return r;
       //   }, 0);
   
       // if (fractionStr) {
       //   // 小数
       //   result += [...fractionStr].map(v => v.codePointAt(0) - "0".codePointAt(0))
       //     .reduce((pre, curr, i, arr) => {
       //       let r = pre + curr * (radix ** (-1 - i));
       //       return r;
       //     }, 0);
       // }
   
       let result = [...intStr, ...fractionStr]
         .map(v => v.codePointAt(0) - "0".codePointAt(0))
         .reduce((pre, curr, i, arr) => {
           return pre + curr * (radix ** (intStr.length - 1 - i));
         }, 0);
   
       return result;
     }
   </script>
   ```

   

2. 找出 JavaScript 标准里有哪些对象是我们无法实现出来的，都有哪些特性？

   [语句&对象]([https://github.com/ngstyle/Frontend-01-Template/blob/master/week03/%E8%A1%A8%E8%BE%BE%E5%BC%8F%26%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2.md](https://github.com/ngstyle/Frontend-01-Template/blob/master/week03/语句%26对象.md))