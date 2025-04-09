import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../App";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import { fetchToken } from "../utils/utils";
import { jwtDecode } from "jwt-decode";
import PublishButton from "../components/publishButton";
import UnpublishButton from "../components/unpublishButton";
import DeleteButton from "../components/deleteButton";
import CreateButton from "../components/createButton";
import EditButton from "../components/editButton";

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
  margin-bottom: 3rem;
  padding: 1rem;

  & .date {
    font-size: 0.9rem;
  }
`;

const PostTitle = styled.h1`
  font-size: 2rem;
  margin-block: 0 1rem;
`;

const PostDate = styled.div`
  color: gray;
`;

const PostButtons = styled.div`
  display: flex;
  gap: .7rem;
`;

const Caption = styled.div`
  margin-block: .9rem 1.2rem;
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
    <>
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
          <CreateButton posts={posts} setPosts={setPosts} />
          {posts &&
            <>
              {posts.length === 0 &&
                <h4>No posts found</h4>
              }
              {posts.length > 0 && posts.map((post) => (
                <Post key={post.id}>
                  <PostTitle>{post.title}</PostTitle>
                  <PostDate>{format(post.createdAt, "MMMM d, yyyy")}</PostDate>
                  <Caption>{post.caption}</Caption>
                  <PostButtons>
                    <EditButton postId={post.id} />
                    {post.published ?
                      <UnpublishButton postId={post.id} posts={posts} setPosts={setPosts} /> :
                      <PublishButton postId={post.id} posts={posts} setPosts={setPosts} />
                    }
                    <DeleteButton postId={post.id} posts={posts} setPosts={setPosts} />
                  </PostButtons>
                </Post>
              ))}
            </>
          }
        </>
      }
    </>
  )
}

export default Home