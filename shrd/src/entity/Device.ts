import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Question } from "./Question";

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Post, (post) => post.device)
  posts: Post[];

  @OneToMany(() => Question, (question) => question.device)
  questions: Question[];
}
