import React from 'react';
import './Slots.scss';
import cartStore from '../../stores/cart';
import { Order } from '../../models/order';
import { Subscription } from 'rxjs';
import MenuApp from '../../components/menu-app';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../../components/tab-panel';
import Typography from '@material-ui/core/Typography';
import * as moment from 'moment';
import makerService from '../../services/maker.service';

interface SlotButton{
  selected:boolean;
  at:Date;
  label:string;
}

interface SlotGroup{
  label:string;
  slots: SlotButton[]
}


class Slots extends React.Component<{ history: any, match: any }, { order: Order | null, tabId: number, groups: SlotGroup[]}>{

  state = { order: null, wantResetCard: false, groups:[], tabId:0};
  subOrder: Subscription | null = null;

  componentWillUnmount() {
    this.subOrder?.unsubscribe();
  }

  componentDidMount() {
    const tomorowLabel = moment.default().format('ddd D MMM');

    this.subOrder = cartStore.subscribe((order: Order) => {
      if (order.ref && order.maker) {
        const newGroups : SlotGroup[]= [];
        
        const slots = makerService.getSlots(order.maker);
        for(let i = 0; i< slots.length;i++){
          const slotDate:Date = slots[i];

          const groupLabel:string = moment.default(slotDate).format('ddd D MMM'); // mer 23 mars
          let group = newGroups.find((g:SlotGroup) => g.label === groupLabel);
          const slotButton : SlotButton = { selected:false, at: slotDate, label: moment.default(slotDate).format('HH:mm')};
          if(group){
            // ajout du créneau sur le groupe (date existante : onglet)
            (group as SlotGroup).slots.push(slotButton);
          }else{
            newGroups.push({
              label: groupLabel === tomorowLabel ? 'Demain' : groupLabel,
              slots:[slotButton]
            });
          }
        }

        this.setState({ order, groups:newGroups });
      } else {
        this.props.history.push('/');
      }
    });
  }

  onChangeTag(event: React.ChangeEvent<{}>, newValue: number) {
    this.setState({tabId:newValue});
  };

  render() {
    const place = this.state.order ? ((this.state.order as any) as Order).maker?.place : null;
    return (
      <div className="slots">
        <MenuApp mode="slots" history={this.props.history} />

       {place && place.slotsDescription && (<Typography variant="h4">
          {place?.slotsDescription}
        </Typography>)}

        <AppBar position="static">
          <Tabs  className="slots-tabs" textColor="secondary" value={this.state.tabId} onChange={(e, nv) => this.onChangeTag(e, nv)} aria-label="simple tabs example">
           
            <Tab label="Item One" />
            <Tab label="Item 2" />
            <Tab label="Item 3" />
          </Tabs>
        </AppBar>


        <TabPanel value={this.state.tabId} index={0}>
          Item One
      </TabPanel>
        <TabPanel value={this.state.tabId} index={1}>
          Item Two
      </TabPanel>
        <TabPanel value={this.state.tabId} index={2}>
          Item Three
      </TabPanel>
      </div>
    );
  }
}

export default Slots;
