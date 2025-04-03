import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

const body = document.getElementsByTagName('body');
body[0].style.fontFamily = 'Arial, Helvetica, sans-serif';
body[0].style.margin = 0;

export const AuthContext = createContext({});

function App() {
  const [user, setUser] = useState();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const cookies = new Cookies(null, {path: '/'});
    const token = cookies.get('jwt-refresh-blog-p');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
    setIsLoadingUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser, isLoadingUser}}>  
      <Outlet />
    </AuthContext.Provider>
  )
}

export default App
