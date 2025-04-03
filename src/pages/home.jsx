import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../App";
import Header from "../components/header";


const Wrapper = styled.div`
  min-height: 100svh;
  
`;

const Title = styled.h1`
  color: #56bdbd;
  max-width: fit-content;
  margin: auto;
  margin-block: 4rem;
`;

const Buttons = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 20rem;
  margin: auto;
`;

const Button = styled(Link)`
  display: block;
  box-sizing: border-box;
  font-size: 1.5rem;
  text-decoration: none;
  text-align: center;
  padding: .75rem;
  border-radius: 6px;
  color: inherit;
  background-color:hsl(280, 43.80%, 83%);
  box-shadow: 0 3px 5px hsl(0, 0%, 0%, 0.3);

  &:hover {
      background-color:hsl(180, 43.80%, 83%);
  }
`;

const Login = styled(Button)`
    background-color:hsl(240, 43.80%, 83%);
`;

const Home = () => {
  const {user, setUser, isLoadingUser} = useContext(AuthContext);

  return (
      <Wrapper>
          {!user && !isLoadingUser &&
            <>
            <Title>TOP Blog Publisher</Title>
            <Buttons>
                <Login to={'/auth/login'}>Login</Login>
                <Button to={'/auth/admin/signup'}>Signup</Button>
            </Buttons>
            </>
          }
          {user && 
            <>
            <Header />
            </>
          }
      </Wrapper>
  )
}

export default Home