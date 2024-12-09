import * as Yup from 'yup';
 
export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required!'),
  password: Yup.string().required("Pasword is required!")
});