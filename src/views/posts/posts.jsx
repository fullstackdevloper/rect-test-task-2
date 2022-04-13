import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  fetchPostsStart,
  deletePostStart,
} from "../../redux/posts/posts.actions";
import { connect } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import TransitionsModal from "../../containers/posts/components/edit-modal";
import AddItemModal from "../../containers/posts/components/add-modal";
import DeleteForeverRounded from "@material-ui/icons/DeleteForeverRounded";
import blue from "@material-ui/core/colors/blue";
import SkeletonComponent from "../../containers/components/skeleton.component";
import { useSnackbar } from "notistack";
import { createStructuredSelector } from "reselect";
import {
  selectPostsData,
  selectPostsErrorMessage,
  selectPostsFetchStatus,
} from "../../redux/posts/posts.selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  postImage: {
    height: "20vmin",
    pointerEvents: "none",
  },
  card: {
    padding: theme.spacing(2),
    position: "relative",
  },
  delete: {
    position: "absolute",
    top: "10px",
    left: "10px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginLeft: "auto",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  length: {
    fontSize: "16px",
    color: blue,
  },
}));

const PostContainer = ({
  fetchPostsStart,
  deletePostStart,
  posts,
  clearPostMessages,
  errorMessage,
  isFetching,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMaximum] = useState(9);
  const [pagePosts, setPagePosts] = useState([]);
  const classes = useStyles();
  const count = Math.ceil(posts.length / 9);

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

  const handleChange = (event, value) => {
    setPage(value);
    setMinimum((value - 1) * 9);
    setMaximum(value * 9);
  };

  return (
    <Box className={classes.root}>
      <Typography variant={"h2"} component={"h1"}>
        Posts
      </Typography>
      <AddItemModal />

      <Grid container justifyContent={"flex-start"} alignItems={"flex-start"} spacing={3}>
        {pagePosts.length > 1 ? (
          pagePosts.map((each) => (
            <Grid item xs={10} sm={5} md={4} key={each.id}>
              <Paper className={classes.card} elevation={10}>
                <DeleteForeverRounded
                  color={"primary"}
                  className={classes.delete}
                  onClick={() => deletePostStart(each.id)}
                />
                <Typography variant="h5" component="h2">{each.title}</Typography>
                <Typography>{each.body}</Typography>
                <Box>
                  <TransitionsModal key={each.id} post={each} />
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <SkeletonComponent />
        )}
      </Grid>
      <Pagination
        count={count}
        page={page}
        onChange={handleChange}
        className={classes.pagination}
        color="primary"
        variant="outlined"
        size="small"
      />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchPostsStart: () => dispatch(fetchPostsStart()),
  deletePostStart: (id) => dispatch(deletePostStart(id)),
});

const mapStateToProps = createStructuredSelector({
  posts: selectPostsData,
  isFetching: selectPostsFetchStatus,
  errorMessage: selectPostsErrorMessage,
});

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
