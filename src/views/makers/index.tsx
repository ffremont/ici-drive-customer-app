import React from 'react';
import './Makers.scss';
import { Subscription } from 'rxjs';
import makerStore from '../../stores/makers';
import { Maker } from '../../models/maker';
import MenuApp from '../../components/menu-app';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import RoomIcon from '@material-ui/icons/Room';
import { Item } from '../../models/item';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { History } from 'history';
import TabPanel from '../../components/tab-panel';
import conf from '../../confs';
import mapService from '../../services/map.service';
import preferenceService, {GeoSearchPoint} from '../../services/preference.service';
import Fab from '@material-ui/core/Fab';
import { GeoPoint } from '../../models/geo-point';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Near from './near';
import Button from '@material-ui/core/Button';
import historyService from '../../services/history.service';



interface GraphicMaker extends Maker {
  // en km
  distance?: number;
}

//https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
class Makers extends React.Component<{ history: History, location: any }, { showEmptyResult: boolean, geoSearchPoint: GeoSearchPoint|null, openNear: boolean, gpsDisabled: boolean, waiting: boolean, geoPoint: GeoPoint, makers: GraphicMaker[], filterCat: string, value: number, categories: Item[] }>{
  state = { geoSearchPoint: null, waiting: false, openNear: false, gpsDisabled: false, showEmptyResult: false, makers: [], value: 0, categories: [], filterCat: 'all', geoPoint: { latitude: 0, longitude: 0 } };
  sub: Subscription | null = null;


  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
    preferenceService.getSearchPoint()
      .then((geoSearchPoint: GeoSearchPoint | null) => {
        if (geoSearchPoint === null) {
          this.setState({ gpsDisabled: true });
        } else {
          this.setState({ waiting: true, showEmptyResult: false, geoSearchPoint });
          makerStore.search(geoSearchPoint).finally(() => {
            this.setState({ waiting: false, showEmptyResult: true });
          })

          //this.setState({makers: this.computeGeoDistance(this.state.makers, geoSearchPoint) });
        }
    });

    this.sub = makerStore.subscribe((newMakers: Maker[]) => {
      const cats: any = {
        'all': { label: 'Tout', id: 'all' }
      };
      for (let ip in newMakers) {
        const part = newMakers[ip];
        if (part.categories) {
          for (let ic in part.categories) {
            const cat: string = part.categories[ic];
            if (!cats[cat] && conf.categories.some(c => c.id === cat)) {
              cats[cat] = conf.categories.find(c => c.id === cat);
            }
          }
        }
      }

      this.setState({
        makers: this.computeGeoDistance(newMakers, this.state.geoSearchPoint),
        categories: Object.values(cats)
      });
    });
  }

  private computeGeoDistance(makers: GraphicMaker[], geoPoint: GeoPoint|null): GraphicMaker[] {
    if (!geoPoint || (geoPoint.latitude === 0)) {
      return makers;
    }

    return makers.map((m: Maker) => {
      if (!m.place.point) { return m }

      return {
        ...m, distance: mapService.distance(
          geoPoint.latitude, geoPoint.longitude,
          m.place.point?.latitude || 0, m.place.point?.longitude || 0
        )
      }
    }).sort((a: GraphicMaker, b: GraphicMaker) => {
      if (a.distance) {
        return (a.distance as any) < (b.distance as any) ? -1 : 1;
      } else {
        return (a.name > b.name) ? 1 : (b.name > a.name) ? -1 : 0
      }
    });
  }

  changeTab(newValue: number) {
    const cat: any = this.state.categories.find((c, i) => i === newValue);

    if (cat) {
      this.setState({ value: newValue, filterCat: cat.id });
    } else {
      this.setState({ value: 0, filterCat: 'all' });
    }
  }

/**
 * Dès qu'on change l'adresse de la recherche
 * @param near 
 */
  onChangeNear(near: { latitude: number, longitude: number, address: string }) {
    const geoSearchPoint = {latitude:near.latitude, longitude: near.longitude, address: near.address};
    this.setState({
      geoSearchPoint,
      waiting: true, 
      showEmptyResult: false,
      gpsDisabled:false, 
      geoPoint: geoSearchPoint
    }); 
    preferenceService.setSearchPoint(geoSearchPoint).then(() => {});

    makerStore.search(geoSearchPoint).finally(() => {
      this.setState({ waiting: false, showEmptyResult: true });
    });    
  }


  render() {
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      this.changeTab(newValue);
    };

    const geoSearchPoint :any = this.state.geoSearchPoint;

    return (
      <div className="makers">
        <MenuApp mode="full" history={this.props.history} />
        <AppBar position="static">

          <Tabs value={this.state.value} onChange={handleChange} variant="scrollable" className="tabs" aria-label="catégories de produits">
            {this.state.categories.map((cat: Item, i: number) => <Tab key={'tab' + i} label={cat.label} value={i} />)}
          </Tabs>
        </AppBar>

        {this.state.categories.map((cat, i) => <TabPanel key={i} value={this.state.value} index={i}>
          <Grid container direction="column" justify="center" alignItems="center" spacing={1}>

            {this.state.showEmptyResult && (this.state.makers.length === 0) && (<div className="empty-makers">
              <Typography variant="h4">Aucun producteur</Typography>
              <Typography variant="h5">dans les {conf.makersNearKm} km </Typography>
            </div>)}
            {this.state.gpsDisabled && (<div className="empty-makers">
              <Typography variant="h4">GPS désactivé</Typography>
              <Typography variant="h5">Filtrer par adresse</Typography>
              
              <Button onClick={() => this.setState({ openNear: true })} variant="outlined" color="secondary">Rechercher</Button>
            </div>)}

            {this.state.makers.filter((p: Maker) => {
              if (this.state.filterCat === 'all') return true;
              else return p.categories.some((c: string) => c === this.state.filterCat)
            }).map((p: GraphicMaker, i) => {
              return (
                <Card key={i} onClick={() => this.props.history.push(`/makers/${p.id}/catalog`)}
                  className="maker-card">
                  <CardActionArea>
                    <CardMedia
                      className="maker-cardmedia"
                      image={p.image}
                      title="Bannière producteur"
                    />
                    <CardContent className="maker-cardcontent">
                      <div className="maincontent"><Typography gutterBottom variant="h5" component="h2">
                        {p.name}
                      </Typography>
                    
                      {p.distance && (<Chip label={p.distance ? `${p.distance.toFixed(1)}km` : 'inconnue'} className="distance-maker" color="default" icon={<RoomIcon />} />)}
                      </div>
                      <div className="subcontent">
                        {p.place.address}
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Grid>
        </TabPanel>)}

        <Fab className="near-search" color={geoSearchPoint && geoSearchPoint.latitude && geoSearchPoint.address && geoSearchPoint.longitude && (geoSearchPoint.address !== 'Autour de moi')? 'secondary' : 'primary'} aria-label="search" onClick={() => this.setState({ openNear: true })}>
          <RoomIcon />
        </Fab>

        <Near open={this.state.openNear} address={geoSearchPoint ? geoSearchPoint.address:''} onChange={(near: any) => this.onChangeNear(near)} onClose={() => this.setState({ openNear: false })} />

        {this.state.waiting && (<Backdrop className="backdrop" open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>)}
      </div>
    );
  }
}

export default Makers;
