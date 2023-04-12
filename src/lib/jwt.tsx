import jwt from "jsonwebtoken"

import { SignOptions } from "jsonwebtoken"

export function generateToken(payload: object | string | Buffer, options: SignOptions): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, process.env.NEXTAUTH_SECRET, options, (err, encoded) => {
      if (err) {
        return reject(err)
      }
      return resolve(encoded)
    })
  })
}

export function decodeToken(token: string): Promise<string | jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.NEXTAUTH_SECRET, (err: Error, decoded: any) => {
      if (err) {
        return reject(err)
      }
      return resolve(decoded)
    })
  })
}
