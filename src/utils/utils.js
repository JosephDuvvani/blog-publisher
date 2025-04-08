import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const fetchToken = async (refreshJwt, url) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: refreshJwt,
    }),
  };

  const data = await (await fetch(url, options)).json();

  return data;
};

const getAccessToken = async () => {
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
        return accessToken;
}

const fetchAnyPost = async (postId, setLoading, setContent, setTitle, setCaption) => {
        const url = `http://localhost:3000/posts/${postId}/admin`;
        const accessToken = await getAccessToken();

        if (accessToken) {
            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    if (data.errors)
                        throw new Error(data.errors[0].msg);
                    else if (data.post) {
                        setLoading(false);
                        setContent(data.post.body);
                        setTitle(data.post.title);
                        setCaption(data.post.caption);
                    }
                })
        }
}

const updatePost = async (postId, setUpdating, title, caption, content, navigate) => {
  const url = `http://localhost:3000/posts/${postId}/edit`;
  const accessToken = await getAccessToken();

  if (accessToken) {
      const options = {
          method: 'PUT',
          headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            caption,
            body: content,
          })
      }

      fetch(url, options)
          .then(res => res.json())
          .then(data => {
              if (data.errors)
                  throw new Error(data.errors[0].msg);
              else if (data.updatedPost) {
                  setUpdating(false);
                  navigate('/');
              }
          })
  }
}

export { fetchToken, fetchAnyPost, updatePost };
