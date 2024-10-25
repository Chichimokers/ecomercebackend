import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';


export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
