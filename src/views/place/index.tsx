import React from 'react';
import './Place.scss';
import { Subscription } from 'rxjs';
import Grid from '@material-ui/core/Grid';
import makerStore from '../../stores/makers';
import { Maker } from '../../models/maker';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RoomIcon from '@material-ui/icons/Room';

class Place extends React.Component<{ history: any, match: any }, { maker: Maker | null }>{

  state = { maker: null };

  subMakers: Subscription | null = null;

  componentWillUnmount() {
    this.subMakers?.unsubscribe();
  }

  componentDidMount() {
    const makerId = this.props.match.params.id;
    this.subMakers = makerStore.subscribe((makers: Maker[]) => {
      const maker = makers.find((p: Maker) => p.id === makerId) || null;
      if (!maker) {
        console.error("maker not found : " + makerId);
        //this.props.history.push('/');
      } else {
        this.setState({
          maker
        })
      }
    });

    makerStore.refresh(makerId);
  }

  render() {
    const maker = (this.state.maker as any) as Maker;

    return (<div className="place">
      <MenuApp mode="light" history={this.props.history} />

      {maker && maker.place && (<Grid className="place-container" container direction="column" justify="center" alignItems="center">
        {maker?.place?.image && (<Grid item>
          <img className="place-image" src={maker?.place.image} alt="endroit du drive" />
        </Grid>)}
        <Grid item>
          <div><Typography variant="h4" gutterBottom>{maker.place.label}</Typography>
            <Typography variant="subtitle1">{maker.place.slotsDescription}</Typography>
            {maker.place.description && (<Typography variant="body1">{maker.place.description}</Typography>)}</div>
        </Grid>
        <Grid item>
        <Button
        variant="contained"
        color="primary"
        onClick={() => window.open(`https://www.google.fr/maps/place/${window.encodeURI(maker.place.address||'')}`)}
        size="large"
        className="place-look"
        startIcon={<RoomIcon />}
      >
        Consulter la carte
      </Button>
        </Grid>
      </Grid>)}
    </div>);
  }
}


export default Place;
