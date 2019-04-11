const JSEncrypt = require('jsencrypt').JSEncrypt
import { RSA_KEY } from '../config'

export default function (data) {
  console.log(data)
  if (RSA_KEY && JSEncrypt && data && data.length > 0) {
    var s = data, reg = /.{117}/g, rs = s.match(reg) || []
    rs.push(s.substring(rs.join('').length))
    var splitstr3 = '833BB67DD7AA407A8C024ADF1283C843',
      result = '',
      jmresult = ''
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(RSA_KEY)
    for (var i = 0; i < rs.length; i++) {
      jmresult = encrypt.encrypt(rs[i])
      result += ((jmresult) + splitstr3)
    }
    data = 'data=' + encodeURIComponent(result)
  }
  return data
}
