import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        maxWidth: 645,
    },
    actions:{
        justifyContent:"flex-end"
    }
});


const Discover = (props: any) => {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="image"
                    height={props.height}
                    image={props.image}
                    title="Producteur / artisan"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
          </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
          </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions onClick={() => window.open((props.learnMore))} className={classes.actions}>
                <Button size="small" color="primary">
                    En savoir plus
                </Button>
            </CardActions>
        </Card>
    );
}

export default Discover;