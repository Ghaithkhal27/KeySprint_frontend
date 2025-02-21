import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  username: string;
  email: string;
}

const token = localStorage.getItem("token");
export let decodedToken: DecodedToken 

if (token) {
  try {
    decodedToken = jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token", error);
  }
}

;
