import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Store/auth-context";

const useFetch = (endpoint) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  // eslint-disable-next-line no-restricted-globals
  if (location.hostname === "localhost") {
    axios.defaults.baseURL = "http://localhost:8000/api/";
  } else {
    axios.defaults.baseURL = "https://HEROKUPLACEHOLDER.COM/";
  }
  let axiosRequest = axios.create({
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get(endpoint);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        if (error) {
          if (error.response.status === 401) {
            authContext.logout();
            navigate("/login");
          }
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const refetch = async () => {
    try {
      const response = await axiosRequest.get(endpoint);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
export default useFetch;
