import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, InviteSchema } from './models/invite.model';
import { Peer,   PeerSchema   } from './models/peer.model';
import { InviteRepo } from './repositories/invite.repository';
import { PeerRepo   } from './repositories/peer.repository';
import { SharedAccessService } from './shared-access.service';
import { SharedAccessController } from './shared-access.commands';
import { UserRepository } from '../user/repositories/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Invite.name, schema: InviteSchema },
      { name: Peer.name,   schema: PeerSchema   },
    ]),
    UserModule
  ],
  providers:[ InviteRepo, PeerRepo, SharedAccessService ],
  controllers:[ SharedAccessController ],
  exports:[ SharedAccessService ],
})
export class SharedAccessModule {}