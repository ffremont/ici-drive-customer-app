import React from 'react';
import MenuApp from '../../components/menu-app';
import conf from '../../confs';
import historyService from '../../services/history.service';

function Mentions(props: any) {
  historyService.on(window.location.pathname);
  return (
    <div className="mentions">
      <MenuApp mode="light" history={props.history} />

      <div className="area">
      <ul>  
              <li>
              <a href={conf.mentions}  rel="noreferrer noopener" target="_blank">Mentions</a>
              </li>
              <li>
              <a href={conf.cgu} target="_blank" rel="noreferrer noopener">Conditions générales d'utilisation</a>
              </li>
              <li>
              
              <a href={conf.cgr} target="_blank" rel="noreferrer noopener">Conditions générales de réservation</a>
              </li>
              <li>
              <a href={conf.privacy_policy} rel="noreferrer noopener" target="_blank">Politique de confidentialité</a>
              </li>
              <li>
              <a href={conf.acceptableUsePolicy} rel="noreferrer noopener" target="_blank">Politique d'utilisation acceptable	</a>
              </li>
            </ul>
      </div>
    </div>
  );
}

export default Mentions;
