import * as Yup from 'yup';
 
export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!').required('Name is required')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
  .required('No password provided.') 
  .min(8, 'Password should be 8 chars minimum.')
  .matches(/[a-zA-Z1-9@_-]/g, 'Password can only contain uppercase, lowercase, @, _ and -.'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
});