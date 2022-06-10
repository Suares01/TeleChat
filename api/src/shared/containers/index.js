import { Container } from 'typedi';

import { ExpressServer } from '../../components/http/express/Server';

Container.set('Server', new ExpressServer());
