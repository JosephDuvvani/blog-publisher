import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

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

const Signup = () => {
    const url = 'http://localhost:3000/auth/admin/signup';
    const navigate = useNavigate();
    const {user, setUser} = useContext(AuthContext);

    const [error, setError] = useState();

    if (user) navigate('/');

    function handleSubmit (e) {
        e.preventDefault();
        
        const _form = new FormData(e.target);
        let data = {};

        for (const [key, value] of _form.entries()) {
            data = {...data, [key]: value};
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                if (data.errors)
                    setError(data.errors[0]);
                else {
                    const cookies = new Cookies(null, {path: '/'});

                    cookies.set('jwt-access-blog-p', data.accessToken);
                    cookies.set('jwt-refresh-blog-p', data.refreshToken);

                    const decoded = jwtDecode(data.refreshToken);
                    setUser(decoded);
                    navigate('/');
                }
            })
    }

    return (
        <>
        {!user &&
            <Wrapper>
            <Form onSubmit={handleSubmit}>
                <Title>
                    <h2>Signup</h2>
                </Title>
                <Fields>
                    <input type="text" name="username" aria-label="Your username" placeholder="Your username" />
                    <input type="email" name="email" aria-label="Your email" placeholder="Your email" />
                    <input type="password" name="password" aria-label="Your password" placeholder="Your password" />
                    <input type="text" name="adpass" aria-label="Your admin passcode (adpass)"  placeholder="Your admin passcode (adpass)"/>
                    <button type="submit">Signup</button>
                </Fields>
                {error && 
                    <Error>{error.msg}</Error>
                }
            </Form>
        </Wrapper>}
        </>
    )
};

export default Signup;