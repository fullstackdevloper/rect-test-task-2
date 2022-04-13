import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";

import "semantic-ui-css/semantic.min.css";
import "react-multi-carousel/lib/styles.css";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Carousal from "../../components/Carousal";
import ListItemLink from "../../containers/components/link";

const useStyles = makeStyles((theme) => ({
        
    }));

function App() {
    const classes = useStyles();
    return (
            <div className={classes.root}>
                <Box className={classes.App}>
                    <Carousal/>
                </Box>
                <ListItemLink primary='All Posts' to='/posts' />
                <ListItemLink primary='All Comments' to='/comments' />
            </div>
            );
}

export default App;
