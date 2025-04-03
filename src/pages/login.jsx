import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
`;

const Form = styled.form`
    margin-top: 4rem;
    color: hsl(215, 13%, 34%);
`;

const Title = styled.div`
    max-width: 25rem;
    margin: auto;
    text-align: center;
    font-size: 1.5rem;
`;

const Fields = styled.div`
    display: grid;
    gap: 1rem;
    max-width: 25rem;
    margin: auto;
    
    & input {
        font-size: inherit;
        padding: .5rem;
        border-radius: 6px;
        border: 1px solid hsl(215, 17%, 40%);
        color: inherit;
    }
    
    & input:focus {
        outline: none;
    }

    & button {
        font-size: inherit;
        margin: auto;
        padding: .5rem 2rem;
        border-radius: 6px;
        border: 0;
        color: #fff;
        background-color: #56bdbd;
        cursor: pointer;
        transition: color 200ms ease-in-out, background 200ms ease-in-out;
    }

    & button:hover {
        color: inherit;
        background-color: hsl(180, 43.80%, 83%);
    }
`;

const Error = styled.div`
    max-width: 25rem;
    margin: auto;
    margin-top: 1rem;
    text-align: center;
    color: hsl(0, 55%, 50%);
`;

const Login = () => {
    const {user, setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const cookies = new Cookies(null, {path: '/'});

    useEffect(() => {
        if (cookies.get('jwt-refresh-blog')) navigate('/');
    }, []);

    const [error, setError] = useState();

    const emailRef = useRef();
    const pwdRef = useRef();

    const url = 'http://localhost:3000/auth/admin/login';

    function authenticate (e) {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailRef.current.value,
                password: pwdRef.current.value
            })

        }
        
        fetch(url, options)
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (data.errors) {
                    setError(data.errors[0]);
                } else {
                    const decoded = jwtDecode(data.accessToken);

                setUser(decoded);

                cookies.set('jwt-access-blog-p', data.accessToken, {
                    expires: new Date(decoded.exp * 1000),
                });
                cookies.set('jwt-refresh-blog-p', data.refreshToken);

                navigate('/');
                }
            })
    }

    return (
        <>
        {!user &&
            <Wrapper>
            <Form>
                <Title>
                    <h2>Login</h2>
                </Title>
                <Fields>
                    <input type="email" name="email" ref={emailRef} aria-label="Your email" placeholder="Your email" />
                    <input type="password" name="password" ref={pwdRef} aria-label="Your password" placeholder="Your password" />
                    <button onClick={authenticate}>Login</button>
                </Fields>
                {error && 
                    <Error>{error.msg}</Error>
                }
            </Form>
        </Wrapper>}
        </>
    )
};

export default Login;