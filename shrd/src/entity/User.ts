import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Question } from "./Question";
import { Answer } from "./Answer";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  name: string;

  @Column({
    charset: "UTF8_GENERAL_CI"
  })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (asnwer) => asnwer.user)
  answers: Answer[];
}

export class Password {
  private _hashed: string;
  constructor(password: string) {
    this._hashed = bcrypt.hashSync(password, 10);
  }

  public get hashed() {
    return this._hashed;
  }

  public set hashed(value: string) {
    this._hashed = bcrypt.hashSync(value, 10);
  }
}

export class HashedPassword {
  private _hashed: string;

  constructor(hashed: string) {
    this._hashed = hashed;
  }

  public get hashed() {
    return this._hashed;
  }

  public set hashed(value: string) {
    this._hashed = value;
  }

  public compare(other: string): boolean {
    return bcrypt.compareSync(other, this._hashed);
  }
}

export class JWT {
  private _token: string;
  private _secret: string;

  constructor(data: object, secret: string) {
    this._secret = secret;
    this._token = jwt.sign(data, this._secret);
  }

  public get token() {
    return this._token;
  }

  public set token(value: string) {
    this._token = jwt.sign(value, this._secret);
  }
}

export class CreatedJWT {
  private _token: string;
  private _secret: string;

  constructor(token: string, secret: string) {
    this._token = token;
    this._secret = secret;
  }

  public verify(): jwt.JwtPayload | null | string {
    try {
      const result = jwt.verify(this._token, this._secret);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
