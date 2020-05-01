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
import {History} from 'history';
import TabPanel from '../../components/tab-panel';
import conf from '../../confs';
import mapService from '../../services/map.service';
import { GeoPoint } from '../../models/geo-point';


interface GraphicMaker extends Maker{
  // en km
  distance?:number;
}

//https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
class Makers extends React.Component<{history:History}, { geoPoint: GeoPoint, makers: GraphicMaker[], filterCat: string, value: number, categories: Item[] }>{
  state = { makers: [], value: 0, categories: [], filterCat: 'all', geoPoint: {latitude:0, longitude:0} };
  sub: Subscription | null = null;


  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  componentDidMount() {
    mapService.getCurrentPosition()
    .then( (geoPoint: GeoPoint) =>{
      
      makerStore.search(geoPoint);

      this.setState({geoPoint, makers: this.computeGeoDistance(this.state.makers, geoPoint)});
    }).catch(e=>{
      alert('La géolocation est nécessaire pour ici-drive.fr, merci de l\'activer.');
      (window as any).location.reload();
    });

    this.sub = makerStore.subscribe((newMakers: Maker[]) => {
      const cats: any = {
        'all': { label: 'Tout', id: 'all' }
      };
      for (let ip in newMakers) {
        const part = newMakers[ip];
        if (part.categories) {
          for (let ic in part.categories) {
            const cat:string = part.categories[ic];
            if (!cats[cat] && conf.categories.some(c => c.id === cat)) {
              cats[cat] = conf.categories.find(c => c.id===cat);
            }
          }
        }
      }

      this.setState({
        makers: this.computeGeoDistance(newMakers, this.state.geoPoint),
        categories: Object.values(cats)
      });
    });
  }

  private computeGeoDistance(makers:GraphicMaker[], geoPoint : GeoPoint): GraphicMaker[]{
    if(!geoPoint || (geoPoint.latitude === 0)){
      return makers;
    }

    return makers.map( (m:Maker) => {
      if(!m.place.point){ return m}

      return {...m, distance : mapService.distance(
        geoPoint.latitude, geoPoint.longitude,
        m.place.point?.latitude || 0, m.place.point?.longitude || 0
        )}
    }).sort( (a: GraphicMaker,b: GraphicMaker)=>{
      if(a.distance){
        return (a.distance as any) < (b.distance as any) ? -1 : 1;
      }else{
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


  render() {
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      this.changeTab(newValue);
    };

    return (
      <div className="makers">
        <MenuApp mode="full" history={this.props.history}/>
        <AppBar position="static">
          
          <Tabs value={this.state.value} onChange={handleChange} variant="scrollable" className="tabs" aria-label="catégories de produits">
            {this.state.categories.map((cat: Item, i: number) => <Tab key={'tab'+i} label={cat.label} value={i} />)}
          </Tabs>
        </AppBar>

        {this.state.categories.map((cat, i) => <TabPanel key={i} value={this.state.value} index={i}>
          <Grid container direction="column" justify="center" alignItems="center" spacing={1}>

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
                      <Typography gutterBottom variant="h5" component="h2">
                        {p.name}
                      </Typography>
                      <Chip label={p.distance ? `${p.distance.toFixed(1)}km` : 'inconnue'} className="distance-maker" color="default" icon={<RoomIcon />} />
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
          })}
          </Grid>
        </TabPanel>)}
      </div>
    );
  }
}

export default Makers;
