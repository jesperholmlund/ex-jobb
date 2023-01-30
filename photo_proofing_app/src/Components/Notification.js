import { useState } from "react";
import useFetch from "./useFetch";
import { useLocation } from "react-router-dom";
import React from "react";

const Notfications = (props) => {
  const { data: albums, loading, error } = useFetch(`album/`);

  if (loading) {
    return <div className="loading"></div>;
  }
  if (error) {
    return <div>ERROR: {error}</div>;
  }

  return (
    <>
      {" "}
      <>d</>
    </>
  );
};

export default Notfications;
