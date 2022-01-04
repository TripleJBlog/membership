import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);
  return <div>시작 페이지</div>;
}

export default LandingPage;
