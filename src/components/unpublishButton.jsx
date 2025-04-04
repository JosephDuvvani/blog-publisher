import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { fetchToken } from "../utils/utils";

const Button = styled.button`
    font-size: .95rem;
    padding: .25em .75em;
    border: none;
    background-color:hsl(180, 43.80%, 83%);
    cursor: pointer;

    &:hover {
        background-color:hsl(280, 43.80%, 83%);
    }
`;

const UnpublishButton = ({postId, posts, setPosts}) => {
    const handlePublish = async (e) => {
        const url = `http://localhost:3000/posts/${postId}/unpublish`;
        const cookies = new Cookies(null, {path: '/'});
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
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    if (data.errors)
                        throw new Error(data.errors[0].msg);

                    const newPosts = [...posts].map(post => {
                        if (post.id === postId) 
                            return {...post, published: false}
                        return post;
                    });
                    setPosts(newPosts);
                })
        }
    }

    return (
        <Button onClick={handlePublish}>unpublish</Button>
    )
}

export default UnpublishButton