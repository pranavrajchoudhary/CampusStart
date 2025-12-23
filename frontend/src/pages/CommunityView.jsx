import React from "react";
import { Box, Container } from "@mui/material";
import PostCards from "../assets/compo/PostCards";
import CreatePost from "../assets/compo/CreatePost";

const CommunityView = () => {
  const [refresh, setRefresh] = React.useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 980 }}>

          {/* ⭐ LinkedIn-style Create Post */}
          <CreatePost onPostCreated={() => setRefresh(!refresh)} />

          {/* Posts */}
          <PostCards key={refresh} />

        </Box>
      </Box>
    </Container>
  );
};

export default CommunityView;
