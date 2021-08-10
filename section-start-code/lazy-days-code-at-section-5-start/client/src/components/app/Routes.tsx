import { ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Calendar } from '../appointments/Calendar';
import { AllStaff } from '../staff/AllStaff';
import { Treatments } from '../treatments/Treatments';
import { Signin } from '../user/Signin';
import { UserProfile } from '../user/UserProfile';
import { Home } from './Home';

export function Routes(): ReactElement {
  return (
    <Switch>
      <Route path="/Staff" component={AllStaff} />
      <Route path="/Calendar" component={Calendar} />
      <Route path="/Treatments" component={Treatments} />
      <Route path="/signin" component={Signin} />
      <Route path="/user/:id" component={UserProfile} />
      <Route path="/" component={Home} />
    </Switch>
  );
}
