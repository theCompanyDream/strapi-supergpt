import React from "react";

import { Box, Typography } from "@strapi/design-system";

const style = {
  wordBreak: "keep-all",
};

function transfromBotText(message) {
    // If Url return render Img
  if (Array.isArray(message)){
    return (<Typography style={style}>ChatGPT: <a href={message[1]}>Picture Link</a>
    <br />
    <img src={message[0]} height={300} width={350} />
    </Typography>)
  }

  return (<Typography style={style}>ChatGPT: {message}</Typography>)

}

const Response = ({ data }) => {
  if (!data || !data.you || !data.bot) return null;

  return (
    <Box>
      <span>
        <Typography style={style}>You: {data.you}</Typography>
      </span>
      <br />
      <span>
        <br/>{transfromBotText(data.bot)}
      </span>
    </Box>
  );
};

export default Response;
