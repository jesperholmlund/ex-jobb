import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (endpoint) => {
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
