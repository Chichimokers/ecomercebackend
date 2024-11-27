import { ApiProperty } from "@nestjs/swagger";

export class GetUserDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier for the user",
    })
    id: number;

    @ApiProperty({
        example: "2024-11-16T23:09:57.598Z",
        description: "Date when the user was created",
    })
    created_at: string;

    @ApiProperty({
        example: "2024-11-16T23:09:57.598Z",
        description: "Date when the user was last updated",
    })
    updated_at: string;

    @ApiProperty({
        example: null,
        description: "Date when the user was deleted, if applicable",
        nullable: true,
    })
    deleted_at: string | null;

    @ApiProperty({
        example: "John Doe",
        description: "Name of the user",
    })
    name: string;

    @ApiProperty({
        example: "johndoe@gmail.com",
        description: "Email of the user",
    })
    email: string;

    @ApiProperty({
        example: 2,
        description: "Role identifier for the user",
    })
    rol: number;

    @ApiProperty({
        example: "$2b$10$3n.A1oVPb25o4eXij9AfAebrqV8MU8a4McU5pncv5Tc8W0VhnhZXG",
        description: "Hashed password of the user",
    })
    password: string;

    @ApiProperty({
        example: true,
        description: "Indicates if the user is enabled",
    })
    enabled: boolean;

    @ApiProperty({
        example: null,
        description: "Date when the user last logged in, if applicable",
        nullable: true,
    })
    last_login: string | null;

    @ApiProperty({
        example: false,
        description: "Indicates if the user account is locked",
    })
    locked: boolean;
}