// src/utils/stomp.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const createStompClient = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("accessToken");

  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_URL}/ws-stomp`),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
  });

  return client;
};
