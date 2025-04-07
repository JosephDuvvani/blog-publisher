import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { fetchToken } from "../utils/utils";

const Button = styled.button`
    font-size: .95rem;
    padding: 0;
    border: none;
    color: hsl(0, 63.80%, 43%);
    background-color: transparent;
    cursor: pointer;

    &:focus {
        outline: none;
        border-radius: 4px;
        background-color:hsl(180, 13%, 94%);
    }
`;

const DeleteButton = ({ postId, posts, setPosts }) => {
    const handlePublish = async (e) => {
        const url = `http://localhost:3000/posts/${postId}`;
        const cookies = new Cookies(null, { path: '/' });
        let accessToken = cookies.get('jwt-access-blog-p');
        const refreshToken = cookies.get('jwt-refresh-blog-p');

        if (!accessToken && refreshToken) {
            const tokenUrl = 'http://localhost:3000/auth/token'
            const data = await fetchToken(refreshToken, tokenUrl);

            if (data.accessToken) {
                const decoded = jwtDecode(data.accessToken);

                cookies.set('jwt-access-blog-p', data.accessToken, {
                    expires: new Date(decoded.exp * 1000),
                });

                accessToken = data.accessToken;
            }
        }

        if (accessToken) {
            const options = {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    if (data.errors)
                        throw new Error(data.errors[0].msg);

                    const newPosts = [...posts].filter(post => post.id !== postId);
                    setPosts(newPosts);
                })
        }
    }

    return (
        <Button onClick={handlePublish}>delete</Button>
    )
}

export default DeleteButton