import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = []
  clientToUser = {}
  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message =
    {
      name: this.clientToUser[clientId],
      text: createMessageDto.text
    };
    this.messages.push(message);

    return message;
  }

  findAll() {
    return this.messages;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return this.clientToUser;  // Optional: Return the updated clientToUser object if needed
  }


  getClientName(clientId: string) {
    return this.clientToUser[clientId]
  }
}
