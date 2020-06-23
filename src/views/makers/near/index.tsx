
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import mapService from '../../../services/map.service';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { GeoPoint } from '../../../models/geo-point';
import TextField from '@material-ui/core/TextField';
import './Near.scss';


const Near = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [myPosition, setMyPosition] = React.useState({ longitude: 0, latitude: 0 });

  React.useEffect(() => {
    mapService.getCurrentPosition()
      .then((geoPoint: GeoPoint) => {
        setMyPosition(geoPoint);
      }).catch(e => {
        console.error(e);
      });

    setOpen(props.open);
  }, [props.open])

  React.useEffect(() => {
    setAddress(props.address);
  }, [props.address]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const onSelectAddress = (newAddress: string) => {
    geocodeByAddress(newAddress)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        if (props.onChange) props.onChange({ latitude: lat, longitude: lng, address: newAddress });
      });
  };

  const onAutourDeMoi = () => {
    handleClose();
    if (props.onChange) props.onChange({ latitude: myPosition.latitude, longitude: myPosition.longitude, address: 'Autour de moi' });
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Rechercher</DialogTitle>
      <DialogContent>

        {address && (<TextField className="current-address"
          fullWidth
          value={address}
          label="Adresse choisie"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />)}

        {process.env.REACT_APP_STAGE === 'prod' && (
          <GooglePlacesAutocomplete
            placeholder='Rechercher par adresse...'
            inputClassName={`gg-input-maps full-width`}
            autocompletionRequest={{
              componentRestrictions: {
                country: ['fr'],
              }
            }}
            onSelect={(place: any) => onSelectAddress(place.description)}
          />
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Fermer
          </Button>
        {myPosition && myPosition.longitude !== 0 && myPosition.latitude !== 0 && (<Button onClick={onAutourDeMoi} color="primary" autoFocus>
          Autour de moi
        </Button>)}
        <Button onClick={handleClose} color="primary" autoFocus>
          Rechercher
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Near;