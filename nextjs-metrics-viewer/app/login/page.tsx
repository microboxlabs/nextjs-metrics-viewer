import LoginForm from "./loginForm"
import CSS from "csstype";
import NavbarLessLayout from "./layout";

export default function Login() {

  const loginStyle: CSS.Properties = {
    display: 'grid',
    placeItems: 'center',
    height: '100vh'
  };

  return (
    <NavbarLessLayout>
      <div style={loginStyle}>
        <LoginForm/>
      </div>
    </NavbarLessLayout>
  )
}
