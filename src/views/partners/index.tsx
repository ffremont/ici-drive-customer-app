import React from 'react';
import './Partners.scss';
import { Subscription } from 'rxjs';
import partnerStore from '../../stores/partners';
import { Partner } from '../../models/partner';
import MenuApp from '../../components/menu-app';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import RoomIcon from '@material-ui/icons/Room';
import { Item } from '../../models/item';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {History} from 'history';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

//https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
class Partners extends React.Component<{history:History}, { partners: Partner[], filterCat: string, value: number, categories: Item[] }>{
  state = { partners: [], value: 0, categories: [], filterCat: 'all' };
  sub: Subscription | null = null;

  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  componentDidMount() {
    this.sub = partnerStore.subscribe((newPartners: Partner[]) => {
      const cats: any = {
        'all': { label: 'Tout', id: 'all' }
      };
      for (let ip in newPartners) {
        const part = newPartners[ip];
        if (part.categories) {
          for (let ic in part.categories) {
            const cat = part.categories[ic];
            if (!cats[cat.id]) {
              cats[cat.id] = cat;
            }
          }
        }
      }

      // calculer la distance du smartphone
      // 

      this.setState({
        partners: newPartners,
        categories: Object.values(cats)
      });
    });

    partnerStore.refresh();
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
      <div className="partners">
        <MenuApp mode="full" history={this.props.history}/>
        <AppBar position="static">
          <Tabs value={this.state.value} onChange={handleChange} variant="scrollable" className="tabs" aria-label="catégories de produits">
            {this.state.categories.map((cat: Item, i: number) => <Tab key={i} label={cat.label} value={i} />)}
          </Tabs>
        </AppBar>

        {this.state.categories.map((cat, i) => <TabPanel key={i} value={this.state.value} index={i}>
          <Grid container direction="column" justify="center" alignItems="center" spacing={1}>

            {this.state.partners.filter((p: Partner) => {
              if (this.state.filterCat === 'all') return true;
              else return p.categories.some((c: Item) => c.id === this.state.filterCat)
            }).map((p: Partner, i) => {
              return (
                <Card key={i} onClick={() => this.props.history.push(`/partners/${p.id}`)}
                className="partner-card">
                  <CardActionArea>
                    <CardMedia
                      className="partner-cardmedia"
                      image={p.image}
                      title="Bannière producteur"
                    />
                    <CardContent className="partner-cardcontent">
                      <Typography gutterBottom variant="h5" component="h2">
                        {p.name}
                      </Typography>
                      <Chip label="10km" className="distance-partner" color="default" icon={<RoomIcon />} />
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

export default Partners;
