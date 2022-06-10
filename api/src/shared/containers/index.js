import { Container } from 'typedi';

import { ExpressServer } from '../../components/http/express/Server';
import { BcryptjsHashService } from '../../services/hashService';
import { JsonwebtokenTokenService } from '../../services/TokenService';

Container.set('Server', new ExpressServer());
Container.set('HashService', new BcryptjsHashService());
Container.set('TokenService', new JsonwebtokenTokenService());
