import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useSnackbar } from "notistack";
import DeleteForeverRounded from "@material-ui/icons/DeleteForeverRounded";
import SkeletonComponent from "../containers/components/skeleton.component";

import {
  fetchPostsStart,
} from "../redux/posts/posts.actions";

import {
  selectPostsData,
  selectPostsErrorMessage,
  selectPostsFetchStatus,
} from "../redux/posts/posts.selectors";

const posts = [];
const useStyles = makeStyles((theme) => ({
        card: {
            padding: theme.spacing(2),
        },
        grid: {
            padding: theme.spacing(2),
        }
    }));
    
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30
  }
};
 
// Because this is an inframe, so the SSR mode doesn't not do well here.
// It will work on real devices.
const Carousal = ({
    deviceType,
  fetchPostsStart,
  posts,
  clearPostMessages,
  errorMessage,
  isFetching,
}) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [pagePosts, setPagePosts] = useState([]);
    const [page, setPage] = useState(1);
    const [minimum, setMinimum] = useState(0);
    const [maximum, setMaximum] = useState(10);
  
    useEffect(() => {
        if (posts.length < 1) fetchPostsStart();
      }, [fetchPostsStart, posts]);

      useEffect(() => {
        if (errorMessage) {
          enqueueSnackbar(errorMessage, { variant: "error" });
          clearPostMessages();
        }
      }, [errorMessage, clearPostMessages, enqueueSnackbar]);

      useEffect(() => {
        setPagePosts(posts.slice(minimum, maximum));
      }, [page, isFetching, posts, minimum, maximum]);
  return (
          
    <Carousel
      ssr
      partialVisbile
      deviceType={deviceType}
      itemClass="image-item"
      responsive={responsive}
    >
        {pagePosts.length > 1 ? (
          pagePosts.map((each) => (
            <Grid className={classes.grid} item xs={10} sm={11} md={11} key={each.id}>
              <Paper className={classes.card} elevation={10}>
                <Typography variant="h5" component="h2">{each.title}</Typography>
                <Typography>{each.body}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <SkeletonComponent />
        )}
    </Carousel>
  );
};


const mapDispatchToProps = (dispatch) => ({
  fetchPostsStart: () => dispatch(fetchPostsStart())
});

const mapStateToProps = createStructuredSelector({
  posts: selectPostsData,
  isFetching: selectPostsFetchStatus,
  errorMessage: selectPostsErrorMessage,
});

export default connect(mapStateToProps, mapDispatchToProps)(Carousal);
