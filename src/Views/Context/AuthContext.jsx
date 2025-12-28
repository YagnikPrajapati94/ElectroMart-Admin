import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import AuthSerivce from "../Services/AuthService";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // const { setLoading, loading } = useCommon();

  const getMe = async () => {
    try {
      const result = await AuthSerivce.getMe();
      // console.log(result);
      if (result.data.success) {
        // setUser(result.data.data);
        setUser(result.data.data);
        setIsAuthenticated(true);
        setAuthChecking(false);
      }
    } catch (error) {
      setAuthChecking(false);
      console.log("Error While Getting User", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        getMe,
        authChecking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
