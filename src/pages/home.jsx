import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../App";
import Header from "../components/header";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import { fetchToken } from "../utils/utils";
import { jwtDecode } from "jwt-decode";


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
  const [posts, setPosts] = useState();

  useEffect(() => {
    const getPosts = async () => {
      const url = "http://localhost:3000/posts/admin";
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
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
        
        fetch(url, options)
          .then(res => res.json())
          .then(data => {
            if (data.errors)
              throw new Error(data.errors[0].msg)
            else if (data.posts)
              setPosts(data.posts);
          })
      }
    }

    getPosts()
  }, [])

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
            <main>
                {posts && 
                  <>
                    {posts.length === 0 &&
                        <h4>No posts found</h4>
                    }
                    {posts.length > 0 && posts.map((post) => (
                        <div key={post.id}>
                        <header className="post">
                            <h2>{post.title}</h2>
                            <div>{format(post.createdAt, "MMMM d, yyyy")}</div>
                        </header>
                        </div>
                    ))}
                  </>
                }
            </main>
            </>
          }
      </Wrapper>
  )
}

export default Home