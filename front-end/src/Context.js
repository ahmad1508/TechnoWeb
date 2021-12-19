import React, { useState, useMemo } from "react";
import { useCookies } from "react-cookie";

const Context = React.createContext();

export default Context;

export const Provider = ({ children }) => {
  const defaultColor = "#f44336";
  const [primaryColor, setPrimaryColor] = React.useState(defaultColor);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [oauth, setOauth] = useState(cookies.oauth);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [user, setUser] = useState();
  const [mode, setMode] = useState("light");

  return (
    <Context.Provider
      value={{
        oauth: oauth,
        setOauth: (oauth) => {
          if (oauth) {
            const payload = JSON.parse(
              Buffer.from(oauth.id_token.split(".")[1], "base64").toString(
                "utf-8"
              )
            );
            oauth.email = payload.email;
            setCookie("oauth", oauth);
          } else {
            setCurrentChannel(null);
            setChannels([]);
            removeCookie("oauth");
          }
          setOauth(oauth);
        },
        channels: channels,
        drawerVisible: drawerVisible,
        setDrawerVisible: setDrawerVisible,
        setChannels: setChannels,
        currentChannel: currentChannel,
        setCurrentChannel: (channelId) => {
          const channel = channels.find((channel) => channel.id === channelId);
          setCurrentChannel(channel);
        },
        user: user,
        setUser: setUser,
        mode: mode,
        setMode: setMode,
        primaryColor: primaryColor,
        setPrimaryColor: setPrimaryColor,
      }}
    >
      {children}
    </Context.Provider>
  );
};
