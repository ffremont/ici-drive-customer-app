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
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import makerService, { MakerService } from '../../services/maker.service';
import historyService from '../../services/history.service';
import Other from './other';

interface SlotButton {
  selected: boolean;
  at: Date;
  label: string;
}

interface SlotGroup {
  label: string;
  slots: SlotButton[]
}


class Slots extends React.Component<{ history: any, match: any }, { order: Order | null, tabId: number, groups: SlotGroup[], openOther:boolean, firstSlot:any }>{

  state = { order: null, wantResetCard: false, groups: [], tabId: 0, openOther:false, firstSlot:null };
  subOrder: Subscription | null = null;

  componentWillUnmount() {
    this.subOrder?.unsubscribe();
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
    const tomorowLabel = moment.default().format('ddd D MMM');

    this.subOrder = cartStore.subscribe((order: Order) => {
      if (order.ref && order.maker) {
        const newGroups: SlotGroup[] = [];

        const slots = makerService.getSlots(order.maker, -1, order.wantDelivery);
        
        for (let i = 0; i < slots.length; i++) {
          const slotDate: Date = slots[i];

          const groupLabel: string = moment.default(slotDate).format('ddd D MMM'); // mer 23 mars
          let group = newGroups.find((g: SlotGroup) => g.label === groupLabel);
          const slotButton: SlotButton = { selected: false, at: slotDate, label: moment.default(slotDate).format('HH:mm') };
          if (group) {
            // ajout du créneau sur le groupe (date existante : onglet)
            (group as SlotGroup).slots.push(slotButton);
          } else {
            newGroups.push({
              label: groupLabel === tomorowLabel ? 'Demain' : groupLabel,
              slots: [slotButton]
            });
          }
        }

        this.setState({ order, groups: newGroups, firstSlot: slots && slots.length ? slots[0]: 0  });
      } else {
        this.props.history.push('/');
      }
    });
  }

  validate(){
    const newOrder :Order = {...(this.state.order as any)};

    const group:any = this.state.groups.find((g:SlotGroup) => g.slots.some((s:SlotButton) => s.selected));
    if(group){
      newOrder.slot = (group.slots.find((s:SlotButton) => s.selected) as any).at.getTime();
      cartStore.set(newOrder);
  
      this.props.history.push('/cart/summary');
    }else{
      this.props.history.push('/error');
    }
  }

  /**
   * Aucun créneau ne me convient, j'opte pour une note
   * @param note 
   */
  validateOther(note:string, slot:Date){
    const newOrder :Order = {...(this.state.order as any)};
    newOrder.comment = note;
    newOrder.slot = slot.getTime();
    cartStore.set(newOrder);
  
    this.props.history.push('/cart/summary');
  }

  /**
   * Choisi un créneau sur un jour
   * @param g 
   * @param sb 
   */
  selectSlot(g: SlotGroup, sb: SlotButton){
    const newGroups = this.state.groups.concat([]);
    newGroups.forEach((sg:SlotGroup) => {
      sg.slots.forEach((b:SlotButton) => {
        b.selected = (g.label===sg.label) && (b.label === sb.label) ? true : false;
      })
    });

    this.setState({groups:newGroups});
  }

  onChangeTag(event: React.ChangeEvent<{}>, newValue: number) {
    this.setState({ tabId: newValue });
  };

  render() {
    const place = this.state.order ? ((this.state.order as any) as Order).maker?.place : null;
    const order = this.state.order ? ((this.state.order as any) as Order):null;
    return (
      <div className="slots">
       {order && !order.wantDelivery &&(<MenuApp mode="slotsDrives" history={this.props.history} />)}
       {order && order.wantDelivery &&(<MenuApp mode="slotsDeliveries" history={this.props.history} />)}

      <Other open={this.state.openOther}
        firstSlot={this.state.firstSlot}
       onClose={() =>{this.setState({openOther:false})}}
       onValidate={(note:string, slot:Date) => this.validateOther(note, slot)}
       />

        
        <AppBar position="static" color="default">
          <Tabs className="slots-tabs" variant="scrollable" scrollButtons="auto" textColor="secondary" value={this.state.tabId} onChange={(e, nv) => this.onChangeTag(e, nv)} aria-label="simple tabs example">

            {this.state.groups.map((g: SlotGroup, i) => (
              <Tab label={g.label} key={`slots_tab_${i}`}/>
            ))}
          </Tabs>
        </AppBar>

        {this.state.groups.map((g: SlotGroup, i) => (
          <TabPanel key={`slots_tp_${i}`} value={this.state.tabId} index={i}>

            <div className="slots-in-group">
              {g.slots.map((sb:SlotButton, j) => (
                <div key={`slots_tp_btn_${i}${j}`} className="slot">
                  <Button disableElevation={true} variant="outlined" onClick={() => this.selectSlot(g,sb)} disabled={sb.selected}>{sb.label}</Button>
                </div>
              ))}
            </div>

          </TabPanel>
        ))}

        <div className="slot-footer">
          <div className="main-action">
            <Button className="btn-action" variant="contained" onClick={() => this.validate()} color="secondary" disabled={!this.state.groups.some((g:SlotGroup) => g.slots.some((s:SlotButton) => s.selected))}>Valider le créneau</Button>

            {order && order?.wantDelivery && (<Button className="btn-action" variant="contained" onClick={() => this.setState({openOther:true})} color="primary">Autre</Button>)}
          </div>
        </div>

      </div>
    );
  }
}

export default Slots;
