import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../App";
import Header from "../components/header";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import { fetchToken } from "../utils/utils";
import { jwtDecode } from "jwt-decode";
import PublishButton from "../components/publishButton";
import UnpublishButton from "../components/unpublishButton";

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
  padding: 0.75rem;
  border-radius: 6px;
  color: inherit;
  background-color: hsl(280, 43.8%, 83%);
  box-shadow: 0 3px 5px hsl(0, 0%, 0%, 0.3);

  &:hover {
    background-color: hsl(180, 43.8%, 83%);
  }
`;

const Login = styled(Button)`
  background-color: hsl(240, 43.8%, 83%);
`;

const Post = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  max-width: 50rem;
  margin: auto;
  padding: 1rem;
  box-shadow: 0 2px 4px -2px hsl(0, 0%, 0%, 0.2);
  border-radius: 6px;

  & .date {
    font-size: 0.9rem;
  }
`;

const PostTitle = styled.h1`
  margin: 0;
`;

const PostDate = styled.div`
  font-size: .9rem;
`;

const PostButtons = styled.div`
  grid-column: 2;
  grid-row: 1/3;
  align-self: center;
`;

const Home = () => {
  const { user, setUser, isLoadingUser } = useContext(AuthContext);
  const [posts, setPosts] = useState();

  useEffect(() => {
    const getPosts = async () => {
      const url = "http://localhost:3000/posts/admin";
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
                  <Post key={post.id}>
                    <PostTitle>{post.title}</PostTitle>
                    <PostDate>{format(post.createdAt, "MMMM d, yyyy")}</PostDate>
                    <PostButtons>
                      {post.published ?
                        <UnpublishButton postId={post.id} posts={posts} setPosts={setPosts} /> :
                        <PublishButton postId={post.id} posts={posts} setPosts={setPosts} />
                      }
                    </PostButtons>
                  </Post>
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