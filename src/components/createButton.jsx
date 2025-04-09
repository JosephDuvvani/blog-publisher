import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { fetchToken } from "../utils/utils";

const Button = styled.button`
    font-size: 1rem;
    padding: .4em 1em;
    margin-bottom: 2rem;
    border: none;
    color: hsl(180, 43.80%, 100%);
    background-color: hsl(280, 73.80%, 50%);
    border-radius: 4px;
    cursor: pointer;

    &:hover,
    &:focus {
        outline: none;
        background-color:hsl(280, 73%, 65%);
    }
`;

const CreateButton = ({ posts, setPosts }) => {
    const handlePublish = async (e) => {
        const url = `http://localhost:3000/posts`;
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
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    if (data.errors)
                        throw new Error(data.errors[0].msg);
                    else if (data.createdPost) {
                        const post = data.createdPost;
                        const newPosts = [post, ...posts]
                        setPosts(newPosts);
                    }
                })
        }
    }

    return (
        <Button onClick={handlePublish}>New Post</Button>
    )
}

export default CreateButton