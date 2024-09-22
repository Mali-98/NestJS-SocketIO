import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Socket, Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) { }

  @SubscribeMessage('createMessage') //create a message
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    const message = await this.messagesService.create(createMessageDto, client.id)

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages') //find all messages in chat
  findAll() {
    return this.messagesService.findAll();
  }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  @SubscribeMessage('updateMessage') //edit a message from chat
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage') //removes a message from chat
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('join')   //allows users to join chat
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.identify(name, client.id);
    client.emit('joined', { success: true });
  }


  @SubscribeMessage('typing') //To know if user is typing or not
  async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket,
  ) {
    const name = await this.messagesService.getClientName(client.id)
    client.broadcast.emit('typing', { name, isTyping })
  }
}
