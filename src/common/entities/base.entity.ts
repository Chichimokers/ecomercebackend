import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({ nullable: true })
    // author_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    // @BeforeInsert()
    // @BeforeUpdate()
    // setAuthor(currentUserid: string) {
    //     if (currentUserId) {
    //         this.author_id = currentUserId;
    //     }
    // }
}
