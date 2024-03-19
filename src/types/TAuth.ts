export type SignRes = {
  email: string;
  password: string;
}

export type SigUpReq = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}