import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Question } from "./Question";

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  name: string;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  description: string;

  @OneToMany(() => Post, (post) => post.device)
  posts: Post[];

  @OneToMany(() => Question, (question) => question.device)
  questions: Question[];
}
