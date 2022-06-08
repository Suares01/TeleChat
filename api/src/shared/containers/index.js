import { Container } from 'typedi';

import { ExpressServer } from '../../http/express/Server';

Container.set('Server', new ExpressServer());
