import axios from "axios";

const httpSurvey = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export default httpSurvey;
