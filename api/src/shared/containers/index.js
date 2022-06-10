import { Container } from 'typedi';

import { ExpressServer } from '../../components/http/express/Server';
import { BcryptjsHashService } from '../../services/hashService';

Container.set('Server', new ExpressServer());
Container.set('HashService', new BcryptjsHashService());
