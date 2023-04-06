import jwt from "jsonwebtoken"

export const generateToken = (data: any, options: any) => {
  return jwt.sign(data, process.env.NEXTAUTH_SECRET, options)
}

export const decodeToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.NEXTAUTH_SECRET, (err: Error, decoded: any) => {
      if (err) {
        return reject(err)
      }
      return resolve(decoded)
    })
  })
}
