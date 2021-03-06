import React from 'react';
import './Error.scss';
import MenuApp from '../../components/menu-app';
import BugReportIcon from '@material-ui/icons/BugReport';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import conf from '../../confs';
import historyService from '../../services/history.service';

function Error(props: any) {
  historyService.on(window.location.pathname);
  return (
    <div className="error">
      <MenuApp mode="light" history={props.history} />

      <div className="area">
        <BugReportIcon />
        <Typography variant="h4">Une erreur est survenue</Typography>
        <Button color="secondary" onClick={() => window.open(conf.support)}>Déposer un ticket</Button>
      </div>
    </div>
  );
}

export default Error;
