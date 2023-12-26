import axios from 'axios';

const url = "http://localhost:8080";

export const api =  axios.create({
  baseURL: url
});