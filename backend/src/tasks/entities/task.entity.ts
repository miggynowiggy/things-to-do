import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
  @PrimaryKey()
  _id: ObjectId;

  @ApiProperty({
    example: '66595f2e1d6dc024a06c4ec6',
    description: 'ID of the task, in format of Object ID in MongoDB',
  })
  @SerializedPrimaryKey()
  id!: string;

  @ApiProperty({ example: 'My todo', description: 'Description of the task' })
  @Property()
  content!: string;

  @ApiProperty({ example: true, description: 'Determines if the task is done' })
  @Property()
  isDone!: boolean;

  @ApiProperty({
    example: '2024-05-31T05:25:02.308Z',
    description: 'Date Time describing when the task is created',
  })
  @Property()
  dateCreated = new Date();

  @ApiProperty({
    example: '2024-05-31T05:25:02.308Z',
    description: 'Date Time describing when the task is update',
  })
  @Property({ onUpdate: () => new Date() })
  dateUpdated = new Date();

  constructor(content: string) {
    this.content = content;
    this.isDone = false;
  }
}
