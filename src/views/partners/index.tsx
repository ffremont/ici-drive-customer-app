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

interface Category{
  label:string;
  name: string;
}

//https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
class Partners extends React.Component<{}, { partners: Partner[], value: number, categories:Category[] }>{
  state = { partners: [], value: 0, categories: [{
    label: 'Tout',
    name: 'all'
  },{
    label: 'Veau / boeuf',
    name: 'veau-boeuf'
  }] };
  sub: Subscription | null = null;


  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  componentDidMount(){
    this.sub = partnerStore.subscribe((newPartners: Partner[]) => {
      console.log("new value partners : ");
      console.log(newPartners);
      this.setState({
        partners: newPartners
      })
    });
  }


  render() {
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      this.setState({ value: newValue });
    };

    return (
      <div className="partners">
        <MenuApp />
        <AppBar position="static">
            <Tabs value={this.state.value} onChange={handleChange}  variant="scrollable" className="tabs" aria-label="catégorie de produit">
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
          </AppBar>

          
          <TabPanel value={this.state.value} index={0}>
            Item One
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            Item Two
      </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            Item Three
      </TabPanel>
      </div>
    );
  }
}

export default Partners;
