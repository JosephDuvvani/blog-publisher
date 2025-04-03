import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../App";
import Cookies from "universal-cookie";

const Head = styled.header`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    max-width: 50rem;
    margin: auto;
    padding: 1rem;
`;

const Logo = styled.h1`
    display: block;
    width: fit-content;
    font-size: 1.5rem;
    font-weight: 500;
    color: #56bdbd;
    text-decoration: none;
    margin: 0;

    &:hover {
        text-decoration: underline;
    }
`;

const LogoLink = styled(Link)`
    color: inherit;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Buttons = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const Logout = styled.button`
    font-size: inherit;
    box-sizing: border-box;
    text-decoration: none;
    padding: .4rem .75rem;
    border-radius: 6px;
    color: inherit;
    background-color: transparent;
    border: 1px solid #56bdbd;
    cursor: pointer;

    &:hover {
        background-color:hsl(180, 43.80%, 83%);
    }
`;

const User = styled.div`
    display:  flex;
    border: 1px solid #56bdbd;
    border-radius: 6px;
`;

const Label = styled.span`
    display: inline-block;
    color: #fff;
    background-color: #56bdbd;
    padding: .4rem .75rem;
    box-sizing: border-box;
`;

const Name = styled.span`
    display: inline-block;
    padding: .4rem .75rem;
    box-sizing: border-box;
`;

const Header = () => {
    const {user, setUser} = useContext(AuthContext);
    const cookies = new Cookies(null, {path: '/'});
    const token = cookies.get('jwt-refresh-blog-p');

    function logout () {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        }

        fetch('http://localhost:3000/auth/logout', options)
            .then(res => res.json())
            .then(data => {
                setUser(null);
                cookies.remove('jwt-access-blog-p');
                cookies.remove('jwt-refresh-blog-p');
            })
    }

    return (
        <Head>
            <Logo>
                <LogoLink to={'/'}>TOP Blog</LogoLink>
            </Logo>
            {user &&
                <Buttons>
                    <User title={user.username}>
                        <Label>User</Label>
                        <Name>{user.username}</Name>
                    </User>
                    <Logout onClick={logout}>Logout</Logout>
                </Buttons>
            }
        </Head>
    )
}

export default Header;