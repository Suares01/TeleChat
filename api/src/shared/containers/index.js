import { Container } from 'typedi';

import {
  PrismaUsersRepository,
  PrismaContactsRepository,
} from '../../components/users/repositories';
import { BcryptjsHashService } from '../../components/users/services/hashService';
import { JsonwebtokenTokenService } from '../../components/users/services/TokenService';
import { ExpressServer } from '../../http/express/Server';

Container.set('Server', new ExpressServer());
Container.set('HashService', new BcryptjsHashService());
Container.set('TokenService', new JsonwebtokenTokenService());
Container.set('UsersRepository', new PrismaUsersRepository());
Container.set('ContactsRepository', new PrismaContactsRepository());
