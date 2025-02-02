import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({ nullable: true })
    // author_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    // @BeforeInsert()
    // @BeforeUpdate()
    // setAuthor(currentUserId: number) {
    //     if (currentUserId) {
    //         this.author_id = currentUserId;
    //     }
    // }
}
