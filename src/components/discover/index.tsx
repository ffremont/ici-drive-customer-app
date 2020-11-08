import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EuroIcon from '@material-ui/icons/Euro';
import PaypalIcon from '../../assets/images/paypal.svg';
import BankCheckIcon from '../../assets/images/bank_check.svg';
import { PaymentMaker } from '../../models/maker';
import './Discover.scss';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import MoneyIcon from '@material-ui/icons/Money';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import { Avatar, Chip } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 645,
    },
    actions: {
        justifyContent: "flex-end"
    },
    payments: {
        marginTop: 13,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paymentItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 20px",
        fontSize: "1rem",
        border: "1px solid #80808070",
        borderRadius: "8px",
        margin: "0 10px"
    },
    myDisabled: {
        opacity: 0.5
    },
    btnPay: {
        marginLeft: 10,
    },
    moneyIcon: {
        width: 26,
        height: 26
    },
    moneyLabel: {
        marginLeft: 10,
        fontSize: '0.8rem',
        textAlign: 'center'
    }
});


const Discover = (props: any) => {
    const classes = useStyles();
    const payments = props.payments as PaymentMaker;

    return (
        <Card className={`${classes.root} discover-card`}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="image"
                    height={props.height}
                    image={props.image}
                    title="Producteur / artisan"
                />
                <CardContent className="discover-content">
                    <div className="modes">
                        <Avatar className="avatar-mode">
                            <DriveEtaIcon />
                        </Avatar>
                        {props.delivery && (<Avatar className="avatar-mode">
                            <LocalShippingIcon />
                        </Avatar>)}
                    </div>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
                    </Typography>

                    {props.delivery && (<div className="delivery-info">
                        <Chip className="d-info"
                            avatar={<Avatar className="avatar-transparent"><EuroIcon /></Avatar>}
                            label={!props.deliveryCost ? 'Livraison gratuite' : `${props.deliveryCost}€ la livraison`}
                            color="secondary"
                        />
                        {props.deliveryRadius && (<Chip className="d-info"
                            avatar={<Avatar className="avatar-transparent"><TrackChangesIcon /></Avatar>}
                            label={`Rayon : ${props.deliveryRadius}km`}
                            color="secondary"
                        />)}
                        <Chip className="d-info"
                            avatar={<Avatar className="avatar-transparent"><ShoppingBasketIcon /></Avatar>}
                            label={props.deliveryAvailableFrom ? `Minimum ${props.deliveryAvailableFrom}€` :`Aucun min. d'achats`}
                            color="secondary"
                        />
                    </div>)}

                    <Typography variant="body2" color="textSecondary" className="makerDesc" component="p">
                        {props.description}
                    </Typography>

                    {props.payments && (<div className={`${classes.payments} payments`}>
                        {payments.acceptPaypal && (<div className={`${classes.paymentItem} ${!payments.acceptPaypal ? classes.myDisabled : ''}`}>
                            <img className={classes.moneyIcon} alt="paypal" src={PaypalIcon} />
                            <span className={classes.moneyLabel}>Paiement en ligne</span>
                        </div>)}
                        {(payments.acceptCards || payments.acceptCoins || payments.acceptCards) && (<div className={`${classes.paymentItem} ${!payments.acceptCards && !payments.acceptCoins ? classes.myDisabled : ''}`}>
                            <CreditCardIcon className={`${classes.moneyIcon} ${!payments.acceptCards ? classes.myDisabled : ''}`} />
                            <MoneyIcon className={`${classes.moneyIcon} ${!payments.acceptCoins ? classes.myDisabled : ''}`} />
                            <img className={`${classes.moneyIcon} ${!payments.acceptBankCheck ? classes.myDisabled : ''}`} alt="bank_check" src={BankCheckIcon} />
                            <span className={classes.moneyLabel}>Paiement</span>
                        </div>)}
                    </div>)}
                </CardContent>
            </CardActionArea>
            <CardActions className={classes.actions}>
                <Button onClick={props.openSlots} startIcon={<AccessTimeIcon></AccessTimeIcon>} size="small" color="primary">
                    Horaires
                </Button>
                <Button onClick={props.goToPlace} startIcon={<RoomIcon></RoomIcon>} size="small" color="primary">
                    Lieu du Drive
                </Button>
                {props.learnMore && (<Button onClick={() => window.open((props.learnMore))} size="small" color="primary">
                    En savoir plus
                </Button>)}
            </CardActions>
        </Card>
    );
}

export default Discover;