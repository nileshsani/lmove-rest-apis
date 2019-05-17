import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    distance: number;

    @Column()
    status: string;
}
